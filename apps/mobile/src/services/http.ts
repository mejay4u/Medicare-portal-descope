import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { ApiError, AuthError, NetworkError, NotFoundError } from '../types/errors';

// Lazy import auth store to avoid circular dependency at module init time
const getAuthStore = () => require('../store/auth.store').useAuthStore;

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export const httpClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject Bearer token on every request
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthStore().getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 with token refresh queue, map errors to typed classes
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response || error.code === 'ECONNABORTED') {
      throw new NetworkError();
    }

    const status = error.response.status;

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (!newToken) return reject(new AuthError());
            if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
            resolve(httpClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { authService } = await import('./auth.service');
        const newToken = await authService.refreshAccessToken();
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(original);
      } catch {
        refreshQueue.forEach((cb) => cb(null));
        refreshQueue = [];
        getAuthStore().getState().logout();
        throw new AuthError('Session expired. Please sign in again.');
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) throw new AuthError('You do not have permission to access this resource');
    if (status === 404) throw new NotFoundError();

    const message =
      (error.response.data as Record<string, unknown>)?.message as string | undefined;
    throw new ApiError(message ?? `Server error ${status}`, status);
  },
);
