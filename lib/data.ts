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

export async function getAverageScore(client: Client): Promise<number> {
  if (!client || client.emails.length === 0) return 0;

  const scoredEmails = client.emails.filter(
    (email) => email.scores?.totalScore !== undefined
  );
  if (scoredEmails.length === 0) return 0;

  const totalScore = scoredEmails.reduce(
    (sum, email) => sum + (email.scores?.totalScore || 0),
    0
  );
  return Math.round((totalScore / scoredEmails.length) * 10) / 10;
}
