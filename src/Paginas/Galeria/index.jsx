import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Galeria.css';

function Galeria() {
  const navigate = useNavigate();

  const imagens = [
    '/Assets/img/Galery/Galery_00001.jpeg',
    '/Assets/img/Galery/Galery_00002.jpg',
    '/Assets/img/Galery/Galery_00003.jpg',
    '/Assets/img/Galery/Galery_00004.jpg'
  ];

  const videos = [
    'https://www.youtube.com/embed/cPNAkaROkxY?si=BarnhmLNSb32Rfjq',
    'https://www.youtube.com/embed/rLNo9RGknww?si=tFtFWRaCcrrxgaE9',
    'https://www.youtube.com/embed/QaFJnUcCkYU?si=wegEhdfRTCHNWo0c',
    'https://www.youtube.com/embed/yLLwBESXfnU?si=K6fAFJSONtPfmy4e',
    'https://www.youtube.com/embed/6i5oU9OGGjU?si=SG_4kfwZXnNoylLN',
    'https://www.youtube.com/embed/UlaEojmY6qw?si=b7hDP2Ogi3z0C-xA'
  ];

  const [imgAtual, setImgAtual] = useState(0);
  const [videoAtual, setVideoAtual] = useState(0);
  const [zoomAtivo, setZoomAtivo] = useState(false);

  const avancarImg = () => {
    setImgAtual((imgAtual + 1) % imagens.length);
    setZoomAtivo(false);
  };

  const voltarImg = () => {
    setImgAtual((imgAtual - 1 + imagens.length) % imagens.length);
    setZoomAtivo(false);
  };

  const avancarVideo = () => {
    setVideoAtual((videoAtual + 1) % videos.length);
  };

  const voltarVideo = () => {
    setVideoAtual((videoAtual - 1 + videos.length) % videos.length);
  };

  const alternarZoom = () => {
    setZoomAtivo(!zoomAtivo);
  };

  return (
    <div className="galeria-container">

      <h2>Galeria de Imagens</h2>
      <div className="carrossel">
        <button onClick={voltarImg} className="seta">←</button>
        <div 
          className={`item-galeria ${zoomAtivo ? 'zoom' : ''}`} 
          onClick={alternarZoom}
        >
          <img src={imagens[imgAtual]} alt={`Imagem ${imgAtual + 1}`} />
        </div>
        <button onClick={avancarImg} className="seta">→</button>
      </div>

      <p className="instrucao">Clique na imagem para ampliar ou voltar ao normal.</p>

      <h2 style={{ marginTop: '40px' }}>Galeria de Vídeos</h2>
      <div className="carrossel">
        <button onClick={voltarVideo} className="seta">←</button>
        <div className="item-galeria video">
          <iframe
            src={videos[videoAtual]}
            title={`Vídeo ${videoAtual + 1}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <button onClick={avancarVideo} className="seta">→</button>
      </div>
      {/* ✅ Botão agora no fim da galeria */}
      <div className="fechar-container">
        <button className="botao-voltar-galeria" onClick={() => navigate(-1)}>FECHAR
        </button>
      </div>
    </div>
  );
}

export default Galeria;
