import axios from "axios";
import type { AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const errorCode = error.response?.data?.code;
    const isRefreshRoute = originalRequest.url?.includes(
      "/users/refresh-token"
    );

    console.log("error", errorCode);

    if (
      originalRequest._retry ||
      isRefreshRoute ||
      window.location.pathname === "/login"
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      (errorCode === "ACCESS_TOKEN_EXPIRED" || errorCode === "NO_ACCESS_TOKEN")
    ) {
      try {
        originalRequest._retry = true;
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
