import Axios, { InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/lib/config";
import storage from "@/lib/storage";
import { toast } from "react-toastify";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = storage.getToken();
  if (config && config.headers) {
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
  }
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {    
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh-tokens')) {
        storage.clearToken();
        window.location.assign(window.location.origin as unknown as string);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axios
          .post('/auth/refresh-tokens', {}) // Cookies handled by browser
          .then(({ access }: any) => {
            storage.setToken(access.token);
            axios.defaults.headers.common.authorization = `Bearer ${access.token}`;
            originalRequest.headers.authorization = `Bearer ${access.token}`;
            processQueue(null, access.token);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            storage.clearToken();
            window.location.assign(window.location.origin as unknown as string);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // Prevent showing toast error for token refresh failure itself
    if (!originalRequest?.url?.includes('/auth/refresh-tokens')) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
