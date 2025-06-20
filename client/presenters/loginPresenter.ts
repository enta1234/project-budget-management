// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginRequest } from '../models/authModel';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components';

export function useLoginPresenter() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      login(data.accessToken, data.refreshToken);
      showToast('Login successful');
      router.push('/plan-management');
    } catch (err) {
      showToast('Login failed', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin,
  };
}
