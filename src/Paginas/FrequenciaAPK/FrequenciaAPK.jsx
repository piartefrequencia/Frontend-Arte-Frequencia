
import { useState, useEffect } from "react";
import "./Frequencia.css";
import ModalFrequencia from "../../Componentes/Modal/ModalFrequencia";
import Api from "../../Servico/APIservico";

function FrequenciaAPK() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [filtroOficina, setFiltroOficina] = useState("");
  const [buscaNome, setBuscaNome] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const ITENS_POR_PAGINA = 20;

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await Api.get("/aluno");

        const alunosOrdenados = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR", {
            sensitivity: "base",
          })
        );

        setAlunos(alunosOrdenados);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    }

    carregarAlunos();
  }, []);

  function abrirModal(aluno) {
    setAlunoSelecionado(aluno);
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
    setAlunoSelecionado(null);
  }

  const oficinasDisponiveis = [
    ...new Set(
      alunos.flatMap((aluno) =>
        obterOficinasArray(aluno.oficinas)
      )
    ),
  ].sort((a, b) =>
    a.localeCompare(b, "pt-BR", {
      sensitivity: "base",
    })
  );

  const alunosFiltrados = alunos.filter((aluno) => {
    const oficinasAluno = obterOficinasArray(
      aluno.oficinas
    );

    const passaOficina =
      !filtroOficina ||
      oficinasAluno.includes(filtroOficina);

    const passaNome =
      aluno.nome
        ?.toLowerCase()
        .includes(buscaNome.toLowerCase());

    return passaOficina && passaNome;
  });

  const totalPaginas = Math.ceil(
    alunosFiltrados.length / ITENS_POR_PAGINA
  );

  const indiceInicial =
    (paginaAtual - 1) * ITENS_POR_PAGINA;

  const indiceFinal =
    indiceInicial + ITENS_POR_PAGINA;

  const alunosPaginados =
    alunosFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  return (
    <div className="container-frequencia">
      <h2 className="titulo-frequencia">
        Frequência dos Alunos Associação Pró-Cidadania
      </h2>

      <div className="filtros-container">
        <input
          type="text"
          className="input-busca"
          placeholder="Buscar aluno pelo nome..."
          value={buscaNome}
          onChange={(e) => {
            setBuscaNome(e.target.value);
            setPaginaAtual(1);
          }}
        />

        <select
          className="select-oficina"
          value={filtroOficina}
          onChange={(e) => {
            setFiltroOficina(e.target.value);
            setPaginaAtual(1);
          }}
        >
          <option value="">
            Todas as Oficinas
          </option>

          {oficinasDisponiveis.map((oficina) => (
            <option
              key={oficina}
              value={oficina}
            >
              {oficina}
            </option>
          ))}
        </select>
      </div>

      <div className="tabela-container">
        <div className="table-responsive">
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Oficinas</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {alunosPaginados.length > 0 ? (
                alunosPaginados.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{aluno.matricula}</td>
                    <td>{aluno.nome}</td>
                    <td>
                      {formatarOficinas(
                        aluno.oficinas
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-frequencia"
                        onClick={() =>
                          abrirModal(aluno)
                        }
                      >
                        Ver Frequência
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button
            disabled={paginaAtual === 1}
            onClick={() =>
              setPaginaAtual(
                paginaAtual - 1
              )
            }
          >
            Anterior
          </button>

          <span>
            Página {paginaAtual} de{" "}
            {totalPaginas}
          </span>

          <button
            disabled={
              paginaAtual === totalPaginas
            }
            onClick={() =>
              setPaginaAtual(
                paginaAtual + 1
              )
            }
          >
            Próxima
          </button>
        </div>
      )}

      {modalOpen && (
        <ModalFrequencia
          aluno={alunoSelecionado}
          onClose={fecharModal}
        />
      )}
    </div>
  );
}

function formatarOficinas(oficinas) {
  if (!oficinas) return "";

  try {
    const oficinasObj = JSON.parse(oficinas);
    return Object.keys(oficinasObj).join(", ");
  } catch {
    return oficinas;
  }
}

function obterOficinasArray(oficinas) {
  if (!oficinas) return [];

  try {
    const oficinasObj = JSON.parse(oficinas);
    return Object.keys(oficinasObj);
  } catch {
    return oficinas
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export default FrequenciaAPK;