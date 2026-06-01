
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./GraficoFrequencia.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const nomesMeses = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function GraficoFrequencia({ dados }) {
  if (!dados || !dados.meses) {
    return <p>Carregando gráfico...</p>;
  }

  const data = {
    labels: dados.meses.map(
      (mes) => nomesMeses[mes.mes]
    ),

    datasets: [
      {
        label: "Presenças",
        data: dados.meses.map(
          (mes) => mes.dias.length
        ),
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
      },

      title: {
        display: true,
        text: "Quantidade de Presenças por Mês",
      },
    },
  };

  return (
    <div className="grafico-container">
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoFrequencia;