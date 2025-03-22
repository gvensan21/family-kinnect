
// Re-export all API related functionality
import { AuthAPI } from './authApi';
import { FamilyTreeAPI } from './familyTreeApi';
import { FamilyMember, User } from '../types/user';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { AuthProvider, useLocalAuth } from '../contexts/AuthContext';

export {
  AuthAPI,
  FamilyTreeAPI,
  FamilyMember,
  User,
  useFamilyTree,
  AuthProvider,
  useLocalAuth
};
