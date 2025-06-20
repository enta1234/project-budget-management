import api from '../api';

export async function fetchTeams() {
  const { data } = await api.get('/api/v1/teams');
  return data;
}

export async function createTeam(team) {
  const { data } = await api.post('/api/v1/teams', team);
  return data;
}

export async function updateTeam(id, team) {
  const { data } = await api.patch(`/api/v1/teams/${id}`, team);
  return data;
}

export async function deleteTeam(id) {
  const { data } = await api.delete(`/api/v1/teams/${id}`);
  return data;
}
