import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadUser.css';
import Api from '../../Servico/APIservico';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function CadUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    usuario: '',
    senha: '',
    perfil: 'ADMIN'
  });

 
  const [showPassword, setShowPassword] = useState(false);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      const response = await Api.post("/usuario", formData);

      setMensagem("Usuário cadastrado com sucesso!");
      console.log("Usuário cadastrado:", response.data);

      setTimeout(() => navigate("/Listausuario"), 1200);

    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 409) {
        setErro("Já existe um usuário com esse e-mail.");
      } else {
        setErro("Erro ao cadastrar usuário.");
      }
    }
  };

  const handleFechar = () => {
    navigate("/");
  };

  return (
    <div className="usuario-container">
      <h2>Cadastro de Usuário</h2>

      {mensagem && <p className="msg-sucesso">{mensagem}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      <form onSubmit={handleSalvar}>

        <label1>Usuário:
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
          />
        </label1>

        <label1>Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label1>

       
        <label1>Senha:
          <div className="password-input-container"> 
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
       
            <span className="password-toggle-icon"
              onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

        </label1>

        <label1>Perfil:
          <select
            name="perfil"
            value={formData.perfil}
            onChange={handleChange}
            required
          >
            <option value="ADMIN">Administrador</option>
            <option value="ALUNO">Aluno</option>
            <option value="COLAB">Colaborador</option>
          </select>
        </label1>

        <div className="botoes">
          <button type="submit" className="btn-salvar">SALVAR</button>
          <button type="button" className="btn-voltar" onClick={handleFechar}>FECHAR</button>
        </div>
      </form>
    </div>
  );
}

export default CadUser;