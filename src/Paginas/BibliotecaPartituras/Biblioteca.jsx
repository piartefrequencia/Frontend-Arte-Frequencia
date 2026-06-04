

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

  // Carregar arquivos do backend
  useEffect(() => {
    const carregarArquivos = async () => {
      try {
        const response = await Api.get('/partitura');
        if (response.status === 200) {
          setArquivos(response.data);
        } else if (response.status === 204) {
          alert('Nenhum arquivo encontrado.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar arquivos.');
      }
    };
    carregarArquivos();

    // Proteção básica
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && ['c', 'u', 's', 'p'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        alert('Ação desabilitada por segurança.');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Upload de arquivos
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await Api.post('/partitura', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.status === 201) {
          setArquivos(prev => [...prev, response.data]);
          alert(`Arquivo "${file.name}" enviado com sucesso!`);
        } else {
          alert(`Erro ao enviar arquivo "${file.name}".`);
        }
      } catch (error) {
        console.error(error);
        alert(`Erro ao enviar arquivo "${file.name}": ` + (error.response?.data || error.message));
      }
    }
  };

  // --- FUNÇÃO DE DOWNLOAD CORRIGIDA ---
  const handleDownload = async (id, nomeArquivo) => {
    try {
      const response = await Api.get(`/partitura/${id}/download`, {
        responseType: 'blob', // Essencial para arquivos
      });

      // Cria a URL do arquivo na memória do navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Força o download com o nome original
      link.setAttribute('download', nomeArquivo); 
      document.body.appendChild(link);
      link.click();

      // Limpa a memória
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar:", error);
      alert("Não foi possível baixar o arquivo.");
    }
  };

  const abrirModal = async (id, tipo) => {
    try {
      const response = await Api.get(`/partitura/${id}/visualizar`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: tipo }));
      setBlobUrl(url);
      setModal({ aberto: true, url: url, tipo: tipo });
    } catch (error) {
      alert("Erro ao carregar visualização.");
    }
  };

  const fecharModal = () => {
    if (blobUrl) window.URL.revokeObjectURL(blobUrl);
    setModal({ aberto: false, url: '', tipo: '' });
    setBlobUrl('');
  };

  const handleExcluir = async (id, nome) => {
    if (!window.confirm(`Excluir "${nome}"?`)) return;
    try {
      await Api.delete(`/partitura/${id}`);
      setArquivos(prev => prev.filter(arq => arq.id !== id));
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const arquivosFiltrados = arquivos.filter(arq =>
    arq.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="galeria-container">
      <h2>Biblioteca de Partituras</h2>

       <div className="upload-area">
          <label className="botao-upload">
            Upload de Arquivos
            <input
              type="file"
              multiple
              accept=".pdf, .png, .jpg, .jpeg"
              onChange={handleUpload}
              hidden
            />
          </label>
        </div>

      <input
        type="text"
        placeholder="Pesquisar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="campo-busca"
      />

      <div className="lista-arquivos">
        {arquivosFiltrados.map((arq) => {
          const ext = arq.nome.split('.').pop().toLowerCase();
          const icone = ext === 'pdf' ? '📕' : '🖼️';

          return (
            <div key={arq.id} className="arquivo">
              <p onClick={() => abrirModal(arq.id, arq.tipo)} style={{ cursor: 'pointer' }}>
                {icone} {arq.nome}
              </p>

              <div className="acoes">
                <button 
                  className="btn-download" 
                  onClick={() => handleDownload(arq.id, arq.nome)}
                >
                  📥 Download
                </button>

                <button className="btn-excluir" onClick={() => handleExcluir(arq.id, arq.nome)}>
                  🗑️ Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal.aberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {['jpg', 'jpeg', 'png'].includes(modal.tipo) ? (
              <img src={modal.url} alt="View" />
            ) : (
              <iframe src={modal.url} title="PDF" />
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


