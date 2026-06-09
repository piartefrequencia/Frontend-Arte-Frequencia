import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Music, Upload, Trash2, Download, Search, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface PartituraData {
  id: number;
  nome: string;
  tipo: string;
}

export default function Biblioteca() {
  const navigate = useNavigate();
  const [arquivos, setArquivos] = useState<PartituraData[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12;

  const [modal, setModal] = useState({ aberto: false, url: "", tipo: "", nome: "" });
  const [blobUrl, setBlobUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    carregarArquivos();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["c", "u", "s", "p"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        alert("Ação desabilitada por segurança.");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const carregarArquivos = async () => {
    try {
      const response = await api.get("/partitura");
      if (response.status === 200) {
        setArquivos(response.data || []);
      } else if (response.status === 204) {
        console.log("Nenhuma partitura cadastrada.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar partituras do servidor.");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const filesArray = Array.from(files);
    
    for (const file of filesArray) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/partitura", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 201) {
          setArquivos((prev) => [...prev, response.data]);
          alert(`Arquivo "${file.name}" enviado com sucesso!`);
        } else {
          alert(`Erro ao enviar arquivo "${file.name}".`);
        }
      } catch (error: any) {
        console.error(error);
        alert(
          `Erro ao enviar arquivo "${file.name}": ` +
            (error.response?.data || error.message)
        );
      }
    }
    setUploading(false);
    carregarArquivos();
  };

  const handleDownload = async (id: number, nomeArquivo: string) => {
    try {
      const response = await api.get(`/partitura/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nomeArquivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar:", error);
      alert("Não foi possível baixar o arquivo.");
    }
  };

  const abrirModal = async (id: number, tipo: string, nome: string) => {
    try {
      const response = await api.get(`/partitura/${id}/visualizar`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: tipo }));
      setBlobUrl(url);
      setModal({ aberto: true, url, tipo, nome });
    } catch (error) {
      alert("Erro ao carregar visualização.");
    }
  };

  const fecharModal = () => {
    if (blobUrl) window.URL.revokeObjectURL(blobUrl);
    setModal({ aberto: false, url: "", tipo: "", nome: "" });
    setBlobUrl("");
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir "${nome}"?`)) return;
    try {
      await api.delete(`/partitura/${id}`);
      setArquivos((prev) => prev.filter((arq) => arq.id !== id));
      alert("Arquivo excluído com sucesso.");
    } catch (error) {
      alert("Erro ao excluir arquivo.");
    }
  };

  const arquivosFiltrados = arquivos.filter((arq) =>
    arq.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensDaPaginaAtual = arquivosFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(arquivosFiltrados.length / itensPorPagina);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Gerenciamento de <span className="text-gradient-gold">Partituras</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Faça upload, baixe ou exclua partituras da biblioteca.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-gold cursor-pointer transition hover:translate-y-[-2px] disabled:opacity-50">
            <Upload className="h-4 w-4" />
            {uploading ? "Enviando..." : "Upload de Partituras"}
            <input
              type="file"
              multiple
              accept=".pdf, .png, .jpg, .jpeg"
              onChange={handleUpload}
              hidden
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filtrar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10 rounded-full border-border/40 bg-card/60"
        />
      </div>

      {/* Grid of sheets */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {itensDaPaginaAtual.length > 0 ? (
          itensDaPaginaAtual.map((arq) => {
            const ext = arq.nome.split(".").pop()?.toLowerCase();
            const isPdf = ext === "pdf";

            return (
              <Card key={arq.id} className="border-border/40 bg-card-gradient flex flex-col justify-between hover:border-primary/40 transition">
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
                <CardFooter className="p-5 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shrink-0 border-border hover:border-primary"
                    onClick={() => handleDownload(arq.id, arq.nome)}
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs rounded-full border-border hover:border-primary"
                    onClick={() => abrirModal(arq.id, arq.tipo, arq.nome)}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full shrink-0 shadow-sm"
                    onClick={() => handleExcluir(arq.id, arq.nome)}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhum arquivo cadastrado.</p>
          </div>
        )}
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

      {/* View Modal */}
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
                  <img src={modal.url} alt="Preview" className="max-w-full max-h-full object-contain pointer-events-none" />
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
