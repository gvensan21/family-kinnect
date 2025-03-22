
/**
 * This file is a proxy to the actual database implementation.
 * It is kept for backward compatibility.
 */

import { User, FamilyMember } from "../types/user";
import { connectToDatabase, COLLECTIONS } from "../lib/mongodb";

// This is kept as a proxy to the real database implementation
const mockDB = {
  users: {
    get: async (id: string): Promise<User | undefined> => {
      console.log("Using mockDB.users.get with id:", id);
      const { db } = await connectToDatabase();
      const user = await db.collection(COLLECTIONS.USERS).findOne({ id });
      return user as User;
    },
    set: async (id: string, user: User): Promise<void> => {
      console.log("Using mockDB.users.set with id:", id);
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.USERS).updateOne({ id }, { $set: user }, { upsert: true });
    }
  },
  familyMembers: {
    get: async (id: string): Promise<FamilyMember | undefined> => {
      console.log("Using mockDB.familyMembers.get with id:", id);
      const { db } = await connectToDatabase();
      const member = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id });
      return member as FamilyMember;
    },
    set: async (id: string, member: FamilyMember): Promise<void> => {
      console.log("Using mockDB.familyMembers.set with id:", id);
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.FAMILY_MEMBERS).updateOne({ id }, { $set: member }, { upsert: true });
    }
  }
};

export default mockDB;
