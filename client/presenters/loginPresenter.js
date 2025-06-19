import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginRequest, fetchProfile } from '../models/authModel';
import { useAuth } from '../context/AuthContext';

export function useLoginPresenter() {
  const { token, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const data = await loginRequest(username, password);
    login(data.accessToken);
    router.push('/workspace');
    setLoading(false);
  }

  async function getProfile() {
    const data = await fetchProfile(token);
    setProfile(data);
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    profile,
    loading,
    token,
    handleLogin,
    getProfile,
  };
}
