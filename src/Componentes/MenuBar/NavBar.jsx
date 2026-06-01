

import React, { useState } from "react";
import './NavBar.css';
import { NavLink } from "react-router-dom";



function NavBar() {
  const [open, setOpen] = useState(false);
 

  const irParaFinalDaPagina = (e) => {
    e.preventDefault(); 
    setOpen(false);
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${open ? "navbar-open" : ""}`}>

      <button
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      <ul className={`menu ${open ? "menu-open" : ""}`}>
   
        <li><NavLink to="/" onClick={() => setOpen(false)}>Ínicio</NavLink></li>
        <li><NavLink to="/quemsomos" onClick={() => setOpen(false)}>Quem Somos</NavLink></li>
        <li><NavLink to="/partituras" onClick={() => setOpen(false)}>Biblioteca Partituras</NavLink></li>
        <li><NavLink to="#" onClick={irParaFinalDaPagina}>Informações</NavLink></li>
        <li><NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink></li>
        
      </ul>
    </nav>
  );
}

export default NavBar;