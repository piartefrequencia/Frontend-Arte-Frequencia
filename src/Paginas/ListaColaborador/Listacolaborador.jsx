


import React, { useEffect, useState } from "react";
import "./Listacolaborador.css";
import { useNavigate } from "react-router-dom";
import Api from "../../Servico/APIservico";

function ListaColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradorSelecionadoModal, setColaboradorSelecionadoModal] = useState(null);
  const navigate = useNavigate();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const cardsPorPagina = 9;

  useEffect(() => {
    if (colaboradorSelecionadoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [colaboradorSelecionadoModal]);

  useEffect(() => {
    async function getColaboradores() {
      try {
        const response = await Api.get("/colaborador");
        setColaboradores(response.data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
    }
    getColaboradores();
  }, []);


  //  BACKEND SPRING BOOT 

  const handleDelete = async (matricula) => {
    if (window.confirm("Tem certeza que deseja excluir este colaborador?")) {
      try {
        await Api.delete(`/colaborador/${matricula}`);
        setColaboradores(colaboradores.filter((c) => c.matricula !== matricula));
        alert("Colaborador excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir colaborador:", error);
        alert("Erro ao excluir colaborador.");
      }
    }
  };


  const colaboradoresOrdenados = [...colaboradores].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

  const abrirModal = (colaborador) => setColaboradorSelecionadoModal(colaborador);
  const fecharModal = () => setColaboradorSelecionadoModal(null);

  // 🔹 Paginação
  const indexUltimoCard = paginaAtual * cardsPorPagina;
  const indexPrimeiroCard = indexUltimoCard - cardsPorPagina;
  const colaboradoresPaginaAtual = colaboradoresOrdenados.slice(indexPrimeiroCard, indexUltimoCard);
  const totalPaginas = Math.ceil(colaboradores.length / cardsPorPagina);

  const mudarPagina = (numero) => setPaginaAtual(numero);

  return (
    <div className="lista-wrapper">
      <div className="filtro-navbar">
        <h2 className="titulo-navbar">Lista de Colaboradores</h2>
      </div>

      <div className="lista-container">
        {colaboradoresPaginaAtual.map((colaborador) => (
          <div key={colaborador.matricula} className="card-colaborador">
            <h3>{colaborador.nome}</h3>
            <hr />
            <p><strong>Matrícula:</strong> {colaborador.matricula}</p>
            <p><strong>Nome:</strong> {colaborador.nome}</p>
            <p><strong>Email:</strong> {colaborador.email}</p>

            <div className="card-actions">
              <button className="btn-listar" onClick={() => abrirModal(colaborador)}>
                Lista de dados
              </button>

              <button
                className="btn-editar"
                onClick={() => navigate(`/editar-colaborador/${colaborador.matricula}`)}
              >
                Editar Dados
              </button>

              <button
                className="btn-excluir"
                onClick={() => handleDelete(colaborador.matricula)}
              >
                Excluir Colaborador
              </button>
            </div>
          </div>
        ))}
      </div>

      
      <div className="paginacao-container">
        <div className="paginacao">
          <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              className={paginaAtual === i + 1 ? "ativo" : ""}
              onClick={() => mudarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
            Próxima
          </button>
        </div>

        <button className="fechar" onClick={() => navigate("/")}>
          Fechar
        </button>
      </div>

    
      {colaboradorSelecionadoModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Dados do Colaborador</h2>
            <hr />
            <p><strong>Matrícula:</strong> {colaboradorSelecionadoModal.matricula}</p>
            <p><strong>Nome:</strong> {colaboradorSelecionadoModal.nome}</p>
            <p><strong>CPF:</strong> {colaboradorSelecionadoModal.cpf}</p>
            <p><strong>Email:</strong> {colaboradorSelecionadoModal.email}</p>
            <p><strong>RG:</strong> {colaboradorSelecionadoModal.rg}</p>
            <p><strong>Data Expedição RG:</strong> {colaboradorSelecionadoModal.dataExpedRg}</p>
            <p><strong>Data Nascimento:</strong> {colaboradorSelecionadoModal.dataNascimento}</p>
            <p><strong>Idade:</strong> {colaboradorSelecionadoModal.idade}</p>
            <p><strong>Área Instrução:</strong> {colaboradorSelecionadoModal.areaInstrucao}</p>
            <p><strong>Formação:</strong> {colaboradorSelecionadoModal.formacao}</p>
            <p><strong>Apelido:</strong> {colaboradorSelecionadoModal.apelido}</p>
            <p><strong>Rede Social:</strong> {colaboradorSelecionadoModal.redeSocial}</p>
            <p><strong>Telefone:</strong> {colaboradorSelecionadoModal.telefone}</p>

            <button className="btn-fechar-modal" onClick={fecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaColaboradores;


