
import { FamilyMember } from "../types/user";
import { connectToDatabase, COLLECTIONS } from "../lib/mongodb";

export const FamilyTreeAPI = {
  // Save profile data and create user node
  saveProfileAndCreateNode: async (userId: string, profileData: Record<string, any>): Promise<FamilyMember> => {
    const { db } = await connectToDatabase();
    
    // Create the family member object
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

    // Check if member already exists, update if it does
    const existingMember = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id: userId });
    
    if (existingMember) {
      // Update existing record
      await db.collection(COLLECTIONS.FAMILY_MEMBERS).updateOne(
        { id: userId },
        { $set: member }
      );
    } else {
      // Insert new record
      await db.collection(COLLECTIONS.FAMILY_MEMBERS).insertOne(member);
    }
    
    console.log("Member saved:", member);
    return member;
  },

  // Get family tree for a user
  getFamilyTree: async (userId: string): Promise<FamilyMember[]> => {
    const { db } = await connectToDatabase();
    
    // Check if user exists in database
    const currentUser = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id: userId });
    
    if (!currentUser) {
      // Return empty array if user doesn't exist
      return [];
    }
    
    // Convert MongoDB document to FamilyMember type
    const familyMember: FamilyMember = {
      id: currentUser.id,
      name: currentUser.name,
      gender: currentUser.gender || "unknown",
      dateOfBirth: currentUser.dateOfBirth,
      gotra: currentUser.gotra,
      pravara: currentUser.pravara,
      currentCity: currentUser.currentCity,
      currentState: currentUser.currentState,
      currentCountry: currentUser.currentCountry,
      occupation: currentUser.occupation,
      bio: currentUser.bio,
      email: currentUser.email,
      phone: currentUser.phone,
      parentId: currentUser.parentId,
      spouseId: currentUser.spouseId,
      children: currentUser.children || [],
      profileData: currentUser.profileData,
    };
    
    // For now, we'll return just the user as a single node
    // In a real app, we would query for related family members here
    return [familyMember];
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<Record<string, any> | null> => {
    const { db } = await connectToDatabase();
    
    // Find the family member
    const member = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id: userId });
    
    if (!member) {
      return null;
    }
    
    return member.profileData || {};
  },
};
