import api from '../api';

export async function fetchWorkdays(year) {
  const { data } = await api.get('/api/v1/workdays', { params: { year } });
  return data;
}

export async function createWorkday(workday) {
  const { data } = await api.post('/api/v1/workdays', workday);
  return data;
}

export async function updateWorkday(id, workday) {
  const { data } = await api.patch(`/api/v1/workdays/${id}`, workday);
  return data;
}

export async function deleteWorkday(id) {
  const { data } = await api.delete(`/api/v1/workdays/${id}`);
  return data;
}
