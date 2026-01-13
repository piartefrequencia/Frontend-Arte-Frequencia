


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from "../../Servico/APIservico";
import './GaleriaPart.css';

function Biblioteca() {

  const navigate = useNavigate();
  const [arquivos, setArquivos] = useState([]);
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState({ aberto: false, url: '', tipo: '' });
  const [blobUrl, setBlobUrl] = useState('');


  const API_BASE_URL = process.env.REACT_APP_API_URL;



  // Carregar arquivos do backend
  useEffect(() => {
    const carregarArquivos = async () => {
      try {
        const response = await Api.get('/partitura');
        if (response.status === 200) {
          setArquivos(response.data);
        } else if (response.status === 204) {
          alert('Nenhum arquivo encontrado.');
        } else {
          alert('Erro ao carregar arquivos.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar arquivos: ' + (error.response?.data || error.message));
      }
    };
    carregarArquivos();

    // Proteção contra print e copiar
    const handleKeyDown = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['c', 'u', 's', 'p'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        alert('Ação desabilitada por segurança.');
      }
    };
    const handleContextMenu = (e) => e.preventDefault();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Filtra arquivos
  const arquivosFiltrados = arquivos.filter(arq =>
    arq.nome.toLowerCase().includes(busca.toLowerCase())
  );

const abrirModal = async (id, tipo) => {
  try {
   
    const response = await Api.get(`/partitura/${id}/visualizar`, {
      responseType: 'blob', 
    });


    const url = window.URL.createObjectURL(new Blob([response.data], { type: tipo }));
    
    setBlobUrl(url);
    setModal({ aberto: true, url: url, tipo: tipo });
  } catch (error) {
    console.error("Erro ao carregar visualização:", error);
    alert("Erro ao carregar o arquivo. Verifique se você está logado.");
  }
};


const fecharModal = () => {
  if (blobUrl) {
    window.URL.revokeObjectURL(blobUrl); 
  }
  setModal({ aberto: false, url: '', tipo: '' });
  setBlobUrl('');
};

  return (
    <div className="galeria-container">
      <h2>Partituras Banda Heitor Villa Lobos</h2>


      <div className="lista-arquivos">
        {arquivosFiltrados.length > 0 ? (
          arquivosFiltrados.map((arq) => {
            const ext = arq.nome.split('.').pop().toLowerCase();
            let icone = '📄';
            if (ext === 'pdf') icone = '📕';
            else if (['jpg', 'jpeg', 'png'].includes(ext)) icone = '🖼️';

            return (
              <div key={arq.id} className="arquivo">
                <p
                  className="link-visualizar"
                  onClick={() => abrirModal(arq.id, arq.tipo)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {icone} {arq.nome}
                </p>

                  <a
                   href={`${API_BASE_URL}/partitura/${arq.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  
                    <button className="btn-download">📥 Download de Partitura</button>
                  </a>
               
              </div>
            );
          })
        ) : (
          <p>Nenhum arquivo encontrado.</p>
        )}
      </div>

      {modal.aberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {['jpg', 'jpeg', 'png'].includes(modal.tipo) ? (
              <img src={modal.url} alt="Visualização" className="protegido" />
            ) : (
              <iframe src={modal.url} title="PDF" className="protegido" />
            )}
            <button className="close-button" onClick={fecharModal}>✖</button>
          </div>
        </div>
      )}

      <div className="fechar-container">
        <button className="btn-voltar" onClick={() => navigate("/")}>FECHAR</button>
      </div>
    </div>
  );
}

export default Biblioteca;