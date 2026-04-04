

import axios from "axios";
import { triggerLogout } from "./authService";

const api = axios.create({
  baseURL:"https://apiartefrequencia.onrender.com/api/artefrequencia",
  headers: {
    "Content-Type": "application/json",
  },
});

//  INTERCEPTA REQUEST → envia o token
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
    if (error.response && error.response.status === 401) {
      
      sessionStorage.removeItem("token");  
    }
    return Promise.reject(error);
  }
);

  // REMOVE O USUÁRIO DO CABEÇALHO

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
     alert("Sua sessão expirou. Faça login novamente.");

      triggerLogout(); // 🔥 chama logout real
    }

    return Promise.reject(error);
  }
);

export default api;

 