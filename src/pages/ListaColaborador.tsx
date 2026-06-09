import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { User, Phone, Mail, MapPin, X, Trash2, Edit2, FileSpreadsheet, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface ColaboradorData {
  matricula: string;
  nome: string;
  cpf: string;
  email: string;
  rg: string;
  dataExpedRg: string;
  dataNascimento: string;
  idade: number;
  areaInstrucao: string;
  formacao: string;
  apelido: string;
  redeSocial: string;
  telefone: string;
  perfil: string;
}

export default function ListaColaborador() {
  const [colaboradores, setColaboradores] = useState<ColaboradorData[]>([]);
  const [colaboradorSelecionadoModal, setColaboradorSelecionadoModal] = useState<ColaboradorData | null>(null);
  const navigate = useNavigate();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const cardsPorPagina = 12;

  useEffect(() => {
    document.body.style.overflow = colaboradorSelecionadoModal ? "hidden" : "auto";
  }, [colaboradorSelecionadoModal]);

  const carregarColaboradores = async () => {
    try {
      const response = await api.get("/colaborador");
      setColaboradores(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };

  useEffect(() => {
    carregarColaboradores();
  }, []);

  const handleDelete = async (matricula: string) => {
    if (window.confirm("Tem certeza que deseja excluir este colaborador?")) {
      try {
        await api.delete(`/colaborador/${matricula}`);
        setColaboradores((prev) => prev.filter((c) => c.matricula !== matricula));
        alert("Colaborador excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir colaborador:", error);
        alert("Erro ao excluir colaborador.");
      }
    }
  };

  const colaboradoresOrdenados = [...colaboradores].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
  );

  const indexUltimoCard = paginaAtual * cardsPorPagina;
  const indexPrimeiroCard = indexUltimoCard - cardsPorPagina;
  const colaboradoresPaginaAtual = colaboradoresOrdenados.slice(indexPrimeiroCard, indexUltimoCard);
  const totalPaginas = Math.ceil(colaboradores.length / cardsPorPagina);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Educadores e <span className="text-gradient-gold">Colaboradores</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie o cadastro de professores e estagiários da Associação Pró-Cidadania.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {colaboradoresPaginaAtual.length > 0 ? (
          colaboradoresPaginaAtual.map((colab) => (
            <Card key={colab.matricula} className="border-border/40 bg-card-gradient flex flex-col justify-between hover:border-primary/40 transition">
              <CardHeader className="p-5 flex flex-row items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground font-semibold">
                  {colab.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div className="overflow-hidden leading-tight">
                  <h3 className="font-display text-base font-bold text-foreground truncate">{colab.nome}</h3>
                  <p className="text-xs text-muted-foreground truncate">Matrícula: {colab.matricula}</p>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Função:</strong> {colab.perfil === "PROF" ? "Professor" : "Estagiário"}</p>
                <p><strong className="text-foreground">Área:</strong> {colab.areaInstrucao || "-"}</p>
                <p><strong className="text-foreground">Formação:</strong> {colab.formacao || "-"}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs rounded-full border-border hover:border-primary"
                    onClick={() => setColaboradorSelecionadoModal(colab)}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-primary" />
                    Dados
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs rounded-full border-border hover:border-primary"
                    onClick={() => navigate(`/editar-colaborador/${colab.matricula}`)}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1 text-accent" />
                    Editar
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full text-xs rounded-full"
                  onClick={() => handleDelete(colab.matricula)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Excluir Educador
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhum educador cadastrado.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setPaginaAtual(i + 1)}
              className="rounded-full w-8 h-8 p-0"
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="rounded-full"
          >
            Próxima
          </Button>
        </div>
      )}

      {/* MODAL */}
      {colaboradorSelecionadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setColaboradorSelecionadoModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl overflow-y-auto flex flex-col p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Ficha Cadastral do Colaborador</h2>
              <button onClick={() => setColaboradorSelecionadoModal(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground font-display text-2xl font-bold">
                {colaboradorSelecionadoModal.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{colaboradorSelecionadoModal.nome}</h3>
                <p className="text-sm text-muted-foreground"><strong>Matrícula:</strong> {colaboradorSelecionadoModal.matricula}</p>
                <p className="text-sm text-muted-foreground"><strong>Perfil:</strong> {colaboradorSelecionadoModal.perfil === "PROF" ? "Professor" : "Estagiário"}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 text-sm text-muted-foreground leading-relaxed">
              
              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <User className="h-4 w-4 text-primary" />
                  Identificação
                </h4>
                <p><strong>CPF:</strong> {colaboradorSelecionadoModal.cpf || "-"}</p>
                <p><strong>RG:</strong> {colaboradorSelecionadoModal.rg || "-"}</p>
                <p><strong>Data de Expedição RG:</strong> {colaboradorSelecionadoModal.dataExpedRg || "-"}</p>
                <p><strong>Apelido:</strong> {colaboradorSelecionadoModal.apelido || "-"}</p>
                <p><strong>Nascimento:</strong> {colaboradorSelecionadoModal.dataNascimento || "-"} ({colaboradorSelecionadoModal.idade ? `${colaboradorSelecionadoModal.idade} anos` : "-"})</p>
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <Briefcase className="h-4 w-4 text-accent" />
                  Área de Atuação
                </h4>
                <p><strong>Área Instrução:</strong> {colaboradorSelecionadoModal.areaInstrucao || "-"}</p>
                <p><strong>Formação:</strong> {colaboradorSelecionadoModal.formacao || "-"}</p>
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-border/40 bg-background/20 md:col-span-2">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                  <Phone className="h-4 w-4 text-primary" />
                  Contatos e Redes Sociais
                </h4>
                <p><strong>Telefone:</strong> {colaboradorSelecionadoModal.telefone || "-"}</p>
                <p><strong>Email:</strong> {colaboradorSelecionadoModal.email || "-"}</p>
                <p><strong>Rede Social:</strong> {colaboradorSelecionadoModal.redeSocial || "-"}</p>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button onClick={() => setColaboradorSelecionadoModal(null)} className="rounded-full px-6">
                Fechar Ficha
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
