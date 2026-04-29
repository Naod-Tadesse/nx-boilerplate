/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/context/auth-store";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? '',
  withCredentials: true,
});

// Attach Bearer token from Zustand store
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Token refresh state
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
}

// Routes that should NOT trigger token refresh
const SKIP_REFRESH_URLS = ["/auth/login", "/auth/refresh-token"];

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return true;
  return SKIP_REFRESH_URLS.some((path) => url.includes(path));
}

// Add response interceptor to handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    let errorMessage = "An unexpected error occurred";
    let shouldShowToast = true;

    if (error.response) {
      const { status, data } = error.response as {
        status: number;
        data: any;
      };
      const requestUrl = originalRequest?.url || "";

      // Attempt token refresh on 401 (except for auth routes and already-retried requests)
      if (
        status === 401 &&
        !originalRequest._retry &&
        !shouldSkipRefresh(requestUrl)
      ) {
        const { refreshToken } = useAuthStore.getState();

        if (refreshToken) {
          if (isRefreshing) {
            // Another refresh is in progress — queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers = originalRequest.headers || {};
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  originalRequest._retry = true;
                  resolve(axiosInstance(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const { data: refreshData } = await axios.post(
              `${import.meta.env.VITE_BASE_URL ?? ''}/api/auth/refresh-token`,
              { refreshToken }
            );

            const newAccessToken = refreshData.accessToken;
            const newRefreshToken = refreshData.refreshToken;

            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

            processQueue(null, newAccessToken);

            // Retry original request with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearAuth();
            if (navigateCallback) {
              navigateCallback("/auth/login");
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // No refresh token available — clear auth and redirect
        useAuthStore.getState().clearAuth();
        if (navigateCallback) {
          navigateCallback("/auth/login");
        }
        return Promise.reject(error);
      }

      switch (status) {
        case 400:
          errorMessage = data?.message || data?.error || "Bad request";
          break;
        case 409:
          errorMessage = data?.message || data?.error || "Conflict";
          break;
        case 401:
          errorMessage = data?.message || data?.error || "Unauthorized access";
          if (
            requestUrl.includes("/auth/me") ||
            requestUrl.includes("/auth/login")
          ) {
            shouldShowToast = false;
          } else {
            useAuthStore.getState().clearAuth();
            if (navigateCallback) {
              navigateCallback("/auth/login");
            }
          }
          break;
        case 403:
          errorMessage = "Access forbidden";
          break;
        case 404:
          errorMessage = "Resource not found";
          break;
        case 422:
          errorMessage = data?.message || data?.error || "Validation error";
          break;
        case 500:
          errorMessage = "Internal server error";
          if (navigateCallback) {
            navigateCallback("/server-error");
          }
          break;
        default:
          errorMessage = data?.message || data?.error || `Error ${status}`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = "Network error. Please check your connection.";
    }

    if (shouldShowToast) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

// Add a navigation callback
let navigateCallback: ((path: string) => void) | null = null;

export const setNavigateCallback = (callback: (path: string) => void) => {
  navigateCallback = callback;
};

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  status?: number;
}

// API error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export default class ApiClient {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async get<T = any>(
    url = "",
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return await axiosInstance
      .get(this.endpoint + url, config)
      .then((res) => res.data);
  }

  async post<T = any, D = any>(
    url = "",
    data?: D,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return await axiosInstance
      .post(this.endpoint + url, data, config)
      .then((res) => res.data);
  }

  async put<T = any, D = any>(
    url = "",
    data?: D,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return await axiosInstance
      .put(this.endpoint + url, data, config)
      .then((res) => res.data);
  }

  /**
   * PATCH request
   */
  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return await axiosInstance
      .patch(this.endpoint + url, data, config)
      .then((res) => res.data);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return await axiosInstance
      .delete(this.endpoint + url, config)
      .then((res) => res.data);
  }
}
