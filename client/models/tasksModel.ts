import api from '../api';

export async function fetchTasks(projectId: string) {
  const { data } = await api.get('/api/v1/planning/tasks', { params: { project: projectId } });
  return data.map((t: any) => {
    if (typeof t.onClick !== 'undefined') {
      const { onClick, ...rest } = t;
      return rest;
    }
    return t;
  });
}

