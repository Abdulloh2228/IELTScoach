import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    target_score: number;
    current_score: number;
    exam_date?: string;
    study_goal: string;
    country?: string;
    total_study_hours: number;
    tests_completed: number;
    current_streak: number;
    created_at: string;
    updated_at: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock user data
const mockUser: AuthUser = {
  id: '1',
  email: 'demo@example.com',
  profile: {
    id: '1',
    full_name: 'Demo User',
    email: 'demo@example.com',
    target_score: 8.0,
    current_score: 7.2,
    exam_date: '2024-06-15',
    study_goal: 'University Application',
    country: 'United States',
    total_study_hours: 45.5,
    tests_completed: 12,
    current_streak: 7,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      ...mockUser,
      email,
      profile: {
        ...mockUser.profile!,
        email,
        full_name: fullName,
      }
    };
    setUser(newUser);
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: any) => {
    if (user?.profile) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...updates,
        }
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}