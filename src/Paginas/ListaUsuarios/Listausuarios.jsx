import React, { useEffect, useState } from "react";
import Api from "../../Servico/APIservico";
import { useNavigate } from "react-router-dom";
import "./Listausuarios.css";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const resposta = await Api.get("/usuario");
      setUsuarios(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Erro ao carregar usuários");
    }
  };

  const excluirUsuario = async (id) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await Api.delete(`/usuario/${id}`);
      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário");
    }
  };

  return (
    <div className="lista-container2">
      <h2>Lista de Usuários</h2>

      <div className="cards-container2">
        {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          usuarios.map((usuario) => (
            <div className="usuario-card1" key={usuario.id}>
              <p><strong>Matricula:</strong> {usuario.id}</p>
               <p><strong>Perfil:</strong> {usuario.perfil}</p>
              <p><strong>Usuário:</strong> {usuario.usuario}</p>
              <p><strong>Email:</strong> {usuario.email}</p>

              <div className="card-buttons">
                <button
                  className="btn-editar"
                  onClick={() => navigate(`/editar-usuario/${usuario.id}`)}
                >
                  Editar Usuário
                </button>

                <button
                  className="btn-excluir"
                  onClick={() => excluirUsuario(usuario.id)}
                >
                  Excluir Usuário
                </button>


              </div>
            </div>
          ))
        )}

      </div>
       <button className="botao-voltar" 
      onClick={() => navigate("/")}>CLIQUE AQUI PARA SAIR DA PAGINA
      </button>
    </div>

    
  );
}

export default ListaUsuarios;
