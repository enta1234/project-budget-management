import axios from 'axios';

export async function fetchEvents() {
  const { data } = await axios.get('/api/v1/events');
  return data;
}
