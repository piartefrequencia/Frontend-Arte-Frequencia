import React from 'react';
import './Oficinas.css';
import { useNavigate } from 'react-router-dom';

function Danca() {
  const navigate = useNavigate();
  
    return (
      <div className="danca-container">

        <h2>DANÇAS</h2>

        <img 
          src="/Assets/img/Missao.jpg" 
          alt="Imagem Dança" 
          className="danca-imagem"
        />
      
      <p>
        A <strong>Associação Pró-Cidadania</strong>, tem como missão transformar vidas por meio da música, da dança e das artes,
        proporcionando oportunidades de aprendizado, expressão e desenvolvimento humano para crianças e adolescentes.
      </p>
      <p>
        Acreditamos que a educação artística é um caminho para a inclusão, a disciplina e o fortalecimento de vínculos com a comunidade.
        Nosso compromisso é oferecer um espaço acolhedor, criativo e cheio de possibilidades.
      </p>

      <button className="botao-voltar-danca" onClick={() => navigate(-1)}>Fechar</button>
    </div>
  );
}

export default Danca;
