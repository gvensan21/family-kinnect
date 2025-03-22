
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

export const COLLECTIONS = {
  USERS: 'users',
  FAMILY_MEMBERS: 'familyMembers',
};

// MongoDB connection URI
// For development in the browser environment, we'll use a default free tier connection
// When running locally, you can override this with your own connection string
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 
  "mongodb+srv://demoaccount:demopassword@cluster0.mongodb.net/gotrabandhus?retryWrites=true&w=majority";

// Connection options
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Cache MongoDB client instance
let client: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we already have a connection, return it
  if (client && cachedDb) {
    return { client, db: cachedDb };
  }

  // Handle browser environment
  if (typeof window !== 'undefined') {
    console.warn("Running MongoDB in browser environment. For production, use a backend API.");
  }

  try {
    // Create new MongoDB client
    client = new MongoClient(MONGODB_URI, options);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get database name from connection string or use default
    const dbName = new URL(MONGODB_URI).pathname.substring(1) || 'gotrabandhus';
    cachedDb = client.db(dbName);
    
    console.log("Successfully connected to MongoDB");
    
    // Ensure collections exist
    await ensureCollectionsExist(cachedDb);
    
    return { client, db: cachedDb };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

// Ensure required collections exist
async function ensureCollectionsExist(db: Db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  for (const collectionName of Object.values(COLLECTIONS)) {
    if (!collectionNames.includes(collectionName)) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
  }
}

// Close MongoDB connection properly (useful for cleanup)
export async function disconnectFromDatabase() {
  if (client) {
    await client.close();
    client = null;
    cachedDb = null;
    console.log("Disconnected from MongoDB");
  }
}
