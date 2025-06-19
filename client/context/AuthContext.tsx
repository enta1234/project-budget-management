// @ts-nocheck
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { revokeRefreshToken } from '../models/authModel';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem('token');
    const rt = localStorage.getItem('refreshToken');
    if (tok) setToken(tok);
    if (rt) setRefreshToken(rt);
    setReady(true);
  }, []);

  const login = (tok, refreshTok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('refreshToken', refreshTok);
    setToken(tok);
    setRefreshToken(refreshTok);
  };

  const logout = async () => {
    if (refreshToken) {
      try {
        await revokeRefreshToken(refreshToken);
      } catch {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function withAuth(Component) {
  return function Authenticated(props) {
    const { token, ready } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!ready) return;
      if (!token) router.push('/');
    }, [token, ready]);
    if (!ready) return null;
    if (!token) return null;
    return <Component {...props} />;
  };
}
