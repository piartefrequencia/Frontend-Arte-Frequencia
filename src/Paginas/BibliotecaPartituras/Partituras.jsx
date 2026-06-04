

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import Api from "../../Servico/APIservico";
import './GaleriaPart.css';

function Partitura() {
 
  const { isAuthenticated, loading } = useContext(AuthContext);

  const [arquivos, setArquivos] = useState([]);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12; 

  const [modal, setModal] = useState({
    aberto: false,
    url: '',
    tipo: ''
  });
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (loading) return;

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
        alert(
          'Erro ao carregar arquivos: ' +
          (error.response?.data || error.message)
        );
      }
    };

    carregarArquivos();

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
  }, [loading]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const abrirModal = async (id, tipo) => {
    if (!isAuthenticated) {
      alert('O conteúdo das partituras é exclusivo para Alunos Matriculados e Professores da Associação Pró-Cidadania.');
      return;
    }

    try {
      const response = await Api.get(`/partitura/${id}/visualizar`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: tipo })
      );

      setBlobUrl(url);
      setModal({
        aberto: true,
        url,
        tipo,
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar arquivo.');
    }
  };

  const baixarArquivo = async (id, nomeArquivo) => {
    if (!isAuthenticated) {
      alert('O conteúdo das partituras é exclusivo para Alunos Matriculados e Professores da Associação Pró-Cidadania.');
      return;
    }

    try {
      const response = await Api.get(`/partitura/${id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Erro ao baixar arquivo.');
    }
  };

  const fecharModal = () => {
    if (blobUrl) {
      window.URL.revokeObjectURL(blobUrl);
    }
    setModal({ aberto: false, url: '', tipo: '' });
    setBlobUrl('');
  };


  const arquivosFiltrados = arquivos.filter((arq) =>
    arq.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensDaPaginaAtual = arquivosFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(arquivosFiltrados.length / itensPorPagina);

  if (loading) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <div className="galeria-container">
      <h2>Partituras Banda Heitor Villa Lobos</h2>

      <input
        type="text"
        placeholder="Pesquisar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="campo-busca"
      />

      <div className="lista-arquivos">
        {itensDaPaginaAtual.length > 0 ? (
          itensDaPaginaAtual.map((arq) => {
            const ext = arq.nome.split('.').pop().toLowerCase();
            let icone = '📄';

            if (ext === 'pdf') {
              icone = '📕';
            } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
              icone = '🖼️';
            }

            return (
              <div key={arq.id} className="arquivo">
                <p
                  className="link-visualizar"
                  onClick={() => abrirModal(arq.id, arq.tipo)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {icone} {arq.nome}
                </p>

                <button
                  className="btn-download"
                  onClick={() => baixarArquivo(arq.id, arq.nome)}
                >
                  📥 Download de Partitura
                </button>
              </div>
            );
          })
        ) : (
          <p>Nenhum arquivo encontrado.</p>
        )}
      </div>


      {totalPaginas > 1 && (
        <div className="paginacao-container-partituras">
          <button 
            className="btn-paginacao-partituras" 
            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          
          <span className="info-paginacao-partituras">
            Página <strong>{paginaAtual}</strong> de {totalPaginas}
          </span>

          <button 
            className="btn-paginacao-partituras" 
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>
      )}

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
       
      </div>
    </div>
  );
}

export default Partitura;