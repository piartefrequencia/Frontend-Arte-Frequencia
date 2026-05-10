


import React, { useState, useEffect } from 'react';
import Api from "../../Servico/APIservico";
import './GestaoTelegram.css';
import { useNavigate } from "react-router-dom";

function GestaoTelegram() {

    const [alunos, setAlunos] = useState([]);
    const [busca, setBusca] = useState("");

    const [paginaAtual, setPaginaAtual] = useState(1);
    const alunosPorPagina = 20;
    const navigate = useNavigate();
  
    const BOT_USERNAME = "pro_cid_frequencia_bot";

    useEffect(() => {
        carregarAlunos();
    }, []);
    const carregarAlunos = async () => {
        try {
            const res = await Api.get("/aluno");
            setAlunos(res.data);
        } catch (err) {
            console.error("Erro ao carregar alunos:", err);
        }
    };
    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );
    
    const indiceUltimoAluno =
        paginaAtual * alunosPorPagina;
    const indicePrimeiroAluno =
        indiceUltimoAluno - alunosPorPagina;
    const alunosPaginados =
        alunosFiltrados.slice(indicePrimeiroAluno,
            indiceUltimoAluno);
    const totalPaginas = Math.ceil(
        alunosFiltrados.length / alunosPorPagina
    );
    
    const gerarLinkTelegram = (
        alunoId,
        tipoResponsavel
    ) => {const parametroStart =
            `${alunoId}_${tipoResponsavel}`;
        return `https://t.me/${BOT_USERNAME}?start=${parametroStart}`;
    };

return (
    <div className="gestao-container">
        <h2>Gestão de Notificações Telegram</h2>
        <p className="subtitulo">
            Clique no botão correspondente para abrir o Telegram
            e vincular o responsável ao aluno.
        </p>
    <div className="search-bar">
        <input type="text" placeholder="Buscar aluno por nome..."
            value={busca} onChange={(e) => {setBusca(e.target.value);
            setPaginaAtual(1);
        }}/>
    </div>
        <table className="alunos-table">
            <thead>
            <tr>
            <th>ID</th>
            <th>Matricula</th>
            <th>Nome do Aluno</th>
        <th className="acoes-header">
            Vincular Responsáveis via Telegram
        </th>
            </tr>
        </thead>
            <tbody>
            {alunosPaginados.length > 0 ? (
             alunosPaginados.map((aluno) => (
                <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.matricula}</td>
        <td className="aluno-nome">
            <strong>{aluno.nome}</strong>
            </td>
            <td>
    <div className="botoes-grupo">                              
        <a href={gerarLinkTelegram(aluno.id, "PAI")}
            target="_blank" rel="noopener noreferrer"
        className="btn-telegram btn-pai">📱 Vincular PAI
        </a>
        
        <a href={gerarLinkTelegram(aluno.id,"MAE")}
           target="_blank" rel="noopener noreferrer"
        className="btn-telegram btn-mae">📱 Vincular MÃE
        </a>

        <a href={gerarLinkTelegram( aluno.id, "RESPONSAVEL")}
           target="_blank" rel="noopener noreferrer"
        className="btn-telegram btn-resp">📱 Vincular RESP.
        </a>

    </div>
        </td>
        </tr>
    ))
) : (
        <tr>
            <td
            colSpan="4" style={{ textAlign: "center", padding: "20px"}}>
            Nenhum aluno encontrado.
            </td>
        </tr>
    )}
        </tbody>
    </table>
        {totalPaginas > 1 && (
    <div className="paginacao">
        <button className="btn-paginacao" onClick={() =>  setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}>⬅ Anterior
        </button>

        <span className="pagina-info">
            Página {paginaAtual} de {totalPaginas}
        </span>

        <button className="btn-paginacao" onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}>Próxima ➡
        </button>

    </div>
)}
    <button className="botao-voltar-galeria" onClick={() => navigate("/")}>
        SAIR DESSA PAGINA
    </button>

</div>
    );
}

export default GestaoTelegram;
