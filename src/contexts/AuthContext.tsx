import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

type User = {id: number; email: string};

interface AuthCtx {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, mot_de_passe: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  // au démarrage, lire le token existant
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('token');
      if (saved) setToken(saved);
      setLoading(false);
    })();
  }, []);

  // connexion
  const signIn = async (email: string, mot_de_passe: string) => {
    const res = await client.post('/auth/login', {email, mot_de_passe});
    await AsyncStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user); // <- renvoyé par ton API
  };

  // déconnexion
  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, token, isLoading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};
