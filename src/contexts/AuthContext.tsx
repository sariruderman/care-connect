import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, ParentProfile, BabysitterProfile } from '@/types';
import { mockAuthApi, mockUsersApi } from '@/services/mockApi';

interface AuthContextType {
  user: User | null;
  parentProfile: ParentProfile | null;
  babysitterProfile: BabysitterProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setParentProfile: (profile: ParentProfile) => void;
  setBabysitterProfile: (profile: BabysitterProfile) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [babysitterProfile, setBabysitterProfile] = useState<BabysitterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const result = await mockAuthApi.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data);
          // Load profile based on user type
          if (result.data.type === 'PARENT') {
            const profileResult = await mockUsersApi.getParentProfile(result.data.id);
            if (profileResult.success && profileResult.data) {
              setParentProfile(profileResult.data);
            }
          } else if (result.data.type === 'BABYSITTER') {
            const profileResult = await mockUsersApi.getBabysitterProfile(result.data.id);
            if (profileResult.success && profileResult.data) {
              setBabysitterProfile(profileResult.data);
            }
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    const result = await mockAuthApi.sendOtp(phone);
    return { success: result.success, error: result.error };
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    const result = await mockAuthApi.verifyOtp(phone, code);
    if (result.success && result.data) {
      localStorage.setItem('auth_token', result.data.token);
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setParentProfile(null);
    setBabysitterProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    if (user.type === 'PARENT') {
      const result = await mockUsersApi.getParentProfile(user.id);
      if (result.success && result.data) {
        setParentProfile(result.data);
      }
    } else if (user.type === 'BABYSITTER') {
      const result = await mockUsersApi.getBabysitterProfile(user.id);
      if (result.success && result.data) {
        setBabysitterProfile(result.data);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        parentProfile,
        babysitterProfile,
        isLoading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        logout,
        setParentProfile,
        setBabysitterProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
