import { useState, useEffect } from 'react';
import { authService, User } from '../services/auth';

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsSignedIn(isAuthenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsSignedIn(false);
      setLoading(false);
    }
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    setUser(currentUser);
    setIsSignedIn(isAuthenticated);
  };

  return {
    isSignedIn,
    user,
    loading,
    signOut,
    refreshUser
  };
}