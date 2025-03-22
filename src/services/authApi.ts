
import { User } from "../types/user";
import { connectToDatabase, COLLECTIONS, generateUUID } from "../lib/mongodb";

// API functions for authentication
export const AuthAPI = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string }): Promise<User> => {
    console.log("Registering user:", userData.email);
    const { db } = await connectToDatabase();
    
    // Check if user with email already exists
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email: userData.email });
    
    if (existingUser) {
      throw new Error("A user with this email already exists");
    }
    
    // Generate UUID for user ID
    const userId = generateUUID();
    
    // In a real app, we would hash the password here
    const newUser: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to database
    await db.collection(COLLECTIONS.USERS).insertOne(newUser);
    
    console.log("User registered:", { ...newUser, password: "***" });
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },
  
  // Login a user
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    console.log("Login attempt for:", credentials.email);
    const { db } = await connectToDatabase();
    
    // Find user by email
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email: credentials.email });
    
    if (!user) {
      console.log("No user found with email:", credentials.email);
      throw new Error("No user found with this email");
    }
    
    // Check password
    if (user.password !== credentials.password) {
      console.log("Invalid password for user:", credentials.email);
      throw new Error("Invalid password");
    }
    
    // Convert database document to User type
    const userWithCorrectType: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    console.log("User logged in:", userWithCorrectType);
    return userWithCorrectType;
  },
};
