import React, { useState, useEffect, useContext } from 'react';
import './MenuLateral.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

function MenuLateral() {
  const { user } = useContext(AuthContext);
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState({});

  const fecharTudo = () => {
    setMenuAberto(false);
    setSubmenuAberto({});
  };

  useEffect(() => {
    const fecharMenu = (e) => {
      if (!e.target.closest('.menu-lateral') && !e.target.closest('.botao-hamburguer')) {
        fecharTudo();
      }
    };
    document.addEventListener('click', fecharMenu);
    return () => document.removeEventListener('click', fecharMenu);
  }, []);

  const alternarSubmenu = (item) => {
    const menusProtegidos = ['controle', 'cadastro'];

    if (menusProtegidos.includes(item) && !user) {
      return;
    }

    if (item === 'controle' && user?.perfil !== 'ADMIN') {
      alert("Apenas administradores podem acessar.");
      return;
    }

    if (item === 'cadastro' && !['ADMIN', 'COLAB'].includes(user?.perfil)) {
      alert("Acesso restrito.");
      return;
    }

    setSubmenuAberto((prev) => ({
      ...prev,
      [item]: !prev[item], 
    }));
  };

  return (
    <><div className={`botao-hamburguer ${menuAberto ? 'ativo' : ''}`}
        onClick={(e) => {e.stopPropagation();
          setMenuAberto(!menuAberto);}}>
        ☰
      </div>

      <nav className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <ul>
          <li>
            <button onClick={() => alternarSubmenu('controle')}>
              Controle
            </button>

            {submenuAberto['controle'] && (
              <ul className="submenu">
                <li><Link to="/cadastro-usuarios" onClick={fecharTudo}>
                    Cadastro de Usuarios</Link>
                </li>
                <li><Link to="/listausuario" onClick={fecharTudo}>
                    Lista dos Usuarios</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button onClick={() => alternarSubmenu('cadastro')}>
              Painel Administrativo
            </button>

            {submenuAberto['cadastro'] && (
              <ul className="submenu">

                <li><Link to="/cadastro-aluno" onClick={fecharTudo}>Cadastro Alunos</Link></li>
                <li><Link to="/cadastro-colaborador" onClick={fecharTudo}>Cadastro Educadores</Link></li>
                <li><Link to="/biblioteca" onClick={fecharTudo}>Cadastro das Partituras</Link></li>
                <li><Link to="/telegram" onClick={fecharTudo}>Cadastro Mensagem Telegram</Link></li>
                <li><Link to="/documentacao" onClick={fecharTudo}>Documentação Crácha</Link></li>
                <li><Link to="/form-frequencia" onClick={fecharTudo}>Frequência Alunos</Link></li>
                <li><Link to="/listaalunos" onClick={fecharTudo}>Lista dos Alunos</Link></li>
                <li><Link to="/listacolaborador" onClick={fecharTudo}>Lista dos Educadores</Link></li>
               
              </ul>
            )}
          </li>

        </ul>
      </nav>
    </>
  );
}

export default MenuLateral;
