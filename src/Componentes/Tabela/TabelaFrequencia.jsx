

import "./TabelaFrequencia.css";

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

export default function TabelaFrequencia({ dados }) {
  if (!dados || !dados.meses) {
    return <p>Carregando frequência...</p>;
  }

  return (
    <div className="tabela-frequencia">
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Dias Presentes</th>
          </tr>
        </thead>

        <tbody>
          {dados.meses.map((mes) => (
            <tr key={mes.mes}>
              <td>{nomesMeses[mes.mes]}</td>

              <td>
                {mes.dias && mes.dias.length > 0
                  ? mes.dias.join(", ")
                  : "Sem registros"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}