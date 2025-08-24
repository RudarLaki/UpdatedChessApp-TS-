// api.ts
import axios from "axios";

const API_URL = "http://your-backend-url.com/api";

// create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") ?? ""); // or sessionStorage
    if (loginInfo) {
      config.headers.authorization = `Bearer ${loginInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
