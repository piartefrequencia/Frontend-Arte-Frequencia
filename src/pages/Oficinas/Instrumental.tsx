import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import instrumentalImg from "../../../public/Assets/img/HVL_0002.jpeg";

export default function Instrumental() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Prática <span className="text-gradient-gold">Instrumental</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          O aprendizado prático de instrumentos de sopro, cordas e teclas.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-glow aspect-video max-h-96">
        <img src={instrumentalImg} alt="Prática Instrumental" className="w-full h-full object-cover" />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          A oficina de <strong>Prática Instrumental</strong> acolhe alunos a partir dos 12 anos para
          a iniciação e aperfeiçoamento técnico em diversos instrumentos musicais. Através de aulas
          coletivas e de ensaios em grupo, desenvolve-se a percepção rítmica e harmônica de cada aluno.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Os alunos da oficina têm a oportunidade de integrar as formações musicais oficiais da
          Associação, como a respeitada Banda Marcial Heitor Villa Lobos, proporcionando vivências
          práticas de apresentações públicas e desenvolvimento de foco e disciplina.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full px-8">
          Voltar
        </Button>
      </div>
    </div>
  );
}
