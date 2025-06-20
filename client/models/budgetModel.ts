import api from '../api';

export async function fetchBudgets() {
  const { data } = await api.get('/api/v1/budgets');
  return data;
}

export async function createBudget(budget) {
  const { data } = await api.post('/api/v1/budgets', budget);
  return data;
}
