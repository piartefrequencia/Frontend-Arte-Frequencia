

import React, { useState, useEffect, useContext } from 'react';
import './MenuLateral.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

function MenuLateral() {
  const { user } = useContext(AuthContext); 
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState({});
  const verificarLogin = (e) => {
  if (!user) {
    e.preventDefault();
    alert("Pagina apenas para alunos matriculados na Instituição Pró-Cidadania.");
  }
};
  
  useEffect(() => {
    const fecharMenu = (e) => {
      if (!e.target.closest('.menu-lateral') && !e.target.closest('.botao-hamburguer')) {
        setMenuAberto(false);
        setSubmenuAberto({});
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
    <>
      <div 
        className={`botao-hamburguer ${menuAberto ? 'ativo' : ''}`} 
        onClick={(e) => {
          e.stopPropagation();
          setMenuAberto(!menuAberto);
        }}
      >
        ☰
      </div>

      <nav className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <ul>       
           <li>
            <button onClick={() => alternarSubmenu('sobre')}>Sobre ▾</button>
            {submenuAberto['sobre'] && (
              <ul className="submenu">
              
                <li><Link to="/missao">Nossa Missão</Link></li>
                <li><Link to="/nossos-colaboradores">Nossos Colaboradores</Link></li>
                <li><Link to="/galeria">Galeria de Imagens e Vídeos</Link></li>
                <li>
                  <Link to="/partituras" onClick={verificarLogin}>
                        Biblioteca Partituras
                  </Link>
                </li>
              
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
                <li><Link to="/listapublico">Lista dos Alunos nas Oficinas</Link></li>
              
              </ul>
            )}
          </li>

           <li>
             <button onClick={() => alternarSubmenu('controle')}>Controle ▾</button>
             {submenuAberto['controle'] && (
               <ul className="submenu">
                 <li><Link to="/cadastro-usuarios">Cadastro de Usuarios</Link></li>
                 <li><Link to="/listausuario">Lista dos Usuarios</Link></li>
               </ul>
             )}
           </li>

           <li>
            
             <button onClick={() => alternarSubmenu('cadastro')}>Painel Administrativo ▾</button>
             {submenuAberto['cadastro'] && (
               <ul className="submenu">
                 <li><Link to="/cadastro-aluno">Cadastro Alunos</Link></li>
                 <li><Link to="/cadastro-colaborador">Cadastro Educadores</Link></li>
                 <li><Link to="/telegram">Cadastro Mensagem Telegram</Link></li> 
                 <li><Link to="/listaalunos">Lista dos Alunos</Link></li>
                 <li><Link to="/listacolaborador">Lista dos Educadores</Link></li>
                 <li><Link to="/biblioteca">Biblioteca</Link></li>
                 <li><Link to="/form-frequencia">Frequência Alunos</Link></li> 
                 <li><Link to="/documentacao">Documentacão</Link></li>                    
               
               </ul>
             )}
           </li>
           
          
        </ul>
      </nav>
    </>
  );
}

export default MenuLateral;