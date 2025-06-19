// @ts-nocheck
import api from '../api';

export async function loginRequest(username, password) {
  const { data } = await api.post('/api/v1/auth/login', { username, password });
  return data;
}

export async function fetchProfile() {
  const { data } = await api.get('/api/v1/profile');
  return data;
}

export async function revokeRefreshToken(refreshToken) {
  await api.post('/api/v1/auth/revoke', { refreshToken });
}
