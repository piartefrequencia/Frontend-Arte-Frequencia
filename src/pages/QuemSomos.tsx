import logoRedondo from "../assets/about-community.jpg"; // Using a local image as illustration or fallback
import { Heart, Music2, Users, Sparkles, Target, Compass } from "lucide-react";

export default function QuemSomos() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold md:text-5xl text-foreground">
          Associação <span className="text-gradient-gold">Pró-Cidadania</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Fomentando cidadania e abrindo oportunidades por meio do ensino de música, dança e teatro.
        </p>
      </div>

      {/* History and details */}
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Nossa História</h2>
          <p className="text-muted-foreground leading-relaxed">
            A <strong>Associação Pró-Cidadania</strong> é uma entidade sem fins lucrativos, fundada em
            <strong> 26 de junho de 1991</strong>. Seu compromisso inicial foi a promoção social de
            crianças e adolescentes em risco de vulnerabilidade por meio da expressão artística.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Desde a fundação, a entidade consolidou diversos projetos e convênios, prestando serviços
            relevantes em parceria com o Poder Público e iniciativa privada para ampliar o acesso à educação e cultura.
          </p>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden border border-border shadow-glow aspect-video">
            <img src={logoRedondo} alt="Crianças do projeto" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Audience */}
      <div className="rounded-3xl border border-border/40 bg-card/40 p-8 md:p-12 space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground text-center">Nosso Público</h2>
        <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
          O trabalho da Associação é focado em pessoas em situação de carência, exclusão ou vulnerabilidade
          social, seja por limitações de recursos financeiros, geográficas ou de oportunidade. Servimos como o elo
          de conexão entre o Poder Público, a iniciativa privada e a comunidade local.
        </p>
      </div>

      {/* MVV Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-gold">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">Missão</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Transformar vidas por meio da música, dança e artes cênicas, abrindo caminhos para o aprendizado e
            desenvolvimento humano, social e de carreira profissional.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">Visão</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tornar-se uma referência em inclusão social e formação para a cidadania ativa por meio de atividades
            culturais e pedagógicas gratuitas e acessíveis.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card-gradient p-8 space-y-4 shadow-glow">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-gold">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">Valores</h3>
          <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>🌟 Respeito e Inclusão</li>
            <li>🎵 Educação e Cultura</li>
            <li>🤝 Responsabilidade Social</li>
            <li>🎨 Liberdade Criativa</li>
            <li>🌱 Desenvolvimento Sustentável</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
