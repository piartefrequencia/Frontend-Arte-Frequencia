import React, { useState, useEffect } from 'react';
import './MenuLateral.css';
import { Link } from 'react-router-dom';

function MenuLateral() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState({});

  // Fecha o menu clicando fora
  useEffect(() => {
    const fecharMenu = (e) => {
      if (!e.target.closest('.menu-lateral') && !e.target.closest('.botao-hamburguer')) {
        setMenuAberto(false);
        setSubmenuAberto({});
      }
    };
    document.addEventListener('click', fecharMenu);
    return () => {
      document.removeEventListener('click', fecharMenu);
    };
  }, []);

  const alternarSubmenu = (item) => {
    setSubmenuAberto((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <>
      {/* Botão hamburguer */}
      <div 
        className={`botao-hamburguer ${menuAberto ? 'ativo' : ''}`} 
        onClick={(e) => {
          e.stopPropagation();
          setMenuAberto(!menuAberto);
        }}
      >
        ☰
      </div>

      {/* Menu lateral */}
      <nav className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <ul>
          <li>
            <button onClick={() => alternarSubmenu('sobre')}>Sobre ▾</button>
            {submenuAberto['sobre'] && (
              <ul className="submenu">
              
                <li><Link to="/missao">Nossa Missão</Link></li>
                <li><Link to="/nossos-colaboradores">Nossos Colaboradores</Link></li>
                <li><Link to="/galeria">Galeria de Imagens e Vídeos</Link></li>
                <li><Link to="/Partituras">Biblioteca Partituras</Link></li>
              
              </ul>
            )}
          </li>

          <li>
            <button onClick={() => alternarSubmenu('oficinas')}>Oficinas ▾</button>
            {submenuAberto['oficinas'] && (
              <ul className="submenu">
              
                <li><Link to="/musicalizacao">Musicalização Infantil</Link></li>
                <li><Link to="/instrumental">Prática Instrumental</Link></li>
                <li><Link to="/percussao">Percussão Popular e Rudimentar</Link></li>
                <li><Link to="/danca">Danças</Link></li>
                <li><Link to="/Listapublico">Lista dos Alunos nas Oficinas</Link></li>
              
              </ul>
            )}
          </li>
          <li>
          <button onClick={() => alternarSubmenu('cadastro')}>Painel Administrativo ▾</button>
            {submenuAberto['cadastro'] && (
              <ul className="submenu">
                
                <li><Link to="/cadastro-aluno">Cadastro Alunos</Link></li>
                <li><Link to="/cadastro-colaborador">Cadastro Educadores</Link></li>
                <li><Link to="/cadastro-usuarios">Cadastro Usuarios</Link></li>
                <li><Link to="/ListaAlunos">Lista dos Alunos</Link></li>
                <li><Link to="/ListaColaborador">Lista dos Educadores</Link></li>
                <li><Link to="/Listausuario">Lista dos Usuarios</Link></li>
                <li><Link to="/Biblioteca">Biblioteca</Link></li>
                
              </ul>
            )}
          </li>
          
         <li>
          <button onClick={() => alternarSubmenu('acompfreq')}>Acompanhamento Frequência ▾</button>
            {submenuAberto['acompfreq'] && (
              <ul className="submenu">
                <li><Link to="/form-frequencia">Frequência Alunos</Link></li>                
              </ul>
            )}
          </li> 
          
        </ul>
      </nav>
    </>
  );
}

export default MenuLateral;
