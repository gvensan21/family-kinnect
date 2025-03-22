
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
    console.log("Browser MongoDB simulator initialized");
  }
  
  collection(name: string) {
    if (!this.collections[name]) {
      this.collections[name] = new Map();
    }
    
    return {
      findOne: async (query: any) => {
        console.log(`BrowserDB: findOne in ${name}`, query);
        const id = query.id || (query.email ? query.email : null);
        if (!id) return null;
        return this.collections[name].get(id) || null;
      },
      find: async () => {
        console.log(`BrowserDB: find all in ${name}`);
        return {
          toArray: async () => Array.from(this.collections[name].values())
        };
      },
      updateOne: async (query: any, update: any, options: any = {}) => {
        console.log(`BrowserDB: updateOne in ${name}`, query, update);
        const id = query.id || (query.email ? query.email : null);
        if (!id) return { acknowledged: false };
        
        const existingItem = this.collections[name].get(id);
        
        if (existingItem || options.upsert) {
          const newItem = update.$set || update;
          this.collections[name].set(id, { ...existingItem, ...newItem });
        }
        return { acknowledged: true };
      },
      insertOne: async (doc: any) => {
        console.log(`BrowserDB: insertOne in ${name}`, doc);
        const id = doc.id || doc.email;
        this.collections[name].set(id, doc);
        return { acknowledged: true, insertedId: id };
      },
      deleteOne: async (query: any) => {
        console.log(`BrowserDB: deleteOne in ${name}`, query);
        const id = query.id || (query.email ? query.email : null);
        if (!id) return { acknowledged: false, deletedCount: 0 };
        
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

// Cache client instance
let browserDb: BrowserMongoDBSimulator | null = null;

export async function connectToDatabase(): Promise<{ client: any; db: any }> {
  // If we already have a connection, return it
  if (browserDb) {
    return { client: null, db: browserDb };
  }
  
  console.log("Creating new browser-compatible MongoDB simulation");
  browserDb = new BrowserMongoDBSimulator();
  
  // Initialize with some sample data if needed
  const usersCollection = browserDb.collection(COLLECTIONS.USERS);
  
  // Check if we need to add sample user
  const adminUser = await usersCollection.findOne({ email: "admin@example.com" });
  if (!adminUser) {
    await usersCollection.insertOne({
      id: generateUUID(),
      name: "Admin User",
      email: "admin@example.com",
      password: "password", 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log("Added sample user to browser DB");
  }
  
  return { client: null, db: browserDb };
}

// Close connection properly
export async function disconnectFromDatabase() {
  browserDb = null;
  console.log("Disconnected from browser MongoDB simulation");
}

// Generate a UUID compatible with browser environments
export function generateUUID(): string {
  if (typeof self !== 'undefined' && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
