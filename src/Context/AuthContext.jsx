

import React, { createContext, useEffect, useMemo, useState } from 'react';
import { setLogout } from '../Servico/authService';
import  api from '../Servico/APIservico';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser({
        perfil: sessionStorage.getItem('perfil'),
        usuario: sessionStorage.getItem('usuario'),
        email: sessionStorage.getItem('email'),
      });
    }

    setLoading(false);
  }, []);

  
  const login = async (email, senha) => {
    const { data } = await  api.post('auth/login', { email, senha });

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('perfil', data.perfil);
    sessionStorage.setItem('usuario', data.usuario);
    sessionStorage.setItem('email', data.email);

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setUser({
      perfil: data.perfil,
      usuario: data.usuario,
      email: data.email,
    });
  };

 
  const logout = () => {
    sessionStorage.clear();
    delete  api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }), [user, loading]);

   // REMOVE O USUÁRIO DA PAGINA HOME
  useEffect(() => {
  setLogout(logout);
}, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
