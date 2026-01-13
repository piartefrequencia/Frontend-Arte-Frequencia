/* PRIMEIRA VERSÃO

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (usuario, senha) => {
    if (usuario === 'admin' && senha === '1234') {
      setUser({ usuario: 'admin', perfil: 'Adm' });
      return true;
    } else if (usuario === 'colaborador' && senha === '1234') {
      setUser({ usuario: 'colaborador', perfil: 'Colaborador' });
      return true;
    } else if (usuario === 'aluno' && senha === '1234') {
      setUser({ usuario: 'aluno', perfil: 'Aluno' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

*/

/* VERSÃO ANTIGA 1

import React, { createContext, useMemo, useState } from 'react';
import api from '../Servico/APIservico-login';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const perfil = sessionStorage.getItem('perfil');
    const usuario = sessionStorage.getItem('usuario');
    const email = sessionStorage.getItem('email');
    return perfil && usuario ? { perfil, usuario, email } : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const resp = await api.post('/login', { email, senha });
      if (resp.status !== 200) throw new Error('Falha no login.');
      const { token: tk, perfil, usuario } = resp.data || {};
      if (!tk || !perfil) throw new Error('Resposta incompleta (token/perfil ausente).');

      sessionStorage.setItem('token', tk);
      sessionStorage.setItem('perfil', perfil);
      sessionStorage.setItem('usuario', usuario || '');
      sessionStorage.setItem('email', resp.data.email || email);

      setToken(tk);
      setUser({ perfil, usuario: usuario || '', email: resp.data.email || email });

      return { ok: true, perfil };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.friendlyMessage ||
        error?.message ||
        'Erro ao conectar com o servidor.';
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const token = sessionStorage.getItem('token');
  if (token) {
    api.get('/api/auth/validate')
      .catch(() => logout());
  }
}, []);


  const logout = async () => {
    try  finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('perfil');
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('email');
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user?.perfil,
    login,
    logout,
    loading
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
*/


/* VERSÃO ANTIGA 2

import React, { createContext, useEffect, useMemo, useState } from 'react';
import api from '../Servico/APIservico-login';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/validate')
        .then(() => {
          setUser({
            perfil: sessionStorage.getItem('perfil'),
            usuario: sessionStorage.getItem('usuario'),
            email: sessionStorage.getItem('email'),
          });
        })
        .catch(logout)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const { data } = await api.post('/login', { email, senha });

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('perfil', data.perfil);
    sessionStorage.setItem('usuario', data.usuario);
    sessionStorage.setItem('email', data.email);

    setToken(data.token);
    setUser(data);

    return true;
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
*/

// VERSÃO PARA TESTE

import React, { createContext, useEffect, useMemo, useState } from 'react';
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
