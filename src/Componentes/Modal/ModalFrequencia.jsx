import { useEffect, useState } from "react";
import Api from "../../Servico/APIservico";
import GraficoFrequencia from "../Grafico/GraficoFrequencia";
import TabelaFrequencia from "../Tabela/TabelaFrequencia";
import "./ModalFrequencia.css";

export default function ModalFrequencia({ aluno, onClose }) {
  console.log("Modal renderizado");
  console.log(aluno);

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const anoAtual = new Date().getFullYear();

        const response = await Api.get(
          `/presenca/aluno/${aluno.id}?ano=${anoAtual}`
        );
        console.log("API retornou:");
        console.log(response.data);

        setDados(response.data);
      } catch (error) {
        console.error("Erro ao carregar frequência:", error);
      } finally {
        setLoading(false);
      }
    }

    if (aluno?.id) {
      carregarDados();
    }
  }, [aluno]);

  return (
    <div className="modal-frequencia">
      <div className="modal-frequencia-content">
        <h2>{aluno.nome}</h2>

        {loading ? (
          <p>Carregando frequência...</p>
        ) : (
          <>
            <GraficoFrequencia dados={dados} />
            <TabelaFrequencia dados={dados} />
          </>
        )}

        <button className="fechar" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}