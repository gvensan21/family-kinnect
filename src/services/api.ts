
import { useAuth } from "@clerk/clerk-react";

// Family member interface
export interface FamilyMember {
  id: string;
  name: string;
  gender: string;
  dateOfBirth?: string;
  gotra?: string;
  pravara?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  occupation?: string;
  bio?: string;
  email?: string;
  phone?: string;
  parentId?: string | null;
  spouseId?: string | null;
  children?: string[];
  profileData?: Record<string, any>;
}

// Mock database for demo purposes
// In a real application, this would be replaced with actual database calls
const mockDB = {
  familyMembers: new Map<string, FamilyMember>(),
};

// API functions
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

// Custom hook to use the Family Tree API
export const useFamilyTree = () => {
  const { userId } = useAuth();
  
  return {
    saveProfileAndCreateNode: async (profileData: Record<string, any>) => {
      if (!userId) throw new Error("User not authenticated");
      return await FamilyTreeAPI.saveProfileAndCreateNode(userId, profileData);
    },
    
    getFamilyTree: async () => {
      if (!userId) throw new Error("User not authenticated");
      return await FamilyTreeAPI.getFamilyTree(userId);
    },
    
    getUserProfile: async () => {
      if (!userId) throw new Error("User not authenticated");
      return await FamilyTreeAPI.getUserProfile(userId);
    },
  };
};
