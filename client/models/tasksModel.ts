import api from '../api';
import { sanitizeList } from '../utils/sanitize';

export async function fetchTasks(projectId: string) {
  const { data } = await api.get('/api/v1/planning/tasks', { params: { project: projectId } });
  return sanitizeList(data);
}

