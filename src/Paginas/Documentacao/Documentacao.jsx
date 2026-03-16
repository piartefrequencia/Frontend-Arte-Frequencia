


import React, { useEffect, useState } from "react";
import api from "../../Servico/APIservico";
import "./Documentacao.css";
import { useNavigate } from "react-router-dom";

const API_BASE = api.defaults.baseURL;

export default function Documentacao() {

  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [crachaUrl, setCrachaUrl] = useState("");

  const [selecionados, setSelecionados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {

      setLoading(true);

      try {
        const response = await api.get("/aluno");
        setAlunos(response.data || []);
      } catch {
        setErro("Erro ao carregar alunos.");
      } finally {
        setLoading(false);
      }

    };

    carregarAlunos();
  }, []);

  // -----------------------------
  // FILTRO DE BUSCA
  // -----------------------------

  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  // -----------------------------
  // MODAL
  // -----------------------------

  const abrirModalCracha = (aluno) => {

    setAlunoSelecionado(aluno);
    setCrachaUrl(`${API_BASE}/aluno/${aluno.matricula}/cracha.png`);
    setModalOpen(true);

  };

  const fecharModal = () => {

    setModalOpen(false);
    setAlunoSelecionado(null);

  };

  // -----------------------------
  // DOWNLOAD DO CRACHÁ
  // -----------------------------

  const baixarCracha = async () => {

    if (!alunoSelecionado) return;

    try {

      const response = await api.get(
        `/aluno/${alunoSelecionado.matricula}/cracha.png`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `cracha-${alunoSelecionado.nome}.png`);

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch {

      alert("Erro ao baixar o crachá");

    }

  };

  // -----------------------------
  // SELECIONAR PARA IMPRESSÃO
  // -----------------------------

  const toggleSelecionado = (aluno) => {

    const existe = selecionados.find(a => a.matricula === aluno.matricula);

    if (existe) {

      setSelecionados(
        selecionados.filter(a => a.matricula !== aluno.matricula)
      );

    } else {

      setSelecionados([...selecionados, aluno]);

    }

  };

  // -----------------------------
  // IMPRIMIR VÁRIOS CRACHÁS
  // -----------------------------

  const imprimirSelecionados = () => {

    if (selecionados.length === 0) {
      alert("Selecione alunos para imprimir.");
      return;
    }

    const win = window.open("", "_blank");

    const cards = selecionados.map(aluno => {

      const url = `${API_BASE}/aluno/${aluno.matricula}/cracha.png`;

      return `

        <div class="card">

          <img src="${url}" />

          <p>${aluno.nome}</p>

          <p>Matrícula: ${aluno.matricula}</p>

        </div>

      `;

    }).join("");

    win.document.write(`

      <html>

      <head>

      <style>

      body{
      font-family:Arial;
      padding:30px;
      }

      .container{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:20px;
      }

      .card{
      border:1px solid #ccc;
      padding:10px;
      text-align:center;
      border-radius:10px;
      }

      img{
      max-width:200px;
      }

      </style>

      </head>

      <body>

      <button onclick="window.print()">Imprimir</button>

      <div class="container">

      ${cards}

      </div>

      </body>

      </html>

    `);

    win.document.close();

  };

  const handleVoltar = () => navigate("/");

  return (

    <div className="doc-container">

      <header className="doc-header">

        <h2>Documentação Digital</h2>

        <p>Gerencie os registros e crachás dos alunos.</p>

      </header>

      {/* BARRA DE PESQUISA */}

      <div className="barra-pesquisa">

        <input
          type="text"
          placeholder="Pesquisar aluno pelo nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

      </div>

      {loading && <p>Carregando alunos...</p>}

      {erro && <p>{erro}</p>}

      <div className="tabela-card">

        <div className="acoes-topo">

          <button
            className="btn-filled"
            onClick={imprimirSelecionados}
          >
            Imprimir Selecionados
          </button>

        </div>

        <table className="tabela-alunos">

          <thead>

            <tr>

              <th></th>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Ações</th>

            </tr>

          </thead>

          <tbody>

            {alunosFiltrados.map(aluno => (

              <tr key={aluno.matricula}>

                <td>

                  <input
                    type="checkbox"
                    onChange={() => toggleSelecionado(aluno)}
                  />

                </td>

                <td>{aluno.matricula}</td>

                <td>{aluno.nome}</td>

                <td>

                  <button
                    className="btn-action"
                    onClick={() => abrirModalCracha(aluno)}
                  >
                    Visualizar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <button
          className="btn-voltar"
          onClick={handleVoltar}>
          Fechar
        </button>

      </div>

      {/* MODAL */}

      {modalOpen && alunoSelecionado && (

        <div className="modal-backdrop" onClick={fecharModal}>

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h3>Crachá do Aluno</h3>

              <button
                className="btn-close"
                onClick={fecharModal}
              >
                ×
              </button>

            </div>

            <div className="modal-body">
              <div className="cracha-preview">
                <img src={crachaUrl} alt="Cracha" />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-voltar"
                onClick={baixarCracha}>
                Baixar Imagem
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
