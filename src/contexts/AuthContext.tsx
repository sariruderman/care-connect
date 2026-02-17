import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, ParentProfile, BabysitterProfile } from '@/types';
import { authApi, parentsApi, babysittersApi } from '@/services/api';

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
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('auth_token');
  //     if (token) {
  //       authApi.setToken(token);
  //       const result = await authApi.getCurrentUser();
  //       if (result.success && result.data) {
  //         setUser(result.data);
  //         // Load profile based on user type
  //         if (result.data.type === 'PARENT') {
  //           const profileResult = await parentsApi.getByUserId(result.data.id);
  //           if (profileResult.success && profileResult.data) {
  //             setParentProfile(profileResult.data);
  //           }
  //         } else if (result.data.type === 'BABYSITTER') {
  //           const profileResult = await babysittersApi.getByUserId(result.data.id);
  //           if (profileResult.success && profileResult.data) {
  //             setBabysitterProfile(profileResult.data);
  //           }
  //         }
  //       }
  //     }
  //     setIsLoading(false);
  //   };
  //   checkAuth();
  // }, []);
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authApi.setToken(token);
      try {
        const result = await authApi.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data);
          // Load profile based on user roles
          const userRoles = result.data.roles || [];
          
          if (userRoles.includes('PARENT')) {
            const profileResult = await parentsApi.getByUserId(result.data.id);
            if (profileResult.success && profileResult.data) {
              setParentProfile(profileResult.data);
            }
          }
          
          if (userRoles.includes('BABYSITTER')) {
            const profileResult = await babysittersApi.getByUserId(result.data.id);
            if (profileResult.success && profileResult.data) {
              setBabysitterProfile(profileResult.data);
            }
          }
        }
      } catch (error) {
        // Token invalid, clear it
        authApi.logout();
      }
    }
    setIsLoading(false);
  };
  checkAuth();
}, []);

  const sendOtp = useCallback(async (phone: string) => {
    const result = await authApi.sendOtp(phone);
    return { success: result.success, error: result.error };
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    const result = await authApi.verifyOtp(phone, code);
    if (result.success && result.data) {
      authApi.setToken(result.data.token);
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setParentProfile(null);
    setBabysitterProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    if (user.roles.includes('PARENT')) {
      const result = await parentsApi.getByUserId(user.id);
      if (result.success && result.data) {
        setParentProfile(result.data);
      }
    }
    
    if (user.roles.includes('BABYSITTER')) {
      const result = await babysittersApi.getByUserId(user.id);
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
