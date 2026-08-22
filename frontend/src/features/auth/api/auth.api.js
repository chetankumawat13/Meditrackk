import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true,
});

export async function register({
  fullname,
  contact,
  email,
  password,
  dateOfBirth,
  gender,
  address,
}) {
  const response = await authApi.post('/register/patient', {
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

export async function login({ email, password }) {
  const response = await authApi.post('/login/patient', {
    email,
    password,
  });

  return response.data;
}

export default authApi;
