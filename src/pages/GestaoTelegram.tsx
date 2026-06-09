import { useState, useEffect } from "react";
import api from "@/services/api";
import { Send, Copy, Search, ArrowLeft } from "lucide-react";
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

export default function GestaoTelegram() {
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const alunosPorPagina = 20;
  const navigate = useNavigate();

  const BOT_USERNAME = "pro_cid_frequencia_bot";

  const carregarAlunos = async () => {
    try {
      const res = await api.get("/aluno");
      setAlunos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
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
                  <TableHead className="text-right">Vincular Responsáveis via Telegram</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosPaginados.length > 0 ? (
                  alunosPaginados.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-bold">{aluno.id}</TableCell>
                      <TableCell>{aluno.matricula}</TableCell>
                      <TableCell className="font-semibold text-foreground">{aluno.nome}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          
                          {/* PAI */}
                          <div className="inline-flex items-center rounded-full border border-border bg-background overflow-hidden h-8">
                            <a
                              href={gerarLinkTelegram(aluno.id, "PAI")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                            >
                              Pai
                            </a>
                            <button
                              onClick={() => copiarLink(aluno.id, "PAI")}
                              className="h-full px-2 border-l border-border hover:bg-primary/10 transition cursor-pointer text-xs"
                              title="Copiar link do Pai"
                            >
                              🟢💬
                            </button>
                          </div>

                          {/* MAE */}
                          <div className="inline-flex items-center rounded-full border border-border bg-background overflow-hidden h-8">
                            <a
                              href={gerarLinkTelegram(aluno.id, "MAE")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                            >
                              Mãe
                            </a>
                            <button
                              onClick={() => copiarLink(aluno.id, "MAE")}
                              className="h-full px-2 border-l border-border hover:bg-primary/10 transition cursor-pointer text-xs"
                              title="Copiar link da Mãe"
                            >
                              🟢💬
                            </button>
                          </div>

                          {/* RESPONSAVEL */}
                          <div className="inline-flex items-center rounded-full border border-border bg-background overflow-hidden h-8">
                            <a
                              href={gerarLinkTelegram(aluno.id, "RESPONSAVEL")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                            >
                              Responsável
                            </a>
                            <button
                              onClick={() => copiarLink(aluno.id, "RESPONSAVEL")}
                              className="h-full px-2 border-l border-border hover:bg-primary/10 transition cursor-pointer text-xs"
                              title="Copiar link do Responsável"
                            >
                              🟢💬
                            </button>
                          </div>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
