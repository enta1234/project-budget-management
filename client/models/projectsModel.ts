import api from '../api';

export async function fetchProjects() {
  const { data } = await api.get('/api/v1/projects');
  return data;
}

export async function updateProject(id: string, project: any) {
  const { data } = await api.patch(`/api/v1/projects/${id}`, project);
  return data;
}
