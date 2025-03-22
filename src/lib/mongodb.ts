
// This is a browser-compatible mock of MongoDB
// In a real application, you would use an API endpoint to communicate with a server

export const COLLECTIONS = {
  USERS: 'users',
  FAMILY_MEMBERS: 'familyMembers',
};

// Browser storage mock for MongoDB
class BrowserDB {
  private storage: Record<string, Map<string, any>>;

  constructor() {
    this.storage = {
      [COLLECTIONS.USERS]: new Map(),
      [COLLECTIONS.FAMILY_MEMBERS]: new Map(),
    };
  }

  collection(name: string) {
    if (!this.storage[name]) {
      this.storage[name] = new Map();
    }

    return {
      findOne: async (query: Record<string, any>) => {
        const collection = this.storage[name];
        // Simple query implementation - only supports exact field matching
        for (const [_, item] of collection.entries()) {
          let matches = true;
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) {
              matches = false;
              break;
            }
          }
          if (matches) return { ...item };
        }
        return null;
      },
      insertOne: async (doc: any) => {
        const id = doc.id || crypto.randomUUID();
        const collection = this.storage[name];
        collection.set(id, { ...doc, _id: id });
        return { insertedId: id };
      },
      updateOne: async (query: Record<string, any>, update: Record<string, any>) => {
        const collection = this.storage[name];
        // Find document to update
        let docId = null;
        for (const [id, item] of collection.entries()) {
          let matches = true;
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) {
              matches = false;
              break;
            }
          }
          if (matches) {
            docId = id;
            break;
          }
        }

        if (docId) {
          const doc = collection.get(docId);
          // Apply update ($set operation)
          if (update.$set) {
            for (const [key, value] of Object.entries(update.$set)) {
              doc[key] = value;
            }
            collection.set(docId, doc);
          }
          return { modifiedCount: 1 };
        }
        return { modifiedCount: 0 };
      }
    };
  }
}

// Cache the mock DB connection
let cachedDb: BrowserDB | null = null;

export async function connectToDatabase(): Promise<{ client: any; db: BrowserDB }> {
  // If we already have a connection, return it
  if (cachedDb) {
    return { client: null, db: cachedDb };
  }

  // Create new mock DB
  const db = new BrowserDB();
  cachedDb = db;
  
  return { client: null, db };
}
