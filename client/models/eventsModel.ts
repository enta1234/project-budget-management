import api from '../api';

export async function fetchEvents() {
  const { data } = await api.get('/api/v1/events');
  return data;
}
