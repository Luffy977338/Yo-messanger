import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $api from "./index";
import toast from "react-hot-toast";
import axios from "axios";
import { IAuthResponse } from "../interfaces/auth-response.interface";

let refreshTokenPromise: Promise<string> | null = null;

export function useAxiosNavigation() {
  const navRef = useRef(useNavigate());
  const [retryCount, setRetryCount] = useState(0);
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    setRetry(false);
    setRetryCount(0);
  });

  // Если почта не активна выкидывает на /auth, либо если прилетает UnauthorizeException
  // и удаляет accessToken из localStorage
  // на бэке еще при не активированном email удаляется еще и refreshToken
  useEffect(() => {
    const intercetpor = $api.interceptors.response.use(
      (config) => config,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.data.message === "MailNotActivate" &&
          retryCount < 1
        ) {
          setRetryCount(0);
          setRetry(false);
          navRef.current("/auth");
          localStorage.removeItem("token");
          toast.error("Почта не подтверждена", { duration: 6500 });
        } else if (error.response.status === 401 && !retry) {
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
                .catch(async (refreshError) => {
                  reject(refreshError);
                })
                .finally(() => {
                  refreshTokenPromise = null;
                });
            });
          }

          try {
            setRetryCount((prevRetryCount) => prevRetryCount + 1);
            const token = await refreshTokenPromise;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            setRetry(true);
            return $api(originalRequest);
          } catch (refreshError) {
            if (
              // @ts-ignore
              refreshError.response &&
              // @ts-ignore
              refreshError.response.status === 401
            ) {
              setRetryCount(0);
              setRetry(false);
              navRef.current("/auth");
              localStorage.removeItem("token");
            }
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      $api.interceptors.response.eject(intercetpor);
    };
  }, [retryCount, retry]);
}

export default function AxiosNavigation() {
  useAxiosNavigation();
  return <></>;
}
