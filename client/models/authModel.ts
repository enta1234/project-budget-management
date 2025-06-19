// @ts-nocheck
import axios from 'axios';

export async function loginRequest(username, password) {
  const { data } = await axios.post('/api/v1/auth/login', { username, password });
  return data;
}

export async function fetchProfile(token) {
  const { data } = await axios.get('/api/v1/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
