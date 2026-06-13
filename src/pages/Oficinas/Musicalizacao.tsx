import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import musicalizacaoImg from "../../../public/Assets/img/imagem-banda5.jpg"; // Using program-music as illustration

export default function Musicalizacao() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Musicalização <span className="text-gradient-gold">Infantil</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Iniciação e desenvolvimento do universo sonoro para crianças.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-glow aspect-video max-h-96">
        <img src={musicalizacaoImg} alt="Musicalização Infantil" className="w-full h-full object-cover" />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 p-8 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          A oficina de <strong>Musicalização Infantil</strong> é voltada para crianças de 07 a 11 anos,
          oferecendo os primeiros passos na educação musical. Através de jogos rítmicos, cantos coletivos e
          atividades lúdicas, as crianças começam a se familiarizar com notas, andamentos e timbres.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Esta etapa é fundamental para o desenvolvimento intelectual, motor e social dos pequenos,
          preparando-os cognitivamente para escolherem seus futuros caminhos instrumentais ou
          atividades artísticas dentro da Associação Pró-Cidadania.
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
