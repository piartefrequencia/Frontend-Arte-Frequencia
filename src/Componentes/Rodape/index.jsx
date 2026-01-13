import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Player from '../Player/Player';
import './Rodape.css';
import { FaThreads } from 'react-icons/fa6';

const Rodape = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          
          <img src="Assets/img/Logo_AF.png" alt="Logo" />
        </div>
        <div className="footer-info">
          <p>Acessem nossas redes sociais e conheçam de perto o nosso projeto.</p>
        </div>
        <div className="social-icons">
          <a href="https://www.facebook.com/procidadania.silva" target="_blank" rel="noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com/associacaoprocidadania/" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.threads.net/@seu_usuario" target="_blank" rel="noreferrer">
            <FaThreads />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor">
                
              <path d="M12.005 2C6.486 2 2 6.486 2 12.005S6.486 22.01 12.005 22.01c5.518 0 10.004-4.486 10.004-10.005S17.523 2 12.005 2Zm-.001 18.164a8.163 8.163 0 1 1 0-16.326 8.163 8.163 0 0 1 0 16.326Zm1.013-6.26c-.38-1.2-1.51-1.362-2.26-1.504l-.093-.018c-.414-.08-.93-.18-1.18-.47-.235-.27-.27-.684-.09-1.046.155-.3.483-.47.926-.5.672-.044 1.287.25 1.644.79.174.25.323.533.446.84l1.537-.53a5.485 5.485 0 0 0-.607-1.118c-.727-1.03-1.88-1.622-3.032-1.55-1.11.07-2.026.617-2.48 1.467-.453.85-.398 1.865.146 2.5.553.645 1.33.802 1.92.915l.097.018c.422.08.946.18 1.204.5.27.333.304.843.093 1.315-.205.454-.636.74-1.2.774a1.984 1.984 0 0 1-1.645-.69 3.628 3.628 0 0 1-.668-1.066l-1.52.58a5.355 5.355 0 0 0 .9 1.447c.757.878 1.83 1.384 2.938 1.384.1 0 .2 0 .3-.007 1.235-.077 2.223-.733 2.678-1.747.387-.86.39-1.803.008-2.76Z"/>
            </svg>
            </a>
            <a href="https://wa.me/5581988195849" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
        </div>
        <div className="footer-player">
          <Player />
        </div>
        
    </div>
      <div className="logos-apoio-nome">
      <p>APOIO:</p>
      </div>
       <div className="logos-apoio">
        <a href="https://instagram.com/associacaoprocidadania" target="_blank" rel="noreferrer">
          <img src="Assets/img/Logo_Apoio/ProCidadania.png" alt="Logo Apoio 1" />
        </a>
        <a href="https://instagram.com/comdica_igarassu" target="_blank" rel="noreferrer">
          <img src="Assets/img/Logo_Apoio/COMDICA_IGA.png" alt="Logo Apoio 2" />
        </a>
        <a href="https://instagram.com/bandamarcialheitorvillalobos" target="_blank" rel="noreferrer">
          <img src="Assets/img/Logo_Apoio/HVL.png" alt="Logo Apoio 3" />
        </a>
      </div>
      <div className="footer-copy">
          &copy; 2025 PI Arte & Frequência - Todos os direitos reservados.
        </div>
    </footer>
  );
};

export default Rodape;
