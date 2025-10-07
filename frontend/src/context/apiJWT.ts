// api.ts
import axios from "axios";

const API_URL = "https://13.60.230.183";

// create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const loginInfoRaw = localStorage.getItem("loginInfo"); // or sessionStorage
    if (loginInfoRaw) {
      try {
        const loginInfo = JSON.parse(loginInfoRaw);
        if (loginInfo?.token) {
          config.headers.Authorization = `Bearer ${loginInfo.token}`;
        }
      } catch {
        console.warn("Invalid loginInfo in localStorage");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
