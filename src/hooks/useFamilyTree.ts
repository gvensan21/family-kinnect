
import { useLocalAuth } from "../contexts/AuthContext";
import { FamilyTreeAPI } from "../services/familyTreeApi";
import { FamilyMember } from "../types/user";

// Custom hook to use the Family Tree API
export const useFamilyTree = () => {
  const { currentUser } = useLocalAuth();
  const userId = currentUser?.id;
  
  return {
    saveProfileAndCreateNode: async (profileData: Record<string, any>): Promise<FamilyMember> => {
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
