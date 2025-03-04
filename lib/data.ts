export const revalidate = 0;

import { connectDb } from "./mongodb";
import { Client, Email } from "./types";
import { ObjectId } from "mongodb";
import { calculateResponseTime } from "./emailService";
import { analyzeEmail } from "./gpt";

export async function getClients(): Promise<Client[]> {
  const db = await connectDb();
  const clients = await db.collection("clients").find({}).toArray();

  return clients.map((client) => ({
    id: client._id.toString(),
    sender: client.sender,
    company: client.company,
    emails: client.emails,
  }));
}

export async function getClientById(id: string): Promise<Client | null> {
  const db = await connectDb();
  const client = await db
    .collection("clients")
    .findOne({ _id: new ObjectId(id) });

  if (!client) return null;

  return {
    id: client._id.toString(),
    sender: client.sender,
    company: client.company,
    emails: client.emails,
  };
}

export async function saveClientsToDb(clients: Client[]) {
  const db = await connectDb();
  const collection = db.collection("clients");

  const allEmails = clients.flatMap((client) => client.emails);
  const responseTimes = calculateResponseTime(allEmails);

  for (const client of clients) {
    const existingClient = await collection.findOne({ company: client.company });

    if (existingClient) {
      const existingEmailIds = new Set(existingClient.emails.map((e: Email) => e.id));
      const newEmails = client.emails.filter((email) => !existingEmailIds.has(email.id));

      for (const email of newEmails) {
        const responseTime = responseTimes[email.id] || -1;
        email.scores = await analyzeEmail(email.body, responseTime);
      }

      const updatedEmails = [...existingClient.emails, ...newEmails]
        .filter((email, index, self) => self.findIndex(e => e.id === email.id) === index)
        .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

      await collection.updateOne(
        { company: client.company },
        { $set: { emails: updatedEmails } }
      );

    } else {
      for (const email of client.emails) {
        const responseTime = responseTimes[email.id] || -1;
        email.scores = await analyzeEmail(email.body, responseTime);
      }

      await collection.insertOne(client);
    }
  }
}

export function getAverageScore(client: Client) {
  if (!client || client.emails.length === 0) {
    return {
      responseTime: 0,
      fairness: 0,
      respect: 0,
      professionalism: 0,
      totalScore: 0,
    };
  }

  const scoredEmails = client.emails.filter(
    (email) => email.scores && email.scores.totalScore !== undefined
  );

  if (scoredEmails.length === 0) {
    return {
      responseTime: 0,
      fairness: 0,
      respect: 0,
      professionalism: 0,
      totalScore: 0,
    };
  }

  const totalScores = scoredEmails.reduce(
    (acc, email) => {
      acc.responseTime += email.scores.responseTime.score || 0;
      acc.fairness += email.scores.fairness.score || 0;
      acc.respect += email.scores.respect.score || 0;
      acc.professionalism += email.scores.professionalism.score || 0;
      acc.totalScore += email.scores.totalScore || 0;
      return acc;
    },
    { responseTime: 0, fairness: 0, respect: 0, professionalism: 0, totalScore: 0 }
  );

  const emailCount = scoredEmails.length;

  return {
    responseTime: Math.round((totalScores.responseTime / emailCount) * 10) / 10,
    fairness: Math.round((totalScores.fairness / emailCount) * 10) / 10,
    respect: Math.round((totalScores.respect / emailCount) * 10) / 10,
    professionalism: Math.round((totalScores.professionalism / emailCount) * 10) / 10,
    totalScore: Math.round((totalScores.totalScore / emailCount) * 10) / 10,
  };
}

