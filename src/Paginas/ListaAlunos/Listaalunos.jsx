
import React, { useEffect, useState } from "react";
import "./Listaalunos.css";
import { useNavigate } from "react-router-dom";

import Api from "../../Servico/APIservico";


function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState("Todas");
  const [alunoSelecionadoModal, setAlunoSelecionadoModal] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();
  const cardsPorPagina = 12;

  // 🔹 Bloquear scroll quando modal aberto
  useEffect(() => {
    document.body.style.overflow = alunoSelecionadoModal ? "hidden" : "auto";
  }, [alunoSelecionadoModal]);

  // BACKEND SPRING BOOT
  useEffect(() => {
    async function getAlunos() {
      try {
        const response = await Api.get("/aluno");
        const alunosFormatados = response.data.map((aluno) => ({
          ...aluno,
          oficina: aluno.oficinas
            ? Object.keys(JSON.parse(aluno.oficinas)).join(", ")
            : "",
        }));
        setAlunos(alunosFormatados);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    }
    getAlunos();
  }, []);

  const handleDelete = async (matricula) => {
      if (window.confirm("Tem certeza que deseja excluir este Aluno?")) {
        try {
          await Api.delete(`/aluno/${matricula}`);
          setAlunos(alunos.filter((a) => a.matricula !== matricula));
          alert("Aluno excluído com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir Aluno:", error);
          alert("Erro ao excluir Aluno.");
        }
      }
    };
  

  const oficinas = ["Todas", ...new Set(alunos.map((aluno) => aluno.oficina))];

  const alunosFiltrados =
    oficinaSelecionada === "Todas"
      ? alunos
      : alunos.filter((aluno) => aluno.oficina === oficinaSelecionada);

  const alunosOrdenados = [...alunosFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

 // Paginação
  const indexUltimo = paginaAtual * cardsPorPagina;
  const indexPrimeiro = indexUltimo - cardsPorPagina;
  const alunosPaginaAtual = alunosOrdenados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(alunosOrdenados.length / cardsPorPagina);

  const mudarPagina = (numero) => setPaginaAtual(numero);

  const abrirModal = (aluno) => setAlunoSelecionadoModal(aluno);
  const fecharModal = () => setAlunoSelecionadoModal(null);

  return (
    <div>
      <div className="filtro-navbar1">
        <h2 className="titulo-navbar1">OFICINAS</h2>

        <div className="botoes-navbar">
          <button
            className="botao-voltar-galeria"
            onClick={() => navigate("/")}
          >
            SAIR DESSA PAGINA
          </button>

          {oficinas.map((oficina) => (
            <button
              key={oficina}
              className={oficinaSelecionada === oficina ? "active" : ""}
              onClick={() => {
                setOficinaSelecionada(oficina);
                setPaginaAtual(1); 
              }}
            >
              {oficina}
            </button>
          ))}
        </div>

      {/* Paginação */}
{totalPaginas > 1 && (
  <div className="paginacao">
    <button
      onClick={() => mudarPagina(paginaAtual - 1)}
      disabled={paginaAtual === 1}
    >
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

    <button
      onClick={() => mudarPagina(paginaAtual + 1)}
      disabled={paginaAtual === totalPaginas}
    >
      Próxima
    </button>
  </div>
)}


        {/* Lista de cards */}
        <div className="lista-container1">
          {alunosPaginaAtual.map((aluno) => (
            <div key={aluno.matricula} className="card-aluno">
              <h3>{aluno.nome}</h3>
              <hr />
              <p>
                <strong>Matrícula:</strong> {aluno.matricula}
              </p>

              {aluno.foto && (
                <img
                  src={
                    aluno.foto.startsWith("data:image")
                      ? aluno.foto
                      : `data:image/jpeg;base64,${aluno.foto}`
                  }
                  alt={`Foto de ${aluno.nome}`}
                  className="foto-aluno"
                />
              )}

              <p>
                <strong>Oficina:</strong> {aluno.oficina}
              </p>

              <div className="card-actions">
                <button className="btn-listar" onClick={() => abrirModal(aluno)}>
                  Lista de dados
                </button>

                <button
                  className="btn-editar"
                  onClick={() =>
                    navigate(`/editar-aluno/${aluno.matricula}`)
                  }
                >
                  Editar Dados
                </button>
              </div>

              <button
                className="btn-excluir"
                onClick={() => handleDelete(aluno.matricula)}
              >
                Excluir Aluno
              </button>
            </div>
          ))}
          
        </div>


        {/* Paginação abaixo */}
        <div className="paginacao">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={paginaAtual === num ? "pagina-atual" : ""}
              onClick={() => mudarPagina(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <button className="botao-voltar-galeria" onClick={() => navigate("/")}>
        SAIR DESSA PAGINA
      </button>

      {/* MODAL */}
      {alunoSelecionadoModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div
            className="modal-content1"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Dados do Aluno</h2>
            <hr />
            {alunoSelecionadoModal.foto && (
              <img
                src={
                  alunoSelecionadoModal.foto.startsWith("data:image")
                    ? alunoSelecionadoModal.foto
                    : `data:image/jpeg;base64,${alunoSelecionadoModal.foto}`
                }
                alt={`Foto de ${alunoSelecionadoModal.nome}`}
                className="foto-modal"
              />
            )}
            <h3>Informações do Aluno</h3>
            <p><strong>Matrícula:</strong> {alunoSelecionadoModal.matricula}</p>
            <p><strong>Nome:</strong> {alunoSelecionadoModal.nome}</p>
            <p><strong>CPF:</strong> {alunoSelecionadoModal.cpf}</p>
            <p><strong>RG:</strong> {alunoSelecionadoModal.rg}</p>
            <p><strong>Data Nascimento:</strong> {alunoSelecionadoModal.dataNascimento}</p>
            <p><strong>Idade:</strong> {alunoSelecionadoModal.idade}</p>
            <p><strong>Filiação Mãe:</strong> {alunoSelecionadoModal.filiacaoMae}</p>
            <p><strong>Telefone Mãe:</strong> {alunoSelecionadoModal.telefoneMae}</p>
            <p><strong>Filiação Pai:</strong> {alunoSelecionadoModal.filiacaoPai}</p>
            <p><strong>Telefone Pai:</strong> {alunoSelecionadoModal.telefonePai}</p>
            <p><strong>Tipo Sanguíneo:</strong> {alunoSelecionadoModal.tipoSanguineo}</p>
            <p><strong>Responsável:</strong> {alunoSelecionadoModal.responsavel}</p>
            <p><strong>Telefone Responsável:</strong> {alunoSelecionadoModal.telefoneResponsavel}</p>
            <p><strong>Email:</strong> {alunoSelecionadoModal.emailResponsavel}</p>

            <h3>Endereço</h3>
            <p><strong>Bairro:</strong> {alunoSelecionadoModal.bairro}</p>
            <p><strong>Cidade:</strong> {alunoSelecionadoModal.cidade}</p>
            <p><strong>Estado:</strong> {alunoSelecionadoModal.estado}</p>

            <h3>Outras Informações</h3>
            <p><strong>Escola:</strong> {alunoSelecionadoModal.escola}</p>
            <p><strong>Possui Doença:</strong> {alunoSelecionadoModal.possuiDoenca ? "Sim" : "Não"}</p>
            {alunoSelecionadoModal.possuiDoenca && (
              <>
                <p><strong>Qual:</strong> {alunoSelecionadoModal.qualDoenca}</p>
                <p><strong>Medicação:</strong> {alunoSelecionadoModal.medicacao}</p>
              </>
            )}
            <p><strong>Atividades Extras:</strong> {alunoSelecionadoModal.atividadesExtras ? "Sim" : "Não"}</p>
            {alunoSelecionadoModal.atividadesExtras && (
              <p><strong>Descrição:</strong> {alunoSelecionadoModal.descricaoAtividadesExtras}</p>
            )}
            <p><strong>Necessidades Especiais:</strong> {alunoSelecionadoModal.necessidadesEspeciais ? "Sim" : "Não"}</p>
            {alunoSelecionadoModal.necessidadesEspeciais && (
              <p><strong>Descrição:</strong> {alunoSelecionadoModal.descricaoNecessidadesEspeciais}</p>
            )}

            <button className="btn-fechar-modal" onClick={fecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaAlunos;
