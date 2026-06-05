

import React from 'react';
import './ProCidadania.css';

import Modal from '../../Componentes/ModalProcidadania/ModalProcidadania';

const imagem = "/Assets/img/logo-arte-frequencia.png";

function ProCidadania() {
  return (
    /* Essa nova div abaixo organiza o menu lateral e o conteúdo da página */
    <div className="layout-principal-procidadania">

      <Modal />

      <div className="missao-container">
        <h2>Associação Pró-Cidadania</h2>
        <img src={imagem} alt="imagem 3" />
        
        <div className="teste-historia">
          <h2>História</h2>
          <p className="texto-livro">
            ASSOCIAÇÃO PRO-CIDADANIA é uma associação sem fins lucrativos, criada em 26 de junho ano de 1991, 
            com a finalidade inicial de realizar promoção social de crianças e adolescentes, em risco social, 
            através do estudo da música, dança e teatro. A partir de sua fundação, a Pro-cidadania formalizou 
            diversos projetos e convênios com entidades municipais e estaduais, como forma de efetivar às ações 
            relativas à sua área de atuação, que hoje tem como foco, o ideal de fomentar e valorizar na sociedade 
            o crescimento da educação e cidadania.
          </p>

          <h2>Nosso Publico</h2>
          <p className="texto-livro">
            O Trabalho da Associação Pro-Cidadania é voltado para pessoas em situação de carência, 
            vulnerabilidade e exclusão social, seja por falta de recursos financeiros, Intelectuais, 
            geográficos ou de oportunidade. Servindo de elo entre o Poder Público, 
            a Iniciativa Privada e a sociedade.
          </p>
        </div>

        <div className="container-mvv">
          <div className="card-mvv">
            <div className="cards-header">Missão</div>
            <div className="card-body">
              <p>
                Transformar vidas por meio da arte (música), educação e cultura,
                proporcionando às crianças e aos jovens oportunidades de aprendizado
                e desenvolvimento humano, social e profissional.
              </p>
            </div>
          </div>

          <div className="card-mvv">
            <div className="cards-header">Visão</div>
            <div className="card-body">
              <p>
                Ser referência em inclusão social e formação cidadã através de
                práticas artísticas e educacionais acessíveis.
              </p>
            </div>
          </div>

          <div className="card-mvv">
            <div className="cards-header">Valores</div>
            <div className="card-body">
              <ul>
                <li>🌟 Respeito e Inclusão</li>
                <li>🎵 Compromisso com a Educação e a Cultura</li>
                <li>🤝 Responsabilidade Social</li>
                <li>🎨 Liberdade Criativa e Expressão</li>
                <li>🌱 Desenvolvimento Sustentável</li>
              </ul>
            </div>
          </div>
        </div>

      </div> 

    </div>
  );
}

export default ProCidadania;

/*
import React from 'react';
import './ProCidadania.css';

import Modal from '../../Componentes/ModalProcidadania/ModalProcidadania';

const imagem = "/Assets/img/logo-arte-frequencia.png";


function ProCidadania() {
  return (
      

  <div>

    <Modal/>


  <div className="missao-container">
      <h2>Associação Pró-Cidadania</h2>
      <img src={imagem} alt="imagem 3"/>
  <div className="teste-historia">

    <h2>História</h2>
    
    <p className="texto-livro">
  ASSOCIAÇÃO PRO-CIDADANIA é uma associação sem fins lucrativos, criada em 26 de junho ano de 1991, 
  com a finalidade inicial de realizar promoção social de crianças e adolescentes, em risco social, 
  através do estudo da música, dança e teatro. A partir de sua fundação, a Pro-cidadania formalizou 
  diversos projetos e convênios com entidades municipais e estaduais, como forma de efetivar às ações 
  relativas à sua área de atuação, que hoje tem como foco, o ideal de fomentar e valorizar na sociedade 
  o crescimento da educação e cidadania.
    </p>

    <h2>
      Nosso Publico
    </h2>
    <p className="texto-livro">
      O Trabalho da Associação Pro-Cidadania é voltado para pessoas em situação de carência, 
      vulnerabilidade e exclusão social, seja por falta de recursos financeiros, Intelectuais, 
      geográficos ou de oportunidade. Servindo de elo entre o Poder Público, 
      a Iniciativa Privada e a sociedade.

    </p>

  </div>

        <div className="container-mvv">
      <div className="card-mvv">
        <div className="cards-header">Missão</div>
        <div className="card-body">
          
          <p>
            Transformar vidas por meio da arte (música), educação e cultura,
            proporcionando às crianças e aos jovens oportunidades de aprendizado
            e desenvolvimento humano, social e profissional.
          </p>
        </div>
      </div>

      <div className="card-mvv">
        <div className="cards-header">Visão</div>
        <div className="card-body">
      
          <p>
            Ser referência em inclusão social e formação cidadã através de
            práticas artísticas e educacionais acessíveis.
          </p>
        </div>
      </div>

      <div className="card-mvv">
        <div className="cards-header">Valores</div>
        <div className="card-body">

          <ul>
            <li>🌟 Respeito e Inclusão</li>
            <li>🎵 Compromisso com a Educação e a Cultura</li>
            <li>🤝 Responsabilidade Social</li>
            <li>🎨 Liberdade Criativa e Expressão</li>
            <li>🌱 Desenvolvimento Sustentável</li>
          </ul>
        </div>
      </div>
    </div>
      
    </div>
      
    

        
          
  </div>  
  
  );
}

export default ProCidadania;


*/