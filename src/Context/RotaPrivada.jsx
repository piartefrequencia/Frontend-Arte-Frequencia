


import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './RotaPrivada.css'; 

function RotasPrivadas({ children, perfisPermitidos }) {
  const { isAuthenticated, user } = useContext(AuthContext);


  if (!isAuthenticated) {
    return (
      <div className="privado-container">
        <div className="privado-card">
          <h2>👤</h2>
          <h1>Acesso Restrito</h1>
          <p>Você precisa entrar na sua conta para acessar esta página.</p>
          <Link to="/" className="privado-link">Voltar ao Início</Link>
        </div>
      </div>
    );
  }


  const temPermissao = perfisPermitidos?.includes(user?.perfil);

  if (perfisPermitidos && !temPermissao) {
    return (
      <div className="privado-container">
        <div className="privado-card">
          <h2>🚫</h2>
          <h1>Não Autorizado</h1>
          <p>Seu nível de acesso não permite visualizar este conteúdo.</p>
          <Link to="/" className="privado-link">Voltar ao Início</Link>
        </div>
      </div>
    );
  }

  return children;
}

export default RotasPrivadas;