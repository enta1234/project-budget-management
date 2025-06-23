import api from '../api';

export async function fetchRoles() {
  const { data } = await api.get('/api/v1/roles');
  return data;
}

export async function createRole(role: { name: string }) {
  const { data } = await api.post('/api/v1/roles', role);
  return data;
}

export async function addLevel(roleId: string, level: string) {
  const { data } = await api.post(`/api/v1/roles/${roleId}/levels`, { name: level });
  return data;
}

export async function removeLevel(roleId: string, level: string) {
  const { data } = await api.delete(`/api/v1/roles/${roleId}/levels/${level}`);
  return data;
}
