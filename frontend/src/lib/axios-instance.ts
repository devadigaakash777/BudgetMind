/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import store from '@/redux/store';
import { setAccessToken, clearUser } from '@/redux/slices/user-slice';
import { authClient } from '@/lib/auth/client';
import { config } from '@/config';

const BASE_URL = config.apiBaseUrl;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- RESPONSE INTERCEPTOR ---
let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 403 and it's not the refresh endpoint
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { accessToken } = await authClient.refresh();
        if (!accessToken) {
          store.dispatch(clearUser());
          // return Promise.reject(error);
          throw error;
        }

        store.dispatch(setAccessToken(accessToken));

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error_) {
        processQueue(error_, null);
        store.dispatch(clearUser());
        // return Promise.reject(err);
        throw error_;
      } finally {
        isRefreshing = false;
      }
    }

    // return Promise.reject(error);
    throw error;
  }
);

/* eslint-enable @typescript-eslint/no-explicit-any */

export default axiosInstance;
