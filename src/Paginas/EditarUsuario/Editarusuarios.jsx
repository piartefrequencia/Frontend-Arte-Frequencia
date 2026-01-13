import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../Servico/APIservico";
import "./Editarusuario.css";

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    
  });

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const resposta = await Api.get(`/usuario/${id}`);
      setFormData({
        usuario: resposta.data.usuario,
        email: resposta.data.email,
       
      });
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert("Erro ao carregar usuário.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        usuario: formData.usuario,
        email: formData.email,
      
      };

      await Api.put(`/usuario/${id}`, payload);

      alert("Usuário atualizado com sucesso!");
      navigate("/Listausuario");

    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  return (
    <div className="editar-container">
      <h2>Editar Usuário</h2>

      <form onSubmit={handleSalvar} className="form-editar">

        <label>Usuário:</label>
        <input
          type="text"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

      

        <div className="botoes">
          <button type="submit" className="btn-salvar">
            Atualizar
          </button>

          <button
            type="button"
            className="btn-voltar"
            onClick={() => navigate("/Listausuario")}
          >
            VOLTAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;
