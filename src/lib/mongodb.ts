
import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { User, FamilyMember } from "../types/user";

export const COLLECTIONS = {
  USERS: 'users',
  FAMILY_MEMBERS: 'familyMembers',
};

// In-memory store for browser environment
class BrowserMongoDBSimulator {
  private collections: Record<string, Map<string, any>> = {};
  
  constructor() {
    // Initialize collections
    Object.values(COLLECTIONS).forEach(collName => {
      this.collections[collName] = new Map();
    });
  }
  
  collection(name: string) {
    if (!this.collections[name]) {
      this.collections[name] = new Map();
    }
    
    return {
      findOne: async (query: any) => {
        const id = query.id;
        return this.collections[name].get(id) || null;
      },
      find: async () => {
        return {
          toArray: async () => Array.from(this.collections[name].values())
        };
      },
      updateOne: async (query: any, update: any, options: any = {}) => {
        const id = query.id;
        const existingItem = this.collections[name].get(id);
        
        if (existingItem || options.upsert) {
          const newItem = update.$set || update;
          this.collections[name].set(id, { ...existingItem, ...newItem });
        }
        return { acknowledged: true };
      },
      insertOne: async (doc: any) => {
        this.collections[name].set(doc.id, doc);
        return { acknowledged: true, insertedId: doc.id };
      },
      deleteOne: async (query: any) => {
        const id = query.id;
        this.collections[name].delete(id);
        return { acknowledged: true, deletedCount: 1 };
      }
    };
  }
  
  async listCollections() {
    return {
      toArray: async () => Object.keys(this.collections).map(name => ({ name }))
    };
  }
  
  async createCollection(name: string) {
    if (!this.collections[name]) {
      this.collections[name] = new Map();
    }
    return { acknowledged: true };
  }
}

// MongoDB connection URI - use env var if available
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

// Cache client instance
let client: MongoClient | null = null;
let cachedDb: Db | null = null;
let browserDb: BrowserMongoDBSimulator | null = null;

export async function connectToDatabase(): Promise<{ client: any; db: any }> {
  // If we already have a connection, return it
  if (client && cachedDb) {
    return { client, db: cachedDb };
  }
  
  if (browserDb) {
    return { client: null, db: browserDb };
  }
  
  // Check if running in browser environment
  const isBrowser = typeof window !== 'undefined';

  try {
    if (isBrowser) {
      console.warn("Running in browser environment. Using in-memory database simulation.");
      browserDb = new BrowserMongoDBSimulator();
      return { client: null, db: browserDb };
    } else {
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
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // Fallback to in-memory store on connection error
    if (!browserDb) {
      console.warn("Falling back to in-memory database");
      browserDb = new BrowserMongoDBSimulator();
    }
    return { client: null, db: browserDb };
  }
}

// Ensure required collections exist
async function ensureCollectionsExist(db: any) {
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c: any) => c.name);
    
    for (const collectionName of Object.values(COLLECTIONS)) {
      if (!collectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      }
    }
  } catch (error) {
    console.error("Error ensuring collections exist:", error);
  }
}

// Close connection properly
export async function disconnectFromDatabase() {
  if (client) {
    await client.close();
    client = null;
    cachedDb = null;
    console.log("Disconnected from MongoDB");
  }
  // Clear browser DB
  browserDb = null;
}

// Generate a UUID compatible with both browser and Node.js
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
