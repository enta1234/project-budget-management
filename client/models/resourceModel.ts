import api from '../api';

export async function fetchResources() {
  const { data } = await api.get('/api/v1/resources');
  return data;
}

export async function createResource(resource) {
  const { data } = await api.post('/api/v1/resources', resource);
  return data;
}

export async function updateResource(id, resource) {
  const { data } = await api.patch(`/api/v1/resources/${id}`, resource);
  return data;
}

export async function deleteResource(id) {
  const { data } = await api.delete(`/api/v1/resources/${id}`);
  return data;
}
