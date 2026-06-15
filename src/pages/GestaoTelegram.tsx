import { useState, useEffect } from "react";
import api from "@/services/api";
import { Send, Copy, Search, ArrowLeft, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface AlunoData {
  id: number;
  matricula: string;
  nome: string;
}

interface StatusResponsavel {
  PAI: boolean;
  MAE: boolean;
  RESPONSAVEL: boolean;
}

interface StatusGeral {
  [alunoId: number]: StatusResponsavel;
}

export default function GestaoTelegram() {
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [statusContatos, setStatusContatos] = useState<StatusGeral>({});
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const alunosPorPagina = 20;
  const navigate = useNavigate();

  const BOT_USERNAME = "pro_cid_frequencia_bot";

  const carregarAlunos = async () => {
    try {
      const res = await api.get("/aluno");
      const listaAlunos: AlunoData[] = res.data || [];
      setAlunos(listaAlunos);

      listaAlunos.forEach((aluno) => {
        buscarStatusTelegram(aluno.id);
      });
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    }
  };

  const buscarStatusTelegram = async (alunoId: number) => {
    try {
      const res = await api.get(`/status/${alunoId}`);
      setStatusContatos((prev) => ({
        ...prev,
        [alunoId]: res.data || { PAI: false, MAE: false, RESPONSAVEL: false },
      }));
    } catch (error) {
      console.error(`Erro ao buscar status do aluno ${alunoId}:`, error);
    }
  };

  const removerVinculoTelegram = async (alunoId: number, tipo: "PAI" | "MAE" | "RESPONSAVEL") => {
    // Mensagem de confirmação customizada conforme seu pedido
    if (!confirm("tem certeza que quer remover de receber as mensagens")) return;
    
    try {
      await api.delete(`/remover/${alunoId}/${tipo}`);
      buscarStatusTelegram(alunoId);
    } catch (error) {
      console.error("Erro ao remover vínculo:", error);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const indexUltimoAluno = paginaAtual * alunosPorPagina;
  const indexPrimeiroAluno = indexUltimoAluno - alunosPorPagina;
  const alunosPaginados = alunosFiltrados.slice(indexPrimeiroAluno, indexUltimoAluno);
  const totalPaginas = Math.ceil(alunosFiltrados.length / alunosPorPagina);

  const gerarLinkTelegram = (alunoId: number, tipoResponsavel: string) => {
    const parametroStart = `${alunoId}_${tipoResponsavel}`;
    return `https://t.me/${BOT_USERNAME}?start=${parametroStart}`;
  };

  const copiarLink = (alunoId: number, tipo: string) => {
    const link = gerarLinkTelegram(alunoId, tipo);
    const mensagemSucesso = "Link copiado! Você pode mandar para o WhatsApp do responsável para iniciar o protocolo de mensagens via Telegram.";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => alert(mensagemSucesso))
        .catch((err) => console.error("Erro ao copiar link:", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert(mensagemSucesso);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
      document.body.removeChild(textArea);
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
            Gestão de Notificações <span className="text-gradient-gold">Telegram</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Copie os links ou clique para abrir o bot e vincular os contatos dos responsáveis.
          </p>
        </div>
      </div>

      <Card className="border-border/40 bg-card/40">
        <CardHeader className="p-6">
          <CardTitle className="text-base font-semibold leading-relaxed">
            Selecione o responsável e clique em Vincular para abrir diretamente no Telegram ou no ícone de cópia 🟢💬 para enviar pelo WhatsApp.
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar aluno por nome..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="pl-10 rounded-full border-border/40 bg-card/60"
            />
          </div>

          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
            <Table>
              <TableHeader className="bg-card">
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-32">Matrícula</TableHead>
                  <TableHead>Nome do Aluno</TableHead>
                  {/* ADICIONADO: Nova coluna de status */}
                  <TableHead className="text-center w-64">Status das Mensagens</TableHead>
                  <TableHead className="text-right w-64">Vincular Responsáveis via Telegram</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosPaginados.length > 0 ? (
                  alunosPaginados.map((aluno) => {
                    const status = statusContatos[aluno.id] || { PAI: false, MAE: false, RESPONSAVEL: false };

                    return (
                      <TableRow key={aluno.id}>
                        <TableCell className="font-bold">{aluno.id}</TableCell>
                        <TableCell>{aluno.matricula}</TableCell>
                        <TableCell className="font-semibold text-foreground">{aluno.nome}</TableCell>
                        
                        {/* COLUNA 1: STATUS DO TELEGRAM E REMOÇÃO */}
                        <TableCell>
                          <div className="flex flex-col items-center gap-2 py-2">
                            
                            {/* Status Pai */}
                            <div className={`inline-flex items-center justify-between rounded-full border h-8 w-56 px-3 text-xs font-semibold ${status.PAI ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                              <span>Pai: {status.PAI ? " Ativo" : " Inativo"}</span>
                              {status.PAI && (
                                <button
                                  onClick={() => removerVinculoTelegram(aluno.id, "PAI")}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                                  title="Remover recebimento de mensagens"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Status Mãe */}
                            <div className={`inline-flex items-center justify-between rounded-full border h-8 w-56 px-3 text-xs font-semibold ${status.MAE ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                              <span>Mãe: {status.MAE ? " Ativo" : " Inativo"}</span>
                              {status.MAE && (
                                <button
                                  onClick={() => removerVinculoTelegram(aluno.id, "MAE")}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                                  title="Remover recebimento de mensagens"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Status Responsável */}
                            <div className={`inline-flex items-center justify-between rounded-full border h-8 w-56 px-3 text-xs font-semibold ${status.RESPONSAVEL ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                              <span>Responsável: {status.RESPONSAVEL ? " Ativo" : " Inativo"}</span>
                              {status.RESPONSAVEL && (
                                <button
                                  onClick={() => removerVinculoTelegram(aluno.id, "RESPONSAVEL")}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                                  title="Remover recebimento de mensagens"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>

                          </div>
                        </TableCell>

                        {/* COLUNA 2: BOTÕES COLORIDOS DE VINCULAR */}
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-2 py-2">
                            
                            {/* PAI (Azul) */}
                            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 overflow-hidden h-8 w-56 justify-between">
                              <a
                               
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 text-xs font-semibold text-blue-300/90 hover:text-blue-200 transition flex-1 text-left"
                              >
                                Pai Telegram
                              </a>
                              <button
                                onClick={() => copiarLink(aluno.id, "PAI")}
                                className="h-full px-2 border-l border-blue-500/30 hover:bg-blue-500/20 transition cursor-pointer text-xs"
                                title="Copiar link do Pai"
                              >
                                🟢💬
                              </button>
                            </div>

                            {/* MAE (Rosa/Pink) */}
                            <div className="inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 overflow-hidden h-8 w-56 justify-between">
                              <a
                      
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 text-xs font-semibold text-pink-300/90 hover:text-pink-200 transition flex-1 text-left"
                              >
                                Mãe Telegram
                              </a>
                              <button
                                onClick={() => copiarLink(aluno.id, "MAE")}
                                className="h-full px-2 border-l border-pink-500/30 hover:bg-pink-500/20 transition cursor-pointer text-xs"
                                title="Copiar link da Mãe"
                              >
                                🟢💬
                              </button>
                            </div>

                            {/* RESPONSAVEL (Amarelo/Amber) */}
                            <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 overflow-hidden h-8 w-56 justify-between">
                              <a
                             
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 text-xs font-semibold text-amber-300/90 hover:text-amber-200 transition flex-1 text-left"
                              >
                                Responsável Telegram
                              </a>
                              <button
                                onClick={() => copiarLink(aluno.id, "RESPONSAVEL")}
                                className="h-full px-2 border-l border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer text-xs"
                                title="Copiar link do Responsável"
                              >
                                🟢💬
                              </button>
                            </div>

                          </div>
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
    </div>
  );
}