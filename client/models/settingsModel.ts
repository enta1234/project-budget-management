import api from '../api';

export async function fetchSettings() {
  const { data } = await api.get('/api/v1/settings');
  return data;
}

export async function updateCostMultiplier(value: number) {
  const { data } = await api.patch('/api/v1/settings/costMultiplier', { value });
  return data;
}

export async function resetAdminPassword(password: string) {
  const { data } = await api.post('/api/v1/settings/reset-admin', { password });
  return data;
}
