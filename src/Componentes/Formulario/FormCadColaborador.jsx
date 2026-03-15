

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './FormCadastros.css'
import Api from "../../Servico/APIservico";

function FormCadColaborador() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '', cpf: '', rg: '', dataExpedRg: '', dataNascimento: '',
    idade: '', areaInstrucao: '', formacao: '', apelido: '',
    redeSocial: '', telefone: '', email: '', perfil: 'PROF',
  })

  const formatarData = (value) => {
    let v = value.replace(/\D/g, '')
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
    if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5, 9)
    return v.slice(0, 10)
  }

  const handleDataNascimento = (e) => {
    const dataFormatada = formatarData(e.target.value)
    setFormData(prev => ({ ...prev, dataNascimento: dataFormatada }))
  }

  const handleDataExpedRg = (e) => {
    const dataFormatada = formatarData(e.target.value)
    setFormData(prev => ({ ...prev, dataExpedRg: dataFormatada }))
  }

  useEffect(() => {
    const data = formData.dataNascimento
    const partes = data.split('/')
    if (partes.length === 3) {
      const [dd, mm, yyyy] = partes.map(Number)
      const nascimento = new Date(yyyy, mm - 1, dd)
      if (!isNaN(nascimento)) {
        const hoje = new Date()
        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const m = hoje.getMonth() - nascimento.getMonth()
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--
        setFormData(prev => ({ ...prev, idade: idade >= 0 ? idade : '' }))
      }
    }
  }, [formData.dataNascimento])

  const handleTelefone = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    }
    setFormData({ ...formData, telefone: value })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'cpf') return setFormData(prev => ({ ...prev, cpf: value.replace(/\D/g, '') }))
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
       if (loading) return;
          setLoading(true);
    try {
      const payload = { ...formData, idade: formData.idade ? Number(formData.idade) : null }
      const response = await Api.post('/colaborador', payload, { headers: { 'Content-Type': 'application/json' } })
      alert(response.data)
      navigate('/')
    } catch (error) {
      if (error.response) {
        if (typeof error.response.data === 'object') {
          const mensagens = Object.values(error.response.data).join('')
          alert('Erros de validação:' + mensagens)
        } else {
          alert('Erro: ' + error.response.data)
        }
      } else {
        alert('Erro na conexão com o servidor.')
      }
    }
     finally 
  { setLoading(false); }
};

  const handleVoltar = () => navigate('/')

  return (
    <div className="form-container">
      <h2>Cadastro de Colaborador</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome Completo:
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
        </label>

        <div className="linha">
          
          <label>CPF:
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </label>

          <label>RG:
            <input type="text" name="rg" value={formData.rg} onChange={handleChange} required />
          </label>

          <label>Data de Exp. RG:
            <input type="text" name="dataExpedRg" maxLength="10" placeholder="dd/mm/aaaa" value={formData.dataExpedRg} onChange={handleDataExpedRg} required />
          </label>
        
          <label>Data de Nascimento:
            <input type="text" name="dataNascimento" maxLength="10" placeholder="dd/mm/aaaa" value={formData.dataNascimento} onChange={handleDataNascimento} required />
          </label>

          <label>Idade:
            <input type="text" name="idade" value={formData.idade ? `${formData.idade} anos` : ''} readOnly />
          </label>

        </div>

        <div className="linha">

        <label>Área de Instrução:
          <input type="text" name="areaInstrucao" value={formData.areaInstrucao} onChange={handleChange} />
        </label>

        <label>Formação:
          <input type="text" name="formacao" value={formData.formacao} onChange={handleChange} required />
        </label>

         <label>Apelido:
            <input type="text" name="apelido" value={formData.apelido} onChange={handleChange} />
          </label>

          <label>Rede Social:
            <input type="text" name="redeSocial" value={formData.redeSocial} onChange={handleChange} />
          </label>

          <label>Telefone de Contato:
            <input type="text" name="telefone" maxLength="15" placeholder="(99) 99999-9999" value={formData.telefone} onChange={handleTelefone} required />
          </label>

      </div>

        <div className="linha">

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

         <label>Perfil:
            <select name="perfil" value={formData.perfil} onChange={handleChange} required>
              <option value="PROF">Professor</option>
              <option value="ESTAG">Estagiário</option>
            </select>
          </label>

          </div>

        <div className="botoes">
             <button type="submit"className="btn-salvar"disabled={loading}>
               {loading ? "Salvando Dados" : "SALVAR"}
          </button>
          <button type="button" className="btn-voltar" onClick={handleVoltar}>FECHAR</button>
        </div>
      </form>
    </div>
  )
}

export default FormCadColaborador;


