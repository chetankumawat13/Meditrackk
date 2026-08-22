import apiClient from '../../../shared/api/client.js';

const authApi = apiClient;

export async function register({
  fullname,
  contact,
  email,
  password,
  dateOfBirth,
  gender,
  address,
}) {
  const response = await authApi.post('/auth/register/patient', {
    fullname,
    contact,
    email,
    password,
    dateOfBirth,
    gender,
    address,
  });

  return response.data;
}

export async function login({ email, password, role = 'buyer' }) {
  const isContact = !email.includes('@');
  const response = await authApi.post(`/auth/login/${role === 'seller' ? 'store' : 'patient'}`, {
    ...(isContact ? { contact: email } : { email }),
    ...(role === 'seller' ? { storeEmail: email } : {}),
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await authApi.post('/auth/logout');
  return response.data;
}

export default authApi;
