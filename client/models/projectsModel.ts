import api from '../api';

export async function fetchProjects() {
  const { data } = await api.get('/api/v1/projects');
  return data;
}
