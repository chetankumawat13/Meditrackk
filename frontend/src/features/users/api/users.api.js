import apiClient from '../../../shared/api/client.js';

const usersApi = apiClient;

export async function getCurrentUser() {
  const response = await usersApi.get('/users/me');
  return response.data;
}

export default usersApi;