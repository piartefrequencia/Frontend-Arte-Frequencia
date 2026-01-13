import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [submenuAberto, setSubmenuAberto] = useState(null);
  const navigate = useNavigate();

  const alternarSubmenu = (item) => {
    setSubmenuAberto((prev) => (prev === item ? null : item));
  };

  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <nav className="menu-bar-horizontal">
      <ul className="menu-bar-lista">
        <li>
          <button onClick={() => alternarSubmenu('sobre')}
                        >Sobre ▾</button>
          {submenuAberto === 'sobre' && (
            <ul className="submenu-horizontal dropdown-menu show">
              
              <li><Link to="/missao">Nossa Missão</Link></li>
              <li><Link to="/nossos-colaboradores">Nossos Colaboradores</Link></li>
              <li><Link to="/galeria">Galeria de Imagens e Vídeos</Link></li>
              <li><Link to="/Partituras">Biblioteca Partituras</Link></li>
            
            </ul>
          )}
        </li>

        <li onClick={() => alternarSubmenu('oficinas')} >
          <button>Oficinas ▾</button>
          {submenuAberto === 'oficinas' && (
            <ul className="submenu-horizontal">
              <li><Link to="/musicalizacao">Musicalização Infantil</Link></li>
              <li><Link to="/instrumental">Prática Instrumental</Link></li>
              <li><Link to="/percussao">Percussão Popular</Link></li>
              <li><Link to="/danca">Danças</Link></li>
            </ul>
          )}
        </li>
        <li>
       
          <button onClick={() => navigate('/login')}>Login</button> 
       
        </li>
        
      </ul>
    </nav>
  );
}

export default NavBar;
