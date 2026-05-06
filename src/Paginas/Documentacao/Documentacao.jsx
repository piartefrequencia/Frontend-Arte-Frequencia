

import React, { useEffect, useState } from "react";
import api from "../../Servico/APIservico";
import "./Documentacao.css";
import { useNavigate } from "react-router-dom";

function Documentacao() {
  
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregandoCracha, setCarregandoCracha] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const alunosPorPagina = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [crachaUrl, setCrachaUrl] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const response = await api.get("/aluno");
        setAlunos(response.data || []);
      } catch {
        console.error("Erro ao carregar alunos.");
      }
    };
    carregarAlunos();
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(alunosFiltrados.length / alunosPorPagina);
  const indiceUltimo = paginaAtual * alunosPorPagina;
  const indicePrimeiro = indiceUltimo - alunosPorPagina;
  const alunosExibidos = alunosFiltrados.slice(indicePrimeiro, indiceUltimo);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setPaginaAtual(1);
  };

  const abrirModalCracha = async (aluno) => {
    setCarregandoCracha(true);
    setAlunoSelecionado(aluno);
    setModalOpen(true);

    try {
      const response = await api.get(`/aluno/${aluno.id}/cracha.png`, {
        responseType: "blob",
      });
      const urlLocal = window.URL.createObjectURL(new Blob([response.data]));
      setCrachaUrl(urlLocal);
    } catch (err) {
      alert("Erro ao carregar a prévia do crachá.");
      fecharModal();
    } finally {
      setCarregandoCracha(false);
    }
  };

  const fecharModal = () => {
    if (crachaUrl) window.URL.revokeObjectURL(crachaUrl);
    setModalOpen(false);
    setAlunoSelecionado(null);
    setCrachaUrl("");
    setCarregandoCracha(false);
  };

  const baixarCracha = async () => {
    if (!alunoSelecionado) return;
    try {
      const response = await api.get(`/aluno/${alunoSelecionado.id}/cracha.png`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cracha-${alunoSelecionado.nome}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao baixar o crachá");
    }
  };

  const baixarSelecionados = async () => {
    if (selecionados.length === 0) {
      alert("Selecione alunos para baixar os crachás.");
      return;
    }

    setCarregandoCracha(true);

    for (const aluno of selecionados) {
      try {
        const response = await api.get(`/aluno/${aluno.id}/cracha.png`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cracha-${aluno.nome}.png`);
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (err) {
        console.error(`Erro no crachá de: ${aluno.nome}`);
      }
    }

    setCarregandoCracha(false);
    setSelecionados([]); 
    alert("Downloads concluídos! A seleção foi limpa.");
  };

  const toggleSelecionado = (aluno) => {
    const existe = selecionados.find((a) => a.id === aluno.id);
    if (existe) {
      setSelecionados(selecionados.filter((a) => a.id !== aluno.id));
    } else {
      setSelecionados([...selecionados, aluno]);
    }
  };

  return (
    <div className="doc-container">
      <header className="doc-header">
        <h2>Documentação Digital</h2>
        <p>Gerencie os registros e crachás dos alunos.</p>
      </header>

      <div className="barra-pesquisa">
        <input
          id="busca-aluno"
          name="busca-aluno"
          type="text"
          placeholder="Pesquisar por nome..."
          value={filtro}
          onChange={handleFiltroChange}
        />
      </div>

      <div className="tabela-card">
        <div className="acoes-topo">
          <button 
            className="btn-filled" 
            onClick={baixarSelecionados}
            disabled={carregandoCracha || selecionados.length === 0}
          >
            {carregandoCracha ? "Baixando Crachás..." : `Baixar Crachás Selecionados (${selecionados.length})`}
          </button>
        </div>

        <table className="tabela-alunos">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosExibidos.map((aluno) => (
              <tr key={aluno.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!selecionados.find((s) => s.id === aluno.id)}
                    onChange={() => toggleSelecionado(aluno)}
                  />
                </td>
                <td style={{ fontWeight: "bold", color: "#666" }}>{aluno.id}</td>
                <td>{aluno.matricula}</td>
                <td>{aluno.nome}</td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => abrirModalCracha(aluno)}
                    disabled={carregandoCracha}
                  >
                    {carregandoCracha && alunoSelecionado?.id === aluno.id
                      ? "..."
                      : "Visualizar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className="paginacao-footer">
            <button
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual(paginaAtual - 1)}
            >
              Anterior
            </button>
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPaginaAtual(paginaAtual + 1)}
            >
              Próxima
            </button>
          </div>
        )}

        <button className="btn-voltar" onClick={() => navigate("/")}>
          Fechar
        </button>
      </div>

      {modalOpen && alunoSelecionado && (
        <div className="modal-backdrop" onClick={fecharModal}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crachá: {alunoSelecionado.nome}</h3>
              <button className="btn-close" onClick={fecharModal}></button>
            </div>
            <div className="modal-body">
              <div className="cracha-preview">
                {carregandoCracha ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Gerando crachá digital...</p>
                  </div>
                ) : (
                  crachaUrl && <img src={crachaUrl} alt="Cracha" />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-filled"
                onClick={baixarCracha}
                disabled={carregandoCracha}
              >
                Baixar Crachá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default  Documentacao;