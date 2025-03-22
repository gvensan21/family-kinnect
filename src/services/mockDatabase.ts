
/**
 * This file is a placeholder. We now use a browser-compatible MongoDB mock implementation.
 * See lib/mongodb.ts for the implementation.
 * 
 * The in-memory mock database uses Maps to simulate collections:
 * - users -> Collection 'users'
 * - familyMembers -> Collection 'familyMembers'
 */

import { User, FamilyMember } from "../types/user";

// This is kept for backward compatibility but is no longer used directly
const mockDB = {
  users: new Map<string, User>(),
  familyMembers: new Map<string, FamilyMember>(),
};

export default mockDB;
