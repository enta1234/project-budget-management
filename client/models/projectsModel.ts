import api from '../api';
import { sanitizeList } from '../utils/sanitize';

export interface ProjectUpdate {
  name?: string;
  description?: string;
  resources?: number;
  start?: Date;
  sprintStart?: Date;
  end?: Date;
  manday?: number;
  sprintLength?: number;
  priority?: number;
  lead?: string;
  status?: string;
  members?: string[];
  deleted?: boolean;
  deletedAt?: Date;
}

export async function fetchProjects() {
  const { data } = await api.get('/api/v1/projects');
  return sanitizeList(data);
}

export async function updateProject(id: string, project: ProjectUpdate) {
  const { data } = await api.patch(`/api/v1/projects/${id}`, project);
  return data;
}
