import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://ai-meditrack.onrender.com';

const apiClient = axios.create({
  baseURL: `${apiBaseUrl}/api/`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;