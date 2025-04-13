import React, { createContext, useContext, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext<{ initialized: boolean }>({ initialized: false });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setInitialized]);

  return (
    <AuthContext.Provider value={{ initialized: useAuthStore.getState().initialized }}>
      {children}
    </AuthContext.Provider>
  );
} 