'use server';

import axios from 'axios';
import { BASE_URL, API_PATHS } from '../_utils/apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export async function signIn(provider, { username, password }) {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Invalid username or password');
  }
}

export async function signOut() {
  try {
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout failed:', error);
  }
}