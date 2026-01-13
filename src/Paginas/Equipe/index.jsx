import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Equipe.css';

function Equipe() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const colaboradores = [
    {
      src: '/Assets/img/Colaboradores/Alexsandra_0001.jpg',
      nome: 'Alexsandra Barretto',
      funcao: 'Presidente da Instituição',
    },
    {
      src: '/Assets/img/Colaboradores/Carlos_Barretto_0001.jpg',
      nome: 'Carlos Barretto',
      funcao: 'Vice-presidente da Instituição',
    },
    {
      src: '/Assets/img/Colaboradores/Irvi_Tavares_0001.jpg',
      nome: 'Irvi Tavares',
      funcao: 'Diretor Geral e Prof. de Prática Instrumental',
    },
    {
      src: '/Assets/img/Colaboradores/Clodoaldo_0001.jpg',
      nome: 'Clodoaldo Vicente',
      funcao: 'Professor de Música e Maestro',
    },
    {src: '/Assets/img/Colaboradores/Fulano.png',
      nome: 'Nome',
      funcao: 'Instrutor de Percussão',
    },
    {
      src: '/Assets/img/Colaboradores/Fulano.png',
      nome: 'Nome',
      funcao: 'Instrutor(a) de Dança',
    },
    {
      src: '/Assets/img/Colaboradores/Fulano.png',
      nome: 'Nome',
      funcao: 'Instrutor de Graves',
    },
    {
      src: '/Assets/img/Colaboradores/Fulano.png',
      nome: 'Nome',
      funcao: 'Educadora Infantil',
    }
  ];

  const abrirModal = (src) => {
    setModalContent(src);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setModalContent('');
  };

  return (
    <div className="equipe-container">
      <h2>Nossos Colaboradores</h2>

      <div className="equipe-grid">
        {colaboradores.map((colab, index) => (
          <div className="colaborador" key={index}>
            <img
              src={colab.src}
              alt={colab.nome}
              onClick={() => abrirModal(colab.src)}
            />
            <div className="info">
              <strong>{colab.nome}</strong>
              <p>{colab.funcao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalContent} alt="Colaborador Ampliado" />
            <button className="close-button" onClick={fecharModal}>✕</button>
          </div>
        </div>
      )}

      <div className="fechar-container">
        <button className="botao-voltar-galeria" onClick={() => navigate(-1)}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default Equipe;