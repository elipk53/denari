import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; 
const dbName = process.env.MONGODB_DB_NAME || 'denari'; 
const client = new MongoClient(uri);

export async function connectDb() {
  await client.connect();
  return client.db(dbName);
}