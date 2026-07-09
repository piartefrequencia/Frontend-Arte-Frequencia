import React, { createContext, useEffect, useMemo, useState } from "react";
import { setLogout } from "../services/auth";
import api from "../services/api";

export interface User {
  perfil: string | null;
  usuario: string | null;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({
        perfil: sessionStorage.getItem("perfil"),
        usuario: sessionStorage.getItem("usuario"),
        email: sessionStorage.getItem("email"),
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post("auth/login", {
      email,
      senha,
    });

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("perfil", data.perfil);
    sessionStorage.setItem("usuario", data.usuario);
    sessionStorage.setItem("email", data.email);

    if (data.refreshToken) {
      sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setUser({
      perfil: data.perfil,
      usuario: data.usuario,
      email: data.email,
    });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("perfil");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("email");

    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
    }),
    [user, loading]
  );

  useEffect(() => {
    setLogout(logout);
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
