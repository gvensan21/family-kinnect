
/**
 * This file is now just a proxy to the real MongoDB implementation.
 * It is kept for backward compatibility.
 * 
 * We now use a proper MongoDB connection.
 * See lib/mongodb.ts for the implementation.
 */

import { User, FamilyMember } from "../types/user";
import { connectToDatabase, COLLECTIONS } from "../lib/mongodb";

// This is kept as a proxy to the real MongoDB implementation
const mockDB = {
  // These methods are no longer used directly but kept for compatibility
  users: {
    get: async (id: string): Promise<User | undefined> => {
      console.warn("Using deprecated mockDB.users.get - use MongoDB methods directly instead");
      const { db } = await connectToDatabase();
      const user = await db.collection(COLLECTIONS.USERS).findOne({ id });
      return user as unknown as User;
    },
    set: async (id: string, user: User): Promise<void> => {
      console.warn("Using deprecated mockDB.users.set - use MongoDB methods directly instead");
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.USERS).updateOne({ id }, { $set: user }, { upsert: true });
    }
  },
  familyMembers: {
    get: async (id: string): Promise<FamilyMember | undefined> => {
      console.warn("Using deprecated mockDB.familyMembers.get - use MongoDB methods directly instead");
      const { db } = await connectToDatabase();
      const member = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id });
      return member as unknown as FamilyMember;
    },
    set: async (id: string, member: FamilyMember): Promise<void> => {
      console.warn("Using deprecated mockDB.familyMembers.set - use MongoDB methods directly instead");
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.FAMILY_MEMBERS).updateOne({ id }, { $set: member }, { upsert: true });
    }
  }
};

export default mockDB;
