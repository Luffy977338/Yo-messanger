import axios from "axios";
import { IAuthResponse } from "../interfaces/auth-response.interface";

const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

let refreshTokenPromise: Promise<string> | null = null;

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = new Promise<string>((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Token refresh timeout"));
          }, 5000); // 5 seconds timeout for token refresh

          axios
            .get<IAuthResponse>(
              `${import.meta.env.VITE_REACT_APP_API_URL}/auth/refresh`,
              {
                withCredentials: true,
              },
            )
            .then((response) => {
              localStorage.setItem("token", response.data.accessToken);
              resolve(response.data.accessToken);
            })
            .catch((refreshError) => {
              reject(refreshError);
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        });
      }

      try {
        const token = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest._retry = true;
        return $api(originalRequest);
      } catch (refreshError) {
        // @ts-ignore
        if (refreshError.response && refreshError.response.status === 401) {
          window.location.href = "http://localhost:3000/auth";
          localStorage.removeItem("token");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default $api;
