/*import React from 'react';
import './Missao.css';
import { useNavigate } from 'react-router-dom';

function Missao() {
  const navigate = useNavigate();
  
    return (
      <div className="missao-container">
          <h2>Missão Fiel</h2>
        <img 
          src="/Assets/img/Missao.jpg" 
          alt="Imagem Missão" 
          className="missao-imagem"
        />
      
      <p>
        A <strong>Associação Pró-Cidadania</strong>, tem como missão transformar vidas por meio da música, da dança e das artes,
        proporcionando oportunidades de aprendizado, expressão e desenvolvimento humano para crianças e adolescentes.
      </p>
      <p>
        Acreditamos que a educação artística é um caminho para a inclusão, a disciplina e o fortalecimento de vínculos com a comunidade.
        Nosso compromisso é oferecer um espaço acolhedor, criativo e cheio de possibilidades.
      </p>

      <button className="botao-voltar-missao" onClick={() => navigate(-1)}>Fechar</button>
    </div>
  );
}

export default Missao;*/

import React from 'react';
import './Missao.css';
import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Missao() {
  const navigate = useNavigate();

  return (
    <div className="missao-container">
      <h2>Nossa Missão</h2>

      <img 
        src="/Assets/img/Missao.jpg" 
        alt="Imagem Missão" 
        className="imagem-missao"
      />

      <div className="missao-bloco">
        <FaBullseye className="icone" />
        <h3>Missão</h3>
        <p>
          Transformar vidas por meio da arte (música), educação e cultura, proporcionando as crianças e aos jovens oportunidades de
          aprendizado e desenvolvimento humano, social e profissional.
        </p>
      </div>

      <div className="missao-bloco">
        <FaEye className="icone" />
        <h3>Visão</h3>
        <p>
          Ser referência em inclusão social e formação cidadã através de práticas artísticas e educacionais acessíveis.
        </p>
      </div>

      <div className="missao-bloco">
        <FaHeart className="icone" />
        <h3>Valores</h3>
        <ul>
          <li>🌟 Respeito e Inclusão</li>
          <li>🎵 Compromisso com a Educação e a Cultura</li>
          <li>🤝 Responsabilidade Social</li>
          <li>🎨 Liberdade Criativa e Expressão</li>
          <li>🌱 Desenvolvimento Sustentável</li>
        </ul>
      </div>
      <button className="botao-voltar-missao" onClick={() => navigate(-1)}>Fechar</button>
    </div>
  );
}

export default Missao;
