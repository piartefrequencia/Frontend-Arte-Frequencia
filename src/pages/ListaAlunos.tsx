import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { User, ShieldAlert, Heart, Calendar, GraduationCap, Phone, Mail, MapPin, X, Trash2, Edit2, FileSpreadsheet, Search } from "lucide-react"; // Adicionado Search aqui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const nomesOficinas: Record<string, string> = {
  musicalizacao: "Musicalização",
  praticaInstrumental: "Prática Instrumental",
  danca: "Dança",
  percussaoPopular: "Percussão Popular",
};

interface AlunoData {
  id: number;
  matricula: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  idade: number;
  filiacaoMae: string;
  telefoneMae: string;
  filiacaoPai: string;
  telefonePai: string;
  responsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  bairro: string;
  cidade: string;
  estado: string;
  escola: string;
  possuiDoenca: boolean;
  qualDoenca?: string;
  medicacao?: string;
  tipoSanguineo?: string;
  atividadesExtras: boolean;
  descricaoAtividadesExtras?: string;
  necessidadesEspeciais: boolean;
  descricaoNecessidadesEspeciais?: string;
  foto?: string;
  oficinas: string;
  oficina: string;
}

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState("Todas");
  const [busca, setBusca] = useState(""); // Novo estado para a pesquisa por nome
  const [alunoSelecionadoModal, setAlunoSelecionadoModal] = useState<AlunoData | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();
  const cardsPorPagina = 12;

  useEffect(() => {
    document.body.style.overflow = alunoSelecionadoModal ? "hidden" : "auto";
  }, [alunoSelecionadoModal]);

  const carregarAlunos = async () => {
    try {
      const response = await api.get("/aluno");
      const alunosFormatados = (response.data || []).map((aluno: any) => ({
        ...aluno,
        oficina: aluno.oficinas
          ? (() => {
              try {
                const oficinasObj = JSON.parse(aluno.oficinas);
                return Object.entries(oficinasObj)
                  .filter(([_, valor]) => valor === true)
                  .map(([chave]) => nomesOficinas[chave] || chave)
                  .join(", ");
              } catch {
                return "";
              }
            })()
          : "",
      }));
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const handleDelete = async (matricula: string) => {
    if (window.confirm("Tem certeza que deseja excluir este Aluno?")) {
      try {
        await api.delete(`/aluno/${matricula}`);
        setAlunos((prev) => prev.filter((a) => a.matricula !== matricula));
        alert("Aluno excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir Aluno:", error);
        alert("Erro ao excluir Aluno.");
      }
    }
  };

  const oficinas = ["Todas", ...new Set(alunos.map((aluno) => aluno.oficina).filter(Boolean))];

  // Filtro combinado: Oficina + Busca por Nome (Ignorando maiúsculas/minúsculas e acentos)
  const alunosFiltrados = alunos.filter((aluno) => {
    const correspondeOficina =
      oficinaSelecionada === "Todas" || aluno.oficina.includes(oficinaSelecionada);

    const nomeFormatado = aluno.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const buscaFormatada = busca
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const correspondeNome = nomeFormatado.includes(buscaFormatada);

    return correspondeOficina && correspondeNome;
  });

  const alunosOrdenados = [...alunosFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

  const indexUltimo = paginaAtual * cardsPorPagina;
  const indexPrimeiro = indexUltimo - cardsPorPagina;
  const alunosPaginaAtual = alunosOrdenados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(alunosOrdenados.length / cardsPorPagina);

  const mudarPagina = (numero: number) => setPaginaAtual(numero);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Alunos <span className="text-gradient-gold">Matriculados</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerenciamento e lista de chamada dos alunos matriculados nas oficinas.
        </p>
      </div>

      {/* Seção de Filtros: Oficinas + Barra de Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Workshop filter buttons */}
        <div className="flex flex-wrap gap-2">
          {oficinas.map((oficina) => (
            <Button
              key={oficina}
              variant={oficinaSelecionada === oficina ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setOficinaSelecionada(oficina);
                setPaginaAtual(1);
              }}
              className="rounded-full text-xs font-semibold"
            >
              {oficina}
            </Button>
          ))}
        </div>

        {/* Input de Pesquisa */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1); // Volta para a primeira página ao digitar
            }}
            className="w-full h-9 rounded-full border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Grid of students */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {alunosPaginaAtual.length > 0 ? (
          alunosPaginaAtual.map((aluno) => {
            const fotoUrl = aluno.foto
              ? aluno.foto.startsWith("data:image")
                ? aluno.foto
                : `data:image/jpeg;base64,${aluno.foto}`
              : null;

            return (
              <Card key={aluno.matricula} className="border-border/40 bg-card-gradient flex flex-col justify-between hover:border-primary/40 transition">
                <CardHeader className="p-5 flex flex-row items-center gap-4">
                  {fotoUrl ? (
                    <img src={fotoUrl} alt={aluno.nome} className="h-12 w-12 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-secondary-foreground font-semibold">
                      {aluno.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden leading-tight">
                    <h3 className="font-display text-base font-bold text-foreground truncate">{aluno.nome}</h3>
                    <p className="text-xs text-muted-foreground truncate">Matrícula: {aluno.matricula}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-2 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Oficinas:</strong> {aluno.oficina || "-"}</p>
                  <p><strong className="text-foreground">Idade:</strong> {aluno.idade ? `${aluno.idade} anos` : "-"}</p>
                  <p><strong className="text-foreground">Bairro:</strong> {aluno.bairro || "-"}</p>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-full border-border hover:border-primary"
                      onClick={() => setAlunoSelecionadoModal(aluno)}
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-primary" />
                      Dados
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-full border-border hover:border-primary"
                      onClick={() => navigate(`/editar-aluno/${aluno.matricula}`)}
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1 text-accent" />
                      Atualizar Dados
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full text-xs rounded-full"
                    onClick={() => handleDelete(aluno.matricula)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Excluir Aluno
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhum aluno encontrado para os filtros.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="rounded-full"
          >
            Anterior
          </Button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <Button
              key={i + 1}
              variant={paginaAtual === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => mudarPagina(i + 1)}
              className="rounded-full w-8 h-8 p-0"
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="rounded-full"
          >
            Próxima
          </Button>
        </div>
      )}

      {/* STUDENT DETAIL MODAL OVERLAY */}
      {alunoSelecionadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setAlunoSelecionadoModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl overflow-y-auto flex flex-col p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Ficha Cadastral do Aluno</h2>
              <button onClick={() => setAlunoSelecionadoModal(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Photo & Basic info inside modal */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {alunoSelecionadoModal.foto ? (
                <img
                  src={
                    alunoSelecionadoModal.foto.startsWith("data:image")
                      ? alunoSelecionadoModal.foto
                      : `data:image/jpeg;base64,${alunoSelecionadoModal.foto}`
                  }
                  alt={alunoSelecionadoModal.nome}
                  className="w-32 h-40 object-cover rounded-lg border border-border shadow-md"
                />
              ) : (
                <div className="w-32 h-40 rounded-lg border border-dashed border-border flex items-center justify-center bg-background/40 text-muted-foreground text-xs">
                  Sem Foto 3x4
                </div>
              )}
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-display text-xl font-bold text-foreground">{alunoSelecionadoModal.nome}</h3>
                <p className="text-sm text-muted-foreground"><strong>Matrícula:</strong> {alunoSelecionadoModal.matricula}</p>
                <p className="text-sm text-muted-foreground"><strong>Idade:</strong> {alunoSelecionadoModal.idade ? `${alunoSelecionadoModal.idade} anos` : "-"}</p>
                <p className="text-sm text-muted-foreground"><strong>Oficinas:</strong> {alunoSelecionadoModal.oficina || "-"}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 text-sm text-muted-foreground leading-relaxed">
              
              {/* Box 1 */}
              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <User className="h-4 w-4 text-primary" />
                  Documentação
                </h4>
                <p><strong>CPF:</strong> {alunoSelecionadoModal.cpf || "-"}</p>
                <p><strong>RG:</strong> {alunoSelecionadoModal.rg || "-"}</p>
                <p><strong>Tipo Sanguíneo:</strong> {alunoSelecionadoModal.tipoSanguineo || "-"}</p>
                <p><strong>Data de Nascimento:</strong> {alunoSelecionadoModal.dataNascimento || "-"}</p>
              </div>

              {/* Box 2 */}
              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  Endereço
                </h4>
                <p><strong>Estado:</strong> {alunoSelecionadoModal.estado || "-"}</p>
                <p><strong>Cidade:</strong> {alunoSelecionadoModal.cidade || "-"}</p>
                <p><strong>Bairro:</strong> {alunoSelecionadoModal.bairro || "-"}</p>
              </div>

              {/* Box 3 */}
              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20 md:col-span-2">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <Phone className="h-4 w-4 text-primary" />
                  Família e Contatos
                </h4>
                <p><strong>Mãe:</strong> {alunoSelecionadoModal.filiacaoMae || "-"} {alunoSelecionadoModal.telefoneMae && `(${alunoSelecionadoModal.telefoneMae})`}</p>
                <p><strong>Pai:</strong> {alunoSelecionadoModal.filiacaoPai || "-"} {alunoSelecionadoModal.telefonePai && `(${alunoSelecionadoModal.telefonePai})`}</p>
                <p><strong>Responsável:</strong> {alunoSelecionadoModal.responsavel || "-"} {alunoSelecionadoModal.telefoneResponsavel && `(${alunoSelecionadoModal.telefoneResponsavel})`}</p>
                <p><strong>E-mail Responsável:</strong> {alunoSelecionadoModal.emailResponsavel || "-"}</p>
              </div>

              {/* Box 4 */}
              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20 md:col-span-2">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  Escolaridade e Saúde
                </h4>
                <p><strong>Escola:</strong> {alunoSelecionadoModal.escola || "-"}</p>
                <p><strong>Doença Crônica:</strong> {alunoSelecionadoModal.possuiDoenca ? `Sim - ${alunoSelecionadoModal.qualDoenca || "-"}` : "Não"}</p>
                {alunoSelecionadoModal.possuiDoenca && <p><strong>Medicação:</strong> {alunoSelecionadoModal.medicacao || "-"}</p>}
                <p><strong>Atividades Extras:</strong> {alunoSelecionadoModal.atividadesExtras ? `Sim - ${alunoSelecionadoModal.descricaoAtividadesExtras || "-"}` : "Não"}</p>
                <p><strong>Necessidades Especiais:</strong> {alunoSelecionadoModal.necessidadesEspeciais ? `Sim - ${alunoSelecionadoModal.descricaoNecessidadesEspeciais || "-"}` : "Não"}</p>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button onClick={() => setAlunoSelecionadoModal(null)} className="rounded-full px-6">
                Fechar Ficha
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}