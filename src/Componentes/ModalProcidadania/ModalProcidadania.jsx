

import React, { useState } from 'react';
import './ModalProcidadania.css';

const img1 = "/Assets/img/musucalizacaoinfantil.png";
const img2 = "/Assets/img/percurssao.webp";
const img3 = "/Assets/img/percussao.jpg";
const img4 = "/Assets/img/projetomusicadanca.jpg";
const img6 = "/Assets/img/apresentaçãobandavilalobos.jpg";

function ModalProcidadania() {
  const [modalAberto, setModalAberto] = useState(null);

  const abrirModal = (id) => setModalAberto(id);
  const fecharModal = () => setModalAberto(null);

  return (
    <div className="container-modal-procidadania">
      <h2>Nossos Projetos</h2>
      <ul className="lista">
        <li onClick={() => abrirModal('musica')}>🎵 Musicalização Infantil</li>
        <li onClick={() => abrirModal('instrumental')}>🎸 Prática Instrumental</li>
        <li onClick={() => abrirModal('percurssao')}>🥁 Percussão Popular</li>
        <li onClick={() => abrirModal('danca')}>💃 Danças e Teatro</li>
        <h2>Banda Marcial</h2>
        <li onClick={() => abrirModal('banda')}>🎺 Heitor Villa Lobos</li>
      </ul>

      {modalAberto === 'musica' && (
        <div className="modal-procidadania" onClick={fecharModal}>
          <div className="modal-content-procidadania" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={fecharModal}>&times;</span>            
            	
              <div className="modal-body-procidadania">
               <img src={img1} alt="imagem 3"/>
                <div className="texto">
                <h3>Musicalização Infantil</h3>
        
        <p className="texto-livro-modal">
              O Projeto Música, Dança e Teatro Instrumentos de Cidadania 
        tem como objetivo promover inclusão social e cidadania, 
        a crianças e adolescentes oriundo de couminidades carentes e em 
        vulnerabilidade social, da cidada de Igarassu - PE, realizado em parceria 
        com o Conselho Municipal de Defesa dos Direitos da Criança e do Adolescente - 
        COMDICA, anualmente oportuniza a dezenas de jovens o acesso a musica e dança, 
        e apartir de 2021, também as artes cênicas.
        </p>
  </div>
</div>

          </div>
        </div>
      )}

      {modalAberto === 'instrumental' && (
        <div className="modal-procidadania" onClick={fecharModal}>
          <div className="modal-content-procidadania" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={fecharModal}>&times;</span>

		<div className="modal-body-procidadania">
  <img src={img2} alt="imagem 3"/>
  <div className="texto">
<h3>Pratica Instrumental</h3>
        
        <p className="texto-livro-modal">
              O Projeto Música, Dança e Teatro Instrumentos de Cidadania 
        tem como objetivo promover inclusão social e cidadania, 
        a crianças e adolescentes oriundo de couminidades carentes e em 
        vulnerabilidade social, da cidada de Igarassu - PE, realizado em parceria 
        com o Conselho Municipal de Defesa dos Direitos da Criança e do Adolescente - 
        COMDICA, anualmente oportuniza a dezenas de jovens o acesso a musica e dança, 
        e apartir de 2021, também as artes cênicas.
        </p>
  </div>
</div>

          </div>
        </div>
      )}

      
      {modalAberto === 'percurssao' && (
        <div className="modal-procidadania" onClick={fecharModal}>
          <div className="modal-content-procidadania" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={fecharModal}>&times;</span>
                  <div className="modal-body-procidadania">
  <img src={img3} alt="imagem 3"/>
  <div className="texto">
	<h3>Percussão Popular</h3>
            <p className="texto-livro-modal">
                    A Associação pro-cidadania, Agencia e promove de artistas, 
              músicos, grupos culturais de Igarassu, formados por ex-alunos 
              ou integrados por eles, propiciando visibilidade, 
              legalização e oportunidade aos artistas locais oriundos de seus projetos. 
              Um exemplo de trabalho é a Orquestra Virtual, 
              uma orquestra de baile formada e dirigida, 
              por ex-alunos de nossos projetos, que vem se destacando no 
              cenário da boa música nacional, e representando Igarassu nos 
              grandes festivais da MPB, tais como o Festival Nacional da Seresta, entre outros.
        
            </p>
  </div>
</div>

          </div>
        </div>
      )}

      
      {modalAberto === 'danca' && (
        <div className="modal-procidadania" onClick={fecharModal}>
          <div className="modal-content-procidadania" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={fecharModal}>&times;</span>
            <div className="modal-body-procidadania">
  <img src={img4} alt="imagem 3"/>
  <div className="texto">
	<h3>Danças e Teatro</h3>
            <p className="texto-livro-modal">
                Projeto que visa o aproveitamento e valorização de jovens, 
                em situação de carência, na faixa etária de 08 a 17 anos, 
                moradores de Igarassu, priorizando alunos de escolas públicas. 
                Propiciando a inserção social e profissional destes indivíduos 
                através da música, dança e teatro, utilizados no programa 
                da escola de música e da Banda Heitor Villa lobos, 
                e dos projetos Músico Cidadão – 
                Escola de Música Heitor Villa, em parceria com a Prefeitura Municipal de 
                IGARASSU-PE; Musica instrumento de Cidadania, em parceira com o Conselho Municipal 
                de Defesa dos Diretos da Criança e do Adolescente- COMDICA, e Música e Escola, 
                instrumentos de Cidadania. 
                A organização atua também na área de realização de Eventos educacionais e esportivos, 
                a exemplos de Certames que envolvem música, dança e esportes.
            </p>
  </div>
</div>
          </div>
        </div>
      )}


        {modalAberto === 'banda' && (
        <div className="modal-procidadania" onClick={fecharModal}>
          <div className="modal-content-procidadania" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={fecharModal}>&times;</span>
            
		<div className="modal-body-procidadania">
  <img src={img6} alt="imagem 3"/>
  <div className="texto">
    <p className="texto-livro-modal">
        Banda Marcial localizada na cidade de Igarassu, estado de Pernambuco, 
      rasil. Com uma Formação instrumental baseada em metais e percussão, 
      contando com um contigente médio de 60 jovens, na faixa etária entre 10 e 16 anos 
      residentes em igarassu e região. Todos, os jovens músicos, oriundos do Projeto 
      "Música e Dança Instrumentos de Cidadania" realizado pela instituição 
      em parceria com Prefeitura Municipal de Igarassu e a escola estadual João Pessoa Guerra. 
      A banda tem como títulos mais representativos
      </p>

      <p>🏆 Campeã Pernambucana Infanto Juvenil em 2011</p>
      <p>🏆 Campeã Concurso Nacional 2006 Campo Grande - MS</p>
      <p>🏆 Campeã Norte e Nordeste 2005  São Luis - MA</p>
      <p>🏆 Bicampeã Norte e Nordeste 2008 Igarassu - PE</p>
      <p>🏆 Tetra Campeã do Campeonato Pernambucano de Bandas e Fanfarras - PE</p>
  </div>
</div>

          </div>
        </div>
      )}

    </div>
     
    
  );
}


export default ModalProcidadania;