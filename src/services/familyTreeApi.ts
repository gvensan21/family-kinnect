
import { FamilyMember } from "../types/user";
import { connectToDatabase, COLLECTIONS } from "../lib/mongodb";

export const FamilyTreeAPI = {
  // Save profile data and create user node
  saveProfileAndCreateNode: async (userId: string, profileData: Record<string, any>): Promise<FamilyMember> => {
    console.log("Saving profile for user:", userId);
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
      console.log("Updated existing family member:", userId);
    } else {
      // Insert new record
      await db.collection(COLLECTIONS.FAMILY_MEMBERS).insertOne(member);
      console.log("Created new family member:", userId);
    }
    
    console.log("Member saved:", member);
    return member;
  },

  // Get family tree for a user
  getFamilyTree: async (userId: string): Promise<FamilyMember[]> => {
    console.log("Getting family tree for user:", userId);
    const { db } = await connectToDatabase();
    
    // Check if user exists in database
    const currentUser = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id: userId });
    
    if (!currentUser) {
      console.log("No family member found for user:", userId);
      return [];
    }
    
    // Convert database document to FamilyMember type
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
    
    console.log("Returning family member:", familyMember);
    return [familyMember];
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<Record<string, any> | null> => {
    console.log("Getting profile for user:", userId);
    const { db } = await connectToDatabase();
    
    // Find the family member
    const member = await db.collection(COLLECTIONS.FAMILY_MEMBERS).findOne({ id: userId });
    
    if (!member) {
      console.log("No profile found for user:", userId);
      return null;
    }
    
    console.log("Found profile for user:", userId);
    return member.profileData || {};
  },
};
