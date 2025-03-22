
import { MongoClient, Db } from 'mongodb';

// MongoDB connection string - for a real app, this would come from an environment variable
const MONGODB_URI = 'mongodb://localhost:27017';
const MONGODB_DB = 'gotraBandhusDB';

// Cache the MongoDB connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we already have a connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(MONGODB_DB);
  
  // Cache the connection
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

// Define collection names
export const COLLECTIONS = {
  USERS: 'users',
  FAMILY_MEMBERS: 'familyMembers',
};
