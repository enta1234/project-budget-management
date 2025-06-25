import api from '../api';

export async function fetchActivityLogs() {
  const { data } = await api.get('/api/v1/activity-logs');
  return data;
}
