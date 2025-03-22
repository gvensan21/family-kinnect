
import { FamilyMember } from "../types/user";
import mockDB from "./mockDatabase";

export const FamilyTreeAPI = {
  // Save profile data and create user node
  saveProfileAndCreateNode: async (userId: string, profileData: Record<string, any>): Promise<FamilyMember> => {
    // In a real application, this would be a database call
    const member: FamilyMember = {
      id: userId,
      name: profileData.name || "User",
      gender: profileData.gender || "unknown",
      dateOfBirth: profileData.dateOfBirth,
      gotra: profileData.gotra,
      pravara: profileData.pravara,
      currentCity: profileData.currentCity,
      currentState: profileData.currentState,
      currentCountry: profileData.currentCountry,
      occupation: profileData.occupation,
      bio: profileData.bio,
      email: profileData.hideEmail ? undefined : profileData.email,
      phone: profileData.hidePhone ? undefined : profileData.phone,
      parentId: null,
      spouseId: null,
      children: [],
      profileData: profileData,
    };

    // Save to mock database
    mockDB.familyMembers.set(userId, member);
    
    console.log("Member saved:", member);
    return member;
  },

  // Get family tree for a user
  getFamilyTree: async (userId: string): Promise<FamilyMember[]> => {
    // In a real application, this would be a database query
    // to get the user's family tree
    
    // Check if user exists in mock database
    const currentUser = mockDB.familyMembers.get(userId);
    
    if (!currentUser) {
      // Return empty array if user doesn't exist
      return [];
    }
    
    // For demo, we'll return the user as a single node
    return [currentUser];
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<Record<string, any> | null> => {
    // In a real application, this would be a database query
    const member = mockDB.familyMembers.get(userId);
    
    if (!member) {
      return null;
    }
    
    return member.profileData || {};
  },
};
