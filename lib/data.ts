import { connectDb } from './mongodb';
import { Client } from './types';
import { ObjectId } from 'mongodb';

export async function getClients(): Promise<Client[]> {
  const db = await connectDb();
  const clients = await db.collection('clients').find({}).toArray();
  
  return clients.map(client => ({
    id: client._id.toString(), 
    email: client.email,
    company: client.company,
    emails: client.emails,
  }));
}

export async function getClientById(id: string): Promise<Client | null> {
  const db = await connectDb();
  const client = await db.collection('clients').findOne({ _id: new ObjectId(id) });
  
  if (!client) return null;

  return {
    id: client._id.toString(), 
    email: client.email,
    company: client.company,
    emails: client.emails,
  };
}

export async function getAverageScore(clientId: string): Promise<number> {
  const client = await getClientById(clientId);
  if (!client || client.emails.length === 0) return 0;

  const totalScore = client.emails.reduce((sum, email) => sum + email.score, 0);
  return Math.round((totalScore / client.emails.length) * 10) / 10;
}