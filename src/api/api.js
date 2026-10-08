import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.18.13:8000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (
      token &&
      !config.url.includes("/api/login/") &&
      !config.url.includes("/api/token/") &&
      !config.url.includes("/api/register/")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
