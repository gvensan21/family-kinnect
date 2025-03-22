
/**
 * This file is now a placeholder. The application now uses MongoDB instead of a mock database.
 * See lib/mongodb.ts for the MongoDB connection utility.
 * 
 * The in-memory mock database has been replaced by MongoDB collections:
 * - users -> MongoDB collection 'users'
 * - familyMembers -> MongoDB collection 'familyMembers'
 */

import { User, FamilyMember } from "../types/user";

// This is kept for backward compatibility but is no longer used
const mockDB = {
  users: new Map<string, User>(),
  familyMembers: new Map<string, FamilyMember>(),
};

export default mockDB;
