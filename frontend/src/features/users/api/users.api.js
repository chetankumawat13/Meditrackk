import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  withCredentials: true,
});

export async function getCurrentUser() {
  const response = await usersApi.get('/me');
  return response.data;
}

export default usersApi;