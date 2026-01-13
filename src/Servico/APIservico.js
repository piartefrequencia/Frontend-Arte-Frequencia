
import { Link } from 'react-router-dom';
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 INTERCEPTA REQUEST → envia o token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTA RESPONSE → token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        alert("Sua sessão expirou. Faça login novamente.");

        sessionStorage.clear();

        <Link to="/"></Link>
      }
    }

    return Promise.reject(error);
  }
);

export default api;
