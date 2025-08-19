import api from '../api';
import { sanitizeList } from '../utils/sanitize';
import type { Task } from './taskTypes';

export async function fetchPhases(projectId: string) {
  const { data } = await api.get('/api/v1/planning/phases', {
    params: { project: projectId },
  });
  return sanitizeList(data);
}

export async function fetchTasks(projectId: string): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/api/v1/planning/tasks', {
    params: { project: projectId },
  });
  return sanitizeList<Task>(data);
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

