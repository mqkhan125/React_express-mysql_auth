import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

// 1. Request Interceptor: Har request ke sath token khud-ba-khud lag jayega
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. Response Interceptor: Agar token expire ho jaye toh handle karna
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expire hone k bad, user ko logout kar do
      localStorage.removeItem("token");
      
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
