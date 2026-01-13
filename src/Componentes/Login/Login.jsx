

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

import './Login.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

    const handleLogin = async e => {
    e.preventDefault();
    try {
      await login(email, senha);
      alert('Login realizado com sucesso!');
      navigate('/');
    } catch {
      alert('Login inválido');
    }
  };

   const handleFechar = () => {
    navigate("/"); 
  }

    return (
    
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
               
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
                
                
                <div className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    <span className="password-toggle-icon"
                        onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                
             
                <button type="submit" className="btn-entrar">Entrar</button>
                <button type="button" className="btn-fechar" onClick={handleFechar}>FECHAR</button>
              
            </form>
        </div>
    );
}

export default Login; 
