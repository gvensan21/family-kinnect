
// User and FamilyMember interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not stored in clear text in a real implementation
  createdAt: string;
  updatedAt: string;
}

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
