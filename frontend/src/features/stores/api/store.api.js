import axios from 'axios';

const storesApi = axios.create({
  baseURL: 'http://localhost:3000/api/stores',
  withCredentials: true,
});

export async function getCurrentStore() {
  const response = await storesApi.get('/me');
  return response.data;
}

export default storesApi;