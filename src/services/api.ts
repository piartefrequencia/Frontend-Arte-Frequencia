import axios from "axios";
import { triggerLogout } from "./auth";

const api = axios.create({
  baseURL: "https://backendartefrequencia.squareweb.app/api/artefrequencia/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const perfil = sessionStorage.getItem("perfil");
      const refreshToken = sessionStorage.getItem("refreshToken");
      const podeRenovar = perfil === "ADMIN" || perfil === "COLAB";

      if (podeRenovar && refreshToken && !isRefreshing) {
        try {
          isRefreshing = true;
          const response = await axios.post(
            "https://backendartefrequencia.squareweb.app/api/artefrequencia/auth/refresh",
            { refreshToken }
          );

          const novoToken = response.data.token;
          sessionStorage.setItem("token", novoToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${novoToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${novoToken}`;
          }
          isRefreshing = false;
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;
          triggerLogout();
          return Promise.reject(err);
        }
      }

      alert("Sua sessão expirou. Faça login novamente.");
      triggerLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
