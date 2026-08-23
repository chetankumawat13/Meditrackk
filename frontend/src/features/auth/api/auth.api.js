import apiClient from '../../../shared/api/client.js';

const authApi = apiClient;



export async function register({
  role = 'buyer',
  fullname,
  contact,
  email,
  password,
  dateOfBirth,
  gender,
  address,
  storeName,
  storeLicenseNumber,
  storeContact,
  storeEmail,
  storeAddress,
}) {
  const isSeller = role === 'seller';
  const response = await authApi.post(`/auth/register/${isSeller ? 'store' : 'patient'}`, isSeller ? {
    storeName,
    storeLicenseNumber,
    storeContact: storeContact || contact,
    storeEmail: storeEmail || email,
    password,
    storeAddress: storeAddress || address,
  } : {
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
