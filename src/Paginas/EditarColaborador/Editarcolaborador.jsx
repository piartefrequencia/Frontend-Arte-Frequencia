

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../Servico/APIservico";
import "./Editarcolaborador.css";

function EditarColaborador() {
  const { matricula } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    dataExpedRg: "",
    orgaoExp: "",
    dataNascimento: "",
    idade: "",
    areaInstrucao: "",
    formacao: "",
    apelido: "",
    redeSocial: "",
    telefone: "",
    email: "",
  });

  // 🔥 Função genérica para máscara de data
 const handleData = (e) => {
  const { name, value } = e.target;
  let dataFormatada = value.replace(/\D/g, '');

  if (dataFormatada.length >= 2) {
    dataFormatada = dataFormatada.slice(0, 2) + '/' + dataFormatada.slice(2);
  }
  if (dataFormatada.length >= 5) {
    dataFormatada = dataFormatada.slice(0, 5) + '/' + dataFormatada.slice(5, 9);
  }

  setFormData({ 
    ...formData, 
    dataNascimento: dataFormatada,
    dataExpedRg: dataFormatada });
};



  // Função para calcular idade automaticamente
  useEffect(() => {
    const data = formData.dataNascimento;
    const partes = data.split('/');

    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // meses começam do zero
      const ano = parseInt(partes[2], 10);

      const hoje = new Date();
      const nascimento = new Date(ano, mes, dia);

      if (!isNaN(nascimento)) {
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }

        setFormData((prev) => ({ ...prev, idade: idade >= 0 ? idade : '' }));
      }
    }
  }, [formData.dataNascimento]);

  const [loading, setLoading] = useState(true);

  // 🔹 Buscar dados do colaborador ao carregar
  useEffect(() => {
    async function fetchColaborador() {
      try {
        const response = await Api.get(`/colaborador/${matricula}`);
        setFormData({
          ...response.data
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error);
        alert("Erro ao buscar colaborador.");
        navigate("/Listacolaborador");
      }
    }
    fetchColaborador();
  }, [matricula, navigate]);

  // 🔹 Atualizar estado do form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Enviar atualização
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`/colaborador/${matricula}`, formData);
      alert("Colaborador atualizado com sucesso!");
      navigate("/Listacolaborador");
    } catch (error) {
      console.error("Erro ao atualizar colaborador:", error);
      alert("Erro ao atualizar colaborador.");
    }
  };

  if (loading) return <p>Carregando dados do colaborador...</p>;

  return (
    <div className="form-container-editar">
      <h2>Editar Colaborador</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />

        <label>CPF:</label>
        <input name="cpf" value={formData.cpf} onChange={handleChange} required />

        <label>RG:</label>
        <input name="rg" value={formData.rg || ""} onChange={handleChange} />

        <label>Data de Exp. RG:
              <input 
                type="text" 
                name="dataExpedRg" 
                maxLength="10"
                placeholder="dd/mm/aaaa"
                value={formData.dataExpedRg}
                onChange={handleData}
                required 
              />
            </label>

<label>Data de Nascimento:
            <input 
              type="text" 
              name="dataNascimento" 
              maxLength="10"
              placeholder="dd/mm/aaaa"
              value={formData.dataNascimento}
              onChange={handleData}
              required 
            />
          </label>

        <label>Idade:</label>
        <input name="idade" type="number" value={formData.idade || ""} onChange={handleChange} />

        <label>Área Instrução:</label>
        <input name="areaInstrucao" value={formData.areaInstrucao || ""} onChange={handleChange} />

        <label>Formação:</label>
        <input name="formacao" value={formData.formacao || ""} onChange={handleChange} />

        <label>Apelido:</label>
        <input name="apelido" value={formData.apelido || ""} onChange={handleChange} />

        <label>Rede Social:</label>
        <input name="redeSocial" value={formData.redeSocial || ""} onChange={handleChange} />

        <label>Telefone:</label>
        <input name="telefone" value={formData.telefone || ""} onChange={handleChange} />

        <label>Email:</label>
        <input name="email" type="email" value={formData.email || ""} onChange={handleChange} />

        <div className="form-actions">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button
            type="button"
            className="btn-voltar"
            onClick={() => navigate("/Listacolaborador")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarColaborador;
