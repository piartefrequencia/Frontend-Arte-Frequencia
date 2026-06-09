import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import percussaoImg from "../../assets/program-percussion.jpg";

export default function Percussao() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Percussão <span className="text-gradient-gold">Popular e Erudita</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          O ritmo pulsante da cultura popular e das grandes orquestras.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-glow aspect-video max-h-96">
        <img src={percussaoImg} alt="Percussão Popular e Erudita" className="w-full h-full object-cover" />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          A oficina de <strong>Percussão Popular e Erudita</strong> explora a riqueza rítmica e sonora
          de instrumentos de percussão tradicionais brasileiros, além do instrumental sinfônico.
          É indicada para jovens de 12 a 17 anos que desejam dominar o tempo e a batida.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Através de práticas coletivas e dinâmicas criativas de grupo, os alunos vivenciam ritmos
          como o maracatu, frevo, coco e ritmos contemporâneos, estimulando a coordenação,
          expressividade e respeito mútuo.
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
