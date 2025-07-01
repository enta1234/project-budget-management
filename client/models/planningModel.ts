import api from '../api';
import { sanitizeList } from '../utils/sanitize';

export async function fetchPhases(projectId: string) {
  const { data } = await api.get('/api/v1/planning/phases', {
    params: { project: projectId },
  });
  return sanitizeList(data);
}

export async function fetchTasks(projectId: string) {
  const { data } = await api.get('/api/v1/planning/tasks', {
    params: { project: projectId },
  });
  return sanitizeList(data);
}


export async function createTask(projectId: string, data: any) {
  return api.post('/api/v1/planning/tasks', { ...data, project: projectId });
}

export async function updateTask(id: string, data: any) {
  return api.patch(`/api/v1/planning/tasks/${id}`, data);
}

export async function deleteTask(id: string) {
  return api.delete(`/api/v1/planning/tasks/${id}`);
}

