
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../Servico/APIservico";
import "./Editaraluno.css";

function FormCadAlunoEdit() {
  
  const { matricula } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    dataExpedRg: "",
    orgaoExp: "",
    rn: "",
    dataNascimento: "",
    idade: "",
    filiacaoPai: "",
    telefonePai: "",
    filiacaoMae: "",
    telefoneMae: "",
    responsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    possuiDoenca: false,
    qualDoenca: "",
    medicacao: "",
    tipoSanguineo: "",
    escola: "",
    turma: "",
    turnoesc: "",
    autorizacaoImagem: false,
    atividadesExtras: false,
    descricaoAtividadesExtras: "",
    necessidadesEspeciais: false,
    descricaoNecessidadesEspeciais: "",
    oficinas: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Buscar aluno por matricula
  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const res = await Api.get(`/aluno/${matricula}`);
        const alunoFormatado = {
          ...res.data,
          oficinas: res.data.oficinas
            ? Object.keys(JSON.parse(res.data.oficinas)).join(", ")
            : "",
        };
        setFormData(alunoFormatado);
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        alert("Erro ao carregar dados do aluno.");
      } finally {
        setLoading(false);
      }
    };
    fetchAluno();
  }, [matricula]);

  // 🔹 Atualizar estado dos inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelefoneChange = (e) => {
    const { name, value } = e.target;
    const formatado = value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
    setFormData((prev) => ({ ...prev, [name]: formatado }));
  };

  // 🔹 Calcular idade
  useEffect(() => {
    if (formData.dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(formData.dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
      setFormData((prev) => ({ ...prev, idade }));
    }
  }, [formData.dataNascimento]);

  // 🔹 Submeter form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const enviarForm = {
        ...formData,
        oficinas: formData.oficinas
          ? JSON.stringify(
              formData.oficinas
                .split(",")
                .map((o) => o.trim())
                .reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
            )
          : "",
      };
      await Api.put(`/aluno/${matricula}`, enviarForm);
      alert("Aluno atualizado com sucesso!");
      navigate("/listaalunos");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      alert("Erro ao atualizar aluno.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="form-container-editar">
      <h2>Editar Aluno</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome Completo:
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </label>

        <div className="linha">
          <label>
            CPF:
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
          </label>
          <label>
            RG:
            <input
              type="text"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            Data Expedição RG:
            <input
              type="text"
              name="dataExpedRg"
              value={formData.dataExpedRg || ""}
              placeholder="dd/mm/aaaa"
              onChange={handleDateChange}
            />
          </label>
          <label>
            Órgão Expedidor:
            <input
              type="text"
              name="orgaoExp"
              value={formData.orgaoExp || ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            RN:
            <input
              type="text"
              name="rn"
              value={formData.rn}
              onChange={handleChange}
            />
          </label>
          <label>
            Data de Nascimento:
            <input
              type="text"
              name="dataNascimento"
              value={formData.dataNascimento || ""}
              onChange={handleDateChange}
            />
          </label>
          <label>
            Idade:
            <input type="number" value={formData.idade} readOnly />
          </label>
        </div>

        <div className="linha-filiacao">
          <label>
            Pai:
            <input
              type="text"
              name="filiacaoPai"
              value={formData.filiacaoPai}
              onChange={handleChange}
            />
          </label>
          <label>
            Telefone Pai:
            <input
              type="text"
              name="telefonePai"
              value={formData.telefonePai}
              onChange={handleTelefoneChange}
            />
          </label>
        </div>

        <div className="linha-filiacao">
          <label>
            Mãe:
            <input
              type="text"
              name="filiacaoMae"
              value={formData.filiacaoMae}
              onChange={handleChange}
            />
          </label>
          <label>
            Telefone Mãe:
            <input
              type="text"
              name="telefoneMae"
              value={formData.telefoneMae}
              onChange={handleTelefoneChange}
            />
          </label>
        </div>

        <label>
          Responsável:
          <input
            type="text"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
          />
        </label>
        <label>
          Telefone Responsável:
          <input
            type="text"
            name="telefoneResponsavel"
            value={formData.telefoneResponsavel}
            onChange={handleTelefoneChange}
          />
        </label>
        <label>
          Email Responsável:
          <input
            type="email"
            name="emailResponsavel"
            value={formData.emailResponsavel}
            onChange={handleChange}
          />
        </label>

        <div className="linha-radio">
          <label>
            Possui Doença:
            <input
              type="checkbox"
              name="possuiDoenca"
              checked={formData.possuiDoenca}
              onChange={handleChange}
            />
          </label>
        </div>
        {formData.possuiDoenca && (
          <>
            <label>
              Qual Doença:
              <input
                type="text"
                name="qualDoenca"
                value={formData.qualDoenca}
                onChange={handleChange}
              />
            </label>
            <label>
              Medicação:
              <input
                type="text"
                name="medicacao"
                value={formData.medicacao}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <label>
          Escola:
          <input
            type="text"
            name="escola"
            value={formData.escola}
            onChange={handleChange}
          />
        </label>

        <div className="linha">
          <label>
            Turma:
            <input
              type="text"
              name="turma"
              value={formData.turma}
              onChange={handleChange}
            />
          </label>
          <label>
            Turno:
            <input
              type="text"
              name="turnoesc"
              value={formData.turnoesc}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="linha-radio">
          <label>
            Autorização Imagem:
            <input
              type="checkbox"
              name="autorizacaoImagem"
              checked={formData.autorizacaoImagem}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="linha-radio">
          <label>
            Atividades Extras:
            <input
              type="checkbox"
              name="atividadesExtras"
              checked={formData.atividadesExtras}
              onChange={handleChange}
            />
          </label>
        </div>
        {formData.atividadesExtras && (
          <label>
            Descrição Atividades Extras:
            <input
              type="text"
              name="descricaoAtividadesExtras"
              value={formData.descricaoAtividadesExtras}
              onChange={handleChange}
            />
          </label>
        )}

        <div className="linha-radio">
          <label>
            Necessidades Especiais:
            <input
              type="checkbox"
              name="necessidadesEspeciais"
              checked={formData.necessidadesEspeciais}
              onChange={handleChange}
            />
          </label>
        </div>
        {formData.necessidadesEspeciais && (
          <label>
            Descrição Necessidades Especiais:
            <input
              type="text"
              name="descricaoNecessidadesEspeciais"
              value={formData.descricaoNecessidadesEspeciais}
              onChange={handleChange}
            />
          </label>
        )}

        <div className="botoes">
          <button type="submit" className="btn-salvar">
            ATUALIZAR
          </button>
          <button
            type="button"
            className="btn-voltar"
            onClick={() => navigate("/listaalunos")}
          >
            FECHAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCadAlunoEdit;
