import api from '../api';
import { sanitizeList } from '../utils/sanitize';

export async function fetchProjects() {
  const { data } = await api.get('/api/v1/projects');
  return sanitizeList(data);
}

export async function updateProject(id: string, project: any) {
  const { data } = await api.patch(`/api/v1/projects/${id}`, project);
  return data;
}
