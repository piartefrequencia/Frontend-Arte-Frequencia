import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import dancaImg from "../../assets/program-dance.jpg";

export default function Danca() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Oficina de <span className="text-gradient-gold">Danças e Teatro</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Expressão corporal, desenvoltura e sensibilidade cênica.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-glow aspect-video max-h-96">
        <img src={dancaImg} alt="Danças e Teatro" className="w-full h-full object-cover" />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          A oficina de <strong>Danças e Teatro</strong> da Associação Pró-Cidadania tem como missão
          transformar vidas por meio da expressão artística, do corpo e da cena. Proporciona às crianças
          e adolescentes oportunidades de aprendizado e desenvolvimento de sua sensibilidade, ritmo e desinibição.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Acreditamos que o teatro e a dança auxiliam no desenvolvimento psicomotor, na socialização,
          na autoconfiança e no trabalho em equipe. É um espaço aberto para que cada aluno explore e
          liberte sua imaginação de maneira saudável e instrutiva.
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
