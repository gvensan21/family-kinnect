
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

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not stored in clear text in a real implementation
  createdAt: string;
  updatedAt: string;
}

// Mock database for demo purposes
// In a real application, this would be replaced with actual database calls
const mockDB = {
  users: new Map<string, User>(),
  familyMembers: new Map<string, FamilyMember>(),
};

// API functions
export const AuthAPI = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string }): Promise<User> => {
    // Check if user with email already exists
    const existingUsers = Array.from(mockDB.users.values());
    const userExists = existingUsers.some(user => user.email === userData.email);
    
    if (userExists) {
      throw new Error("A user with this email already exists");
    }
    
    // In a real app, we would hash the password here
    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to mock database
    mockDB.users.set(newUser.id, newUser);
    
    console.log("User registered:", { ...newUser, password: "***" });
    return { ...newUser, password: undefined }; // Remove password from returned user
  },
  
  // Login a user
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    // Find user by email
    const existingUsers = Array.from(mockDB.users.values());
    const user = existingUsers.find(user => user.email === credentials.email);
    
    if (!user) {
      throw new Error("No user found with this email");
    }
    
    // Check password (in a real app, we would compare hashed passwords)
    if (user.password !== credentials.password) {
      throw new Error("Invalid password");
    }
    
    console.log("User logged in:", { ...user, password: "***" });
    return { ...user, password: undefined }; // Remove password from returned user
  },
};

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

// Auth Context and Provider for non-Clerk authentication
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const user = await AuthAPI.login({ email, password });
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const user = await AuthAPI.register({ name, email, password });
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useLocalAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within an AuthProvider');
  }
  return context;
};
