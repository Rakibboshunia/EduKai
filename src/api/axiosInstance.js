import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// 🔥 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔥 refresh cookie-based session
        await axiosInstance.post("/api/auth/refresh/");

        // 🔥 retry previous request
        return axiosInstance(originalRequest);
      } catch (err) {
        // 🔥 session expired → force login
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;