
import { User } from "../types/user";
import mockDB from "./mockDatabase";

// API functions for authentication
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
