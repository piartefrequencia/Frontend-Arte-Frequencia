import { useNavigate } from "react-router-dom";
import { Target, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import missaoImg from "../assets/hero-band.jpg";

export default function Missao() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold md:text-5xl text-foreground">
          Nossa <span className="text-gradient-gold">Missão e Valores</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Conheça os pilares que sustentam a Associação Pró-Cidadania.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-glow max-h-96">
        <img src={missaoImg} alt="Banda do projeto" className="w-full h-full object-cover" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <Target className="h-10 w-10 text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground">Missão</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Transformar vidas por meio da arte (música), educação e cultura, proporcionando a crianças e jovens oportunidades de aprendizado e desenvolvimento humano, social e profissional.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <Compass className="h-10 w-10 text-accent" />
          <h3 className="font-display text-xl font-bold text-foreground">Visão</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ser referência em inclusão social e formação cidadã através de práticas artísticas e educacionais acessíveis.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <Heart className="h-10 w-10 text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground">Valores</h3>
          <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>🌟 Respeito e Inclusão</li>
            <li>🎵 Compromisso com a Educação e a Cultura</li>
            <li>🤝 Responsabilidade Social</li>
            <li>🎨 Liberdade Criativa e Expressão</li>
            <li>🌱 Desenvolvimento Sustentável</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full px-8">
          Voltar
        </Button>
      </div>
    </div>
  );
}
