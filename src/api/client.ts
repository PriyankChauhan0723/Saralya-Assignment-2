import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'saralcollect_secret_key_2026';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'Accept': 'application/json'
  }
});

// Request interceptor to attach api key dynamically if stored
apiClient.interceptors.request.use((config) => {
  if (!config.headers['x-api-key']) {
    config.headers['x-api-key'] = API_KEY;
  }
  return config;
});
