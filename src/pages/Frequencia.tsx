import { useState, useEffect } from "react";
import api from "@/services/api";
import { Search, ArrowLeft, BarChart2, CalendarDays, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Imports necessários para a geração do PDF institucional
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

const nomesOficinas: Record<string, string> = {
  musicalizacao: "Musicalização",
  praticaInstrumental: "Prática Instrumental",
  danca: "Dança",
  percussaoPopular: "Percussão Popular",
};

const nomesMeses = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface AlunoData {
  id: number;
  matricula: string;
  nome: string;
  oficinas: string;
}

interface PresencaMes {
  mes: number;
  dias: number[];
}

interface PresencaResponse {
  meses: PresencaMes[];
}

// Sub-componente interno para buscar dados de um aluno específico de forma isolada e gerar o PDF na linha
function BotaoLinhaPDF({ aluno }: { aluno: AlunoData }) {
  const [dados, setDados] = useState<PresencaResponse | null>(null);
  const [carregando, setCarregando] = useState(false);

  function obterOficinasTexto(oficinasRaw: string) {
    if (!oficinasRaw) return "";
    try {
      const oficinasObj = JSON.parse(oficinasRaw);
      return Object.keys(oficinasObj).map((key) => nomesOficinas[key] || key).join(", ");
    } catch {
      return oficinasRaw.split(",").map((item) => item.trim()).filter(Boolean).join(", ");
    }
  }

  const buscarDadosEPresentar = async () => {
    if (dados) return; // Se já tiver os dados carregados, não busca de novo
    try {
      setCarregando(true);
      const anoAtual = new Date().getFullYear();
      const response = await api.get(`/presenca/aluno/${aluno.id}?ano=${anoAtual}`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados para PDF em lote:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div onMouseEnter={buscarDadosEPresentar} onClick={buscarDadosEPresentar}>
      <PDFDownloadLink
        document={
          <DocumentoFrequenciaPDF
            aluno={aluno}
            dadosFrequencia={dados}
            oficinasTexto={obterOficinasTexto(aluno.oficinas)}
          />
        }
        fileName={`Frequencia_${aluno.nome.trim().replace(/\s+/g, "_")}.pdf`}
      >
        {/* @ts-ignore */}
        {({ loading }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={loading || carregando}
            className="rounded-full text-xs font-semibold gap-1.5 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-foreground transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            {loading || carregando ? "Preparando..." : "Baixar PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}

// ============================================================================
// COMPONENTE DO ARQUIVO PDF (ESTRUTURAÇÃO FORMAL INSTITUCIONAL)
// ============================================================================
const pdfStyles = StyleSheet.create({
  page: {
    padding: 45,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#222222",
    lineHeight: 1.6,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#c5a059", 
    paddingBottom: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  institutionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111111",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  docType: {
    fontSize: 9,
    color: "#666666",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 22,
    textTransform: "uppercase",
    color: "#111111",
  },
  studentInfoBox: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 6,
    padding: 14,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    width: 95,
    fontWeight: "bold",
    color: "#555555",
  },
  infoValue: {
    flex: 1,
    color: "#111111",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#c5a059",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 4,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 28,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
  },
  colMonth: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#e5e5e5",
  },
  colDays: {
    width: "70%",
  },
  footer: {
    position: "absolute",
    bottom: 35,
    left: 45,
    right: 45,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
    textAlign: "center",
    fontSize: 8,
    color: "#888888",
  },
});

interface PDFProps {
  aluno: AlunoData;
  dadosFrequencia: PresencaResponse | null;
  oficinasTexto: string;
}

function DocumentoFrequenciaPDF({ aluno, dadosFrequencia, oficinasTexto }: PDFProps) {
  const anoAtual = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Cabeçalho Oficial */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.institutionName}>Associação Pró-Cidadania</Text>
          <Text style={pdfStyles.docType}>Registro de Frequência e Acompanhamento de Oficinas</Text>
        </View>

        {/* Título de Documentação */}
        <Text style={pdfStyles.title}>Relatório de Frequência Individual — Ano Letivo {anoAtual}</Text>

        {/* Quadro de Informações do Aluno */}
        <View style={pdfStyles.studentInfoBox}>
          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Nome do Aluno:</Text>
            <Text style={pdfStyles.infoValue}>{aluno.nome}</Text>
          </View>
          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Nº Matrícula:</Text>
            <Text style={pdfStyles.infoValue}>{aluno.matricula || "Não informada"}</Text>
          </View>
          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Oficina(s):</Text>
            <Text style={pdfStyles.infoValue}>{oficinasTexto}</Text>
          </View>
        </View>

        {/* Histórico Analítico */}
        <Text style={pdfStyles.sectionTitle}>Histórico de Chamadas por Período Mensal</Text>
        
        <View style={pdfStyles.table}>
          {/* Header da Tabela */}
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <View style={pdfStyles.colMonth}>
              <Text style={pdfStyles.tableCellHeader}>Mês de Referência</Text>
            </View>
            <View style={pdfStyles.colDays}>
              <Text style={pdfStyles.tableCellHeader}>Dias de Presença Confirmada</Text>
            </View>
          </View>

          {/* Registros de Chamada */}
          {dadosFrequencia?.meses && dadosFrequencia.meses.length > 0 ? (
            dadosFrequencia.meses.map((mes) => (
              <View style={pdfStyles.tableRow} key={mes.mes}>
                <View style={pdfStyles.colMonth}>
                  <Text style={pdfStyles.tableCell}>{nomesMeses[mes.mes]}</Text>
                </View>
                <View style={pdfStyles.colDays}>
                  <Text style={pdfStyles.tableCell}>
                    {mes.dias && mes.dias.length > 0 ? mes.dias.join(", ") : "Sem registros de presença"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={pdfStyles.tableRow}>
              <View style={{ width: "100%", padding: 12 }}>
                <Text style={{ textAlign: "center", color: "#666", fontSize: 10 }}>Nenhum registro encontrado no sistema.</Text>
              </View>
            </View>
          )}
        </View>

        {/* Rodapé de autenticação */}
        <Text style={pdfStyles.footer}>
          Documento institucional oficial emitido via sistema em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")} | Associação Pró-Cidadania
        </Text>
      </Page>
    </Document>
  );
}

// ============================================================================
// COMPONENTE SUB-ELEMENTO: GRAFICO
// ============================================================================
function GraficoFrequencia({ dados }: { dados: PresencaResponse | null }) {
  if (!dados || !dados.meses) {
    return <p className="text-center text-xs text-muted-foreground py-4">Sem dados para o gráfico.</p>;
  }

  const data = {
    labels: dados.meses.map((mes) => nomesMeses[mes.mes]),
    datasets: [
      {
        label: "Presenças",
        data: dados.meses.map((mes) => mes.dias?.length || 0),
        backgroundColor: "rgba(197, 160, 89, 0.45)",
        borderColor: "rgb(197, 160, 89)",
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      title: {
        display: true,
        text: "Quantidade de Presenças por Mês",
        color: "#fff",
        font: {
          size: 14,
          family: "Fraunces",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-background/20 p-4 rounded-xl border border-border/40">
      <Bar data={data} options={options} />
    </div>
  );
}

// ============================================================================
// COMPONENTE SUB-ELEMENTO: TABELA
// ============================================================================
function TabelaFrequencia({ dados }: { dados: PresencaResponse | null }) {
  if (!dados || !dados.meses) {
    return <p className="text-center text-xs text-muted-foreground py-4">Sem registros de chamada.</p>;
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
      <Table>
        <TableHeader className="bg-card">
          <TableRow>
            <TableHead>Mês</TableHead>
            <TableHead>Dias Presentes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.meses.map((mes) => (
            <TableRow key={mes.mes}>
              <TableCell className="font-semibold text-foreground">{nomesMeses[mes.mes]}</TableCell>
              <TableCell className="text-xs">
                {mes.dias && mes.dias.length > 0 ? mes.dias.join(", ") : "Sem registros"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function Frequencia() {
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [filtroOficina, setFiltroOficina] = useState("");
  const [buscaNome, setBuscaNome] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [dadosFrequencia, setDadosFrequencia] = useState<PresencaResponse | null>(null);
  const [loadingFrequencia, setLoadingFrequencia] = useState(false);

  const ITENS_POR_PAGINA = 20;
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await api.get("/aluno");
        const alunosOrdenados = (response.data || []).sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
        );
        setAlunos(alunosOrdenados);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    }
    carregarAlunos();
  }, []);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoSelecionado) return;
      try {
        setLoadingFrequencia(true);
        const anoAtual = new Date().getFullYear();
        const response = await api.get(`/presenca/aluno/${alunoSelecionado.id}?ano=${anoAtual}`);
        setDadosFrequencia(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados de presença:", error);
      } finally {
        setLoadingFrequencia(false);
      }
    }
    if (modalOpen && alunoSelecionado) {
      carregarDados();
    }
  }, [modalOpen, alunoSelecionado]);

  function obterOficinasArray(oficinas: string) {
    if (!oficinas) return [];
    try {
      const oficinasObj = JSON.parse(oficinas);
      return Object.keys(oficinasObj);
    } catch {
      return oficinas.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  const oficinasDisponiveis = [
    ...new Set(alunos.flatMap((aluno) => obterOficinasArray(aluno.oficinas))),
  ].sort((a, b) => {
    const nomeA = nomesOficinas[a] || a;
    const nomeB = nomesOficinas[b] || b;
    return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
  });

  const alunosFiltrados = alunos.filter((aluno) => {
    const oficinasAluno = obterOficinasArray(aluno.oficinas);
    const passaOficina = !filtroOficina || filtroOficina === "all" || oficinasAluno.includes(filtroOficina);
    const passaNome = aluno.nome?.toLowerCase().includes(buscaNome.toLowerCase());
    return passaOficina && passaNome;
  });

  const totalPaginas = Math.ceil(alunosFiltrados.length / ITENS_POR_PAGINA);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const indiceFinal = indiceInicial + ITENS_POR_PAGINA;
  const alunosPaginados = alunosFiltrados.slice(indiceInicial, indiceFinal);

  function renderizarBadgesOficinas(oficinasRaw: string) {
    const listaChaves = obterOficinasArray(oficinasRaw);
    
    if (listaChaves.length === 0) {
      return <span className="text-[#bbb] italic text-xs">Nenhuma</span>;
    }

    const estilosCustomizados: Record<string, string> = {
      musicalizacao: "bg-[#4361ee]/15 text-[#4361ee] border-[#4361ee]/40",
      praticaInstrumental: "bg-[#2ec4b6]/15 text-[#2ec4b6] border-[#2ec4b6]/40",
      danca: "bg-[#ff006e]/15 text-[#ff006e] border-[#ff006e]/40",
      percussaoPopular: "bg-[#f77f00]/15 text-[#f77f00] border-[#f77f00]/40",
    };

    return (
      <div className="flex flex-wrap gap-[6px] max-w-[300px]">
        {listaChaves.map((chave) => {
          const nomeAmigavel = nomesOficinas[chave] || chave;
          const estiloBadge = estilosCustomizados[chave] || "bg-muted/30 text-muted-foreground border-muted-foreground/30";

          return (
            <span
              key={chave}
              className={`inline-block px-[10px] py-[3px] rounded-[16px] text-[0.8rem] font-semibold border backdrop-blur-[2px] whitespace-nowrap tracking-wide transition-all ${estiloBadge}`}
            >
              {nomeAmigavel}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Title */}
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Frequência dos <span className="text-gradient-gold">Alunos</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualize o histórico de presenças e relatórios mensais dos alunos.
          </p>
        </div>
      </div>

      <Card className="border-border/40 bg-card/40">
        <CardContent className="p-6 space-y-6">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar aluno pelo nome..."
                value={buscaNome}
                onChange={(e) => {
                  setBuscaNome(e.target.value);
                  setPaginaAtual(1);
                }}
                className="pl-10 rounded-full border-border/40 bg-card/60"
              />
            </div>

            <Select value={filtroOficina} onValueChange={(val) => { setFiltroOficina(val); setPaginaAtual(1); }}>
              <SelectTrigger className="w-[240px] rounded-full border-border/40 bg-card/60">
                <SelectValue placeholder="Todas as Oficinas" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="all">Todas as Oficinas</SelectItem>
                {oficinasDisponiveis.map((oficinaChave) => (
                  <SelectItem key={oficinaChave} value={oficinaChave}>
                    {nomesOficinas[oficinaChave] || oficinaChave}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
            <Table>
              <TableHeader className="bg-card">
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-32">Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Oficinas</TableHead>
                  {/* Nova coluna solicitada pela Gestão da Associação */}
                  <TableHead className="w-48 text-center">Documentação de Frequência</TableHead>
                  <TableHead className="text-right w-40">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosPaginados.length > 0 ? (
                  alunosPaginados.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-bold">{aluno.id}</TableCell>
                      <TableCell>{aluno.matricula}</TableCell>
                      <TableCell className="font-semibold text-foreground">{aluno.nome}</TableCell>
                      <TableCell>{renderizarBadgesOficinas(aluno.oficinas)}</TableCell>
                      
                      {/* Célula do Botão Direto para Baixar o PDF */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <BotaoLinhaPDF aluno={aluno} />
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAlunoSelecionado(aluno);
                            setModalOpen(true);
                          }}
                          className="rounded-full text-xs font-semibold border-border hover:border-primary gap-1"
                        >
                          <BarChart2 className="h-3.5 w-3.5" />
                          Ver Frequência
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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

      {/* DETAILED ATTENDANCE MODAL OVERLAY */}
      {modalOpen && alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-xl max-h-[85vh] bg-card border border-border rounded-2xl overflow-y-auto flex flex-col p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            
            {/* Header com a Associação */}
            <div className="flex flex-col border-b border-border/40 pb-4 gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Associação Pró-Cidadania
                </span>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground truncate max-w-md flex items-center gap-2 mt-1">
                <CalendarDays className="h-5 w-5 text-primary" />
                Histórico: {alunoSelecionado.nome}
              </h2>
            </div>

            {/* Sub-header com Matrícula e Oficina do Aluno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-background/40 border border-border/30 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Nº da Matrícula:</span>
                <span className="font-mono font-medium text-foreground">{alunoSelecionado.matricula || "Não informada"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Oficina(s):</span>
                {renderizarBadgesOficinas(alunoSelecionado.oficinas)}
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              {loadingFrequencia ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs">Carregando chamada...</p>
                </div>
              ) : (
                <>
                  <GraficoFrequencia dados={dadosFrequencia} />
                  <TabelaFrequencia dados={dadosFrequencia} />
                </>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button onClick={() => setModalOpen(false)} className="rounded-full px-6">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}