import api from '../api';

export async function fetchTasks(projectId: string) {
  const { data } = await api.get('/api/v1/planning/tasks', { params: { project: projectId } });
  return data;
}

