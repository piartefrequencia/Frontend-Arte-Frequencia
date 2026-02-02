

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from '../../Context/AuthContext';
import './CabecalhoUsuario.css'; 

function CabecalhoUsuario() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  
  const initials = useMemo(() => {
    if (!user) return ""; // Lógica interna segura
    const nome = user.usuario || "";
    const parts = nome.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [user?.usuario]);


  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  
  if (!user) return null;

  const handleToggle = () => setOpen((v) => !v);

  return (
    <div className="userheader-container">
      <button
        ref={buttonRef}
        className="uh-trigger"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        title={user.usuario}
      >
        <div className="uh-avatar-small">{initials}</div>
        <span className="uh-name">{user.usuario}</span>
        <span className={`uh-chevron ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <div ref={wrapperRef} className="uh-dropdown" role="menu" aria-label="Menu do usuário">
          <button className="uh-close" onClick={() => setOpen(false)} aria-label="Fechar">
            ✕
          </button>

          <div className="uh-card">
            <div className="uh-avatar-big">{initials}</div>
            <div className="uh-username">{user.usuario}</div>
            <div className="uh-sep" />
            <div className="uh-email" title={user.email}>{user.email}</div>
            <div className="uh-divider" />
            <button className="uh-logout" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CabecalhoUsuario;


