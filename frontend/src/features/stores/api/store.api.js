import apiClient from '../../../shared/api/client.js';

const storesApi = apiClient;

export async function getCurrentStore() {
  const response = await storesApi.get('/stores/me');
  return response.data;
}

export async function getAllStores() {
  const response = await storesApi.get('/stores/all');
  return response.data;
}

export default storesApi;