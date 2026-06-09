import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const alexsandraImg = "/Assets/img/Colaboradores/Alexsandra_0001.jpg";
const carlosImg = "/Assets/img/Colaboradores/Carlos_Barretto_0001.jpg";
const irviImg = "/Assets/img/Colaboradores/Irvi_Tavares_0001.jpg";
const clodoaldoImg = "/Assets/img/Colaboradores/Clodoaldo_0001.jpg";
const placeholderImg = "/Assets/img/Colaboradores/Fulano.png";


const colaboradores = [
  {
    src: alexsandraImg,
    nome: "Alexsandra Barretto",
    funcao: "Presidente da Instituição",
  },
  {
    src: carlosImg,
    nome: "Carlos Barretto",
    funcao: "Vice-presidente da Instituição",
  },
  {
    src: irviImg,
    nome: "Irvi Tavares",
    funcao: "Diretor Geral e Prof. de Prática Instrumental",
  },
  {
    src: clodoaldoImg,
    nome: "Clodoaldo Vicente",
    funcao: "Professor de Música e Maestro",
  },
  {
    src: placeholderImg,
    nome: "A definir",
    funcao: "Instrutor de Percussão",
  },
  {
    src: placeholderImg,
    nome: "A definir",
    funcao: "Instrutor(a) de Dança",
  },
  {
    src: placeholderImg,
    nome: "A definir",
    funcao: "Instrutor de Graves",
  },
  {
    src: placeholderImg,
    nome: "A definir",
    funcao: "Educadora Infantil",
  },
];

export default function Equipe() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const abrirModal = (src: string) => {
    setModalContent(src);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="space-y-12 py-8">
      {/* Title */}
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Nossos <span className="text-gradient-gold">Colaboradores</span>
          </h1>
          <p className="text-muted-foreground text-sm">A equipe por trás da Associação Pró-Cidadania.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {colaboradores.map((colab, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card-gradient shadow-glow flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-background">
              <img
                src={colab.src}
                alt={colab.nome}
                onClick={() => abrirModal(colab.src)}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105 cursor-pointer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImg;
                }}
              />
            </div>
            <div className="p-5 border-t border-border/20 leading-tight">
              <strong className="text-foreground text-base font-bold">{colab.nome}</strong>
              <p className="text-xs text-muted-foreground mt-1">{colab.funcao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={fecharModal}
        >
          <div
            className="relative max-w-lg w-full bg-card border border-border rounded-xl p-4 overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={fecharModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={modalContent} alt="Colaborador Ampliado" className="max-w-full max-h-[70vh] object-contain rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
