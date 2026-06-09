import { useEffect, useState } from "react";
import api from "@/services/api";
import { Search, Download, Eye, ArrowLeft, CheckSquare, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface AlunoData {
  id: number;
  matricula: string;
  nome: string;
}

export default function Documentacao() {
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [filtro, setFiltro] = useState("");
  const [carregandoCracha, setCarregandoCracha] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const alunosPorPagina = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoData | null>(null);
  const [crachaUrl, setCrachaUrl] = useState("");
  const [selecionados, setSelecionados] = useState<AlunoData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const response = await api.get("/aluno");
        setAlunos(response.data || []);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      }
    };
    carregarAlunos();
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(alunosFiltrados.length / alunosPorPagina);
  const indiceUltimo = paginaAtual * alunosPorPagina;
  const indicePrimeiro = indiceUltimo - alunosPorPagina;
  const alunosExibidos = alunosFiltrados.slice(indicePrimeiro, indiceUltimo);

  const abrirModalCracha = async (aluno: AlunoData) => {
    setCarregandoCracha(true);
    setAlunoSelecionado(aluno);
    setModalOpen(true);

    try {
      const response = await api.get(`/aluno/${aluno.id}/cracha.png`, {
        responseType: "blob",
      });
      const urlLocal = window.URL.createObjectURL(new Blob([response.data]));
      setCrachaUrl(urlLocal);
    } catch (err) {
      alert("Erro ao carregar a prévia do crachá digital.");
      fecharModal();
    } finally {
      setCarregandoCracha(false);
    }
  };

  const fecharModal = () => {
    if (crachaUrl) window.URL.revokeObjectURL(crachaUrl);
    setModalOpen(false);
    setAlunoSelecionado(null);
    setCrachaUrl("");
    setCarregandoCracha(false);
  };

  const baixarCracha = async () => {
    if (!alunoSelecionado) return;
    try {
      const response = await api.get(`/aluno/${alunoSelecionado.id}/cracha.png`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cracha-${alunoSelecionado.nome}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao baixar o crachá.");
    }
  };

  const baixarSelecionados = async () => {
    if (selecionados.length === 0) {
      alert("Selecione alunos para baixar os crachás.");
      return;
    }

    setCarregandoCracha(true);
    for (const aluno of selecionados) {
      try {
        const response = await api.get(`/aluno/${aluno.id}/cracha.png`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cracha-${aluno.nome}.png`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (err) {
        console.error(`Erro no crachá de: ${aluno.nome}`);
      }
    }

    setCarregandoCracha(false);
    setSelecionados([]);
    alert("Downloads de crachá concluídos!");
  };

  const toggleSelecionado = (aluno: AlunoData) => {
    const existe = selecionados.find((a) => a.id === aluno.id);
    if (existe) {
      setSelecionados(selecionados.filter((a) => a.id !== aluno.id));
    } else {
      setSelecionados([...selecionados, aluno]);
    }
  };

  return (
    <div className="space-y-8 py-8">
      {/* Title */}
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Documentação / <span className="text-gradient-gold">Crachás</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Gere, visualize e faça download de crachás digitais para impressão.
          </p>
        </div>
      </div>

      <Card className="border-border/40 bg-card/40">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filtrar alunos por nome..."
                value={filtro}
                onChange={(e) => {
                  setFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="pl-10 rounded-full border-border/40 bg-card/60"
              />
            </div>

            {/* Batch Action */}
            <Button
              disabled={carregandoCracha || selecionados.length === 0}
              onClick={baixarSelecionados}
              className="rounded-full font-semibold shadow-gold shrink-0 w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {carregandoCracha ? "Baixando..." : `Baixar Selecionados (${selecionados.length})`}
            </Button>
          </div>

          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
            <Table>
              <TableHeader className="bg-card">
                <TableRow>
                  <TableHead className="w-16 text-center">Selecionar</TableHead>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-32">Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right w-40">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosExibidos.length > 0 ? (
                  alunosExibidos.map((aluno) => {
                    const isChecked = !!selecionados.find((s) => s.id === aluno.id);

                    return (
                      <TableRow key={aluno.id}>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleSelecionado(aluno)}
                            className="mx-auto"
                          />
                        </TableCell>
                        <TableCell className="font-bold">{aluno.id}</TableCell>
                        <TableCell>{aluno.matricula}</TableCell>
                        <TableCell className="font-semibold text-foreground">{aluno.nome}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirModalCracha(aluno)}
                            className="rounded-full text-xs font-semibold border-border hover:border-primary gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Visualizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum aluno encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="rounded-full"
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página <strong className="text-foreground">{paginaAtual}</strong> de {totalPaginas}
              </span>
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

        </CardContent>
      </Card>

      {/* BADGE PREVIEW MODAL OVERLAY */}
      {modalOpen && alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={fecharModal}>
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden flex flex-col p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="font-display text-xl font-bold text-foreground">Crachá: {alunoSelecionado.nome}</h3>
              <button onClick={fecharModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-background/40 p-4 rounded-xl border border-border/40 min-h-[300px]">
              {carregandoCracha ? (
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto" />
                  <p className="text-muted-foreground text-xs">Gerando crachá digital...</p>
                </div>
              ) : (
                crachaUrl && <img src={crachaUrl} alt="Cracha" className="max-w-[200px] h-auto object-contain shadow-md rounded-md" />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button variant="outline" onClick={fecharModal} className="rounded-full px-6">
                Fechar
              </Button>
              <Button onClick={baixarCracha} disabled={carregandoCracha} className="rounded-full px-6 shadow-gold">
                <Download className="h-4 w-4 mr-2" />
                Baixar Crachá
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
