

import axios from "axios";

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
      
      alert("Sua sessão expirou. Faça login novamente.");
      
    }
    return Promise.reject(error);
  }
);

export default api;

 