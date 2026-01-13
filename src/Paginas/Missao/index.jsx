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

/*import React, { useState } from 'react';
import './Missao.css';

function Missao() {
  const [abaAtiva, setAbaAtiva] = useState('missao');

  const selecionarAba = (aba) => {
    setAbaAtiva(aba);
  };

  return (
    <div className="missao-container">
      <div className="abas">
        <button onClick={() => selecionarAba('missao')} className={abaAtiva === 'missao' ? 'ativa' : ''}>Nossa Missão</button>
        <button onClick={() => selecionarAba('historia')} className={abaAtiva === 'historia' ? 'ativa' : ''}>História</button>
        <button onClick={() => selecionarAba('objetivos')} className={abaAtiva === 'objetivos' ? 'ativa' : ''}>Objetivos</button>
      </div>

      <div className="conteudo-aba">
        {abaAtiva === 'missao' && (
          <>
            <img src="/Assets/img/Missao.jpg" alt="Missão" className="imagem-missao" />
            <p>
              Nossa missão é proporcionar formação cidadã e cultural por meio da arte, oferecendo oficinas de música, dança, teatro e expressão corporal para crianças e adolescentes em situação de vulnerabilidade.
            </p>
          </>
        )}

        {abaAtiva === 'historia' && (
          <p>
            A história do projeto "Arte & Frequência" teve início em 2015, com o objetivo de unir educação e cultura para fortalecer vínculos sociais através da arte. Desde então, dezenas de jovens foram impactados com experiências enriquecedoras.
          </p>
        )}

        {abaAtiva === 'objetivos' && (
          <ul>
            <li>Fortalecer a autoestima de crianças e adolescentes.</li>
            <li>Desenvolver habilidades artísticas e culturais.</li>
            <li>Estimular o trabalho em equipe e a disciplina.</li>
            <li>Oferecer espaço de expressão e inclusão social.</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Missao;*/
