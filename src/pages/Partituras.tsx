import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api";
import { Music, Download, FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface PartituraData {
  id: number;
  nome: string;
  tipo: string;
}

export default function Partituras() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  const [arquivos, setArquivos] = useState<PartituraData[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12;

  const [modal, setModal] = useState({
    aberto: false,
    url: "",
    tipo: "",
    nome: "",
  });
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    if (loading) return;

    const carregarArquivos = async () => {
      try {
        const response = await api.get("/partitura");
        if (response.status === 200) {
          setArquivos(response.data || []);
        } else if (response.status === 204) {
          console.log("Nenhuma partitura encontrada.");
        }
      } catch (error) {
        console.error("Erro ao carregar partituras:", error);
      }
    };

    carregarArquivos();

    // Prevent key/cópia actions for basic sheet music protection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["c", "u", "s", "p"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        alert("Ação desabilitada por motivos de segurança e direitos autorais.");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [loading]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const abrirModal = async (id: number, tipo: string, nome: string) => {
    if (!isAuthenticated) {
      alert("O conteúdo das partituras é exclusivo para Alunos Matriculados e Professores da Associação Pró-Cidadania.");
      return;
    }

    try {
      const response = await api.get(`/partitura/${id}/visualizar`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: tipo })
      );

      setBlobUrl(url);
      setModal({
        aberto: true,
        url,
        tipo,
        nome,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar arquivo de visualização.");
    }
  };

  const baixarArquivo = async (id: number, nomeArquivo: string) => {
    if (!isAuthenticated) {
      alert("O conteúdo das partituras é exclusivo para Alunos Matriculados e Professores da Associação Pró-Cidadania.");
      return;
    }

    try {
      const response = await api.get(`/partitura/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erro ao baixar arquivo.");
    }
  };

  const fecharModal = () => {
    if (blobUrl) {
      window.URL.revokeObjectURL(blobUrl);
    }
    setModal({ aberto: false, url: "", tipo: "", nome: "" });
    setBlobUrl("");
  };

  const arquivosFiltrados = arquivos.filter((arq) =>
    arq.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const itensPagina = arquivosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(arquivosFiltrados.length / itensPorPagina);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Carregando Biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold md:text-5xl text-foreground">
          Biblioteca de <span className="text-gradient-gold">Partituras</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Biblioteca musical da Banda Marcial Heitor Villa Lobos.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar partitura por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10 rounded-full border-border/40 bg-card/60"
        />
      </div>

      {/* Sheets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-6">
        {itensPagina.length > 0 ? (
          itensPagina.map((arq) => {
            const ext = arq.nome.split(".").pop()?.toLowerCase();
            const isPdf = ext === "pdf";

            return (
              <Card key={arq.id} className="border-border/40 bg-card-gradient flex flex-col justify-between hover:border-primary/40 transition duration-300">
                <CardHeader className="p-5">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary mb-3">
                    {isPdf ? <FileText className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                  </div>
                  <CardTitle
                    className="text-base font-bold text-foreground line-clamp-2 hover:underline cursor-pointer"
                    onClick={() => abrirModal(arq.id, arq.tipo, arq.nome)}
                  >
                    {arq.nome}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold rounded-full border-border hover:border-primary"
                    onClick={() => abrirModal(arq.id, arq.tipo, arq.nome)}
                  >
                    Visualizar Partitura
                  </Button>
                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold rounded-full shadow-gold"
                    onClick={() => baixarArquivo(arq.id, arq.nome)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Baixar Partitura
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhuma partitura encontrada.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
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

      {/* PDF View Modal Overlay */}
      {modal.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={fecharModal}>
          <div className="relative w-full max-w-4xl h-[85vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground truncate max-w-md">{modal.nome}</h3>
              <button onClick={fecharModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow bg-card-gradient">
              {["jpg", "jpeg", "png"].includes(modal.tipo.split("/")[1] || "") ? (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-4 select-none">
                  <img src={modal.url} alt="View" className="max-w-full max-h-full object-contain pointer-events-none" />
                </div>
              ) : (
                <iframe src={modal.url} title="PDF Preview" className="w-full h-full border-none" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
