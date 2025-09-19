import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  type?: 'user' | 'lawyer';
}

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('apna-lawyer-user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('apna-lawyer-user');
      }
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('apna-lawyer-user');
    localStorage.removeItem('access_token');
    setUser(null);
    setIsSignedIn(false);
  };

  return {
    isSignedIn,
    user,
    signOut
  };
}