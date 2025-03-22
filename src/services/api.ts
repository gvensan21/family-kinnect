
// Re-export all API related functionality
import { AuthAPI } from './authApi';
import { FamilyTreeAPI } from './familyTreeApi';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { AuthProvider, useLocalAuth } from '../contexts/AuthContext';

// Re-export types with 'export type'
export type { FamilyMember, User } from '../types/user';

// Export functions and components
export {
  AuthAPI,
  FamilyTreeAPI,
  useFamilyTree,
  AuthProvider,
  useLocalAuth
};
