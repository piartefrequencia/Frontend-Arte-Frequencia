

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormCadastros.css';

import Api from "../../Servico/APIservico";


function FormCadColaborador() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '', cpf: '', rg: '', dataExpedRg: '', dataNascimento: '', 
    idade: '', areaInstrucao: '', formacao: '', apelido: '',
    redeSocial: '', telefone: '', email: '',
   
  });

 // 🔥 Função genérica para máscara de data
 const handleData = (e) => {
  const { value } = e.target;
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

  // Máscara para telefone com DDD
  const handleTelefone = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    setFormData({ ...formData, telefone: value });
  };

  // Manipuladores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
     // 💾 Submeter BACKEND SPRING BOOT 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post("/colaborador",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert(response.data);
      navigate("/"); 
    } catch (error) {
  if (error.response) {
  
    if (typeof error.response.data === "object") {
      const mensagens = Object.values(error.response.data).join("\n");
      alert("Erros de validação:\n" + mensagens);
    } else {
    
      alert("Erro: " + error.response.data);
    }
  } else {
    alert("Erro na conexão com o servidor.");
  }
 }
};

  const handleVoltar = () => {
    navigate("/"); 
  };

 return (
    <div className="form-container">
      <h2>Cadastro de Colaborador</h2>
      <form onSubmit={handleSubmit}>
      <label>Nome Completo:
          <input 
          type="text" 
          name="nome" 
          value={formData.nome} 
          onChange={handleChange} 
          required 
          />
        </label>
        <div className="linha">
          <label>CPF:
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </label>

          <label>RG:
            <input type="text" name="rg" value={formData.rg} onChange={handleChange} required />
          </label>
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
        </div>

        <div className="linha">
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

          <label>Idade:
            <input 
              type="text" 
              name="idade" 
              value={formData.idade ? `${formData.idade} anos` : ''} 
              readOnly 
            />
          </label>
        </div>

        <label>Área de Instrução:
          <input type="text" name="areaInstrucao" value={formData.areaInstrucao} onChange={handleChange}  />
        </label>

        <label>Formação:
          <input type="text" name="formacao" value={formData.formacao} onChange={handleChange} required />
        </label>

        <div className="linha">
          <label>Apelido:
            <input type="text" name="apelido" value={formData.apelido} onChange={handleChange} />
          </label>
        </div>

        <label>Rede Social:
          <input type="text" name="redeSocial" value={formData.redeSocial} onChange={handleChange} />
        </label>

        <label>Telefone de Contato:
          <input 
            type="text" name="telefone" maxLength="15" placeholder="(99) 99999-9999"
            value={formData.telefone} onChange={handleTelefone} required 
          />
        </label>

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <div className="botoes">
          <button type="submit" className="btn-salvar">SALVAR</button>
          <button type="button" className="btn-voltar" onClick={handleVoltar}>FECHAR</button>
        </div>
      </form>
    </div>
  );
}

export default FormCadColaborador;


