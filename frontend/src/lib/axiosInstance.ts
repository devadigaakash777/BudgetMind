import axios from 'axios';
import store from '@/redux/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;

  // Make sure headers exists
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
