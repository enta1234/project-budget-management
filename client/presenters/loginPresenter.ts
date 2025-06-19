// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginRequest } from '../models/authModel';
import { useAuth } from '../context/AuthContext';

export function useLoginPresenter() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const data = await loginRequest(username, password);
    login(data.accessToken);
    router.push('/workspace');
    setLoading(false);
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
