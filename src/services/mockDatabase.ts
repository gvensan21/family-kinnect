
import { User, FamilyMember } from "../types/user";

// Mock database for demo purposes
// In a real application, this would be replaced with actual database calls
const mockDB = {
  users: new Map<string, User>(),
  familyMembers: new Map<string, FamilyMember>(),
};

export default mockDB;
