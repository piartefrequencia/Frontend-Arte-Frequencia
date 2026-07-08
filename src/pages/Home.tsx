import { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  Music2,
  Drum,
  Mic2,
  Sparkles,
  Heart,
  Users,
  Compass,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

const heroBand = "/Assets/img/imagem-banda4.jpg";
const programInstument = "/Assets/img/musicalizacaoinfantil.png";
const programMusic = "/Assets/img/imagem-banda2.jpg";
const programDance = "/Assets/img/imagem-banda7.jpg";
const programPercussion = "/Assets/img/imagem-banda8.jpg";
const programMarching = "/Assets/img/HVL_0003.jpeg";
const aboutCommunity = "/Assets/img/imagem-banda.jpg";

const galeria1 = "/Assets/img/galeria1.jpg";
const galeria2 = "/Assets/img/galeria2.jpg";
const galeria3 = "/Assets/img/galeria6.jpg";
const galeria4 = "/Assets/img/galeria4.jpg";
const galeria5 = "/Assets/img/imagem-banda6.jpg";
const galeria6 = "/Assets/img/galeria5.jpg";

const programs = [
  {
    icon: Music2,
    title: "Musicalização Infantil",
    desc: "Primeiros passos no universo musical, desenvolvendo ritmo, percepção e expressão.",
    image: programInstument,
    tag: "Crianças",
    link: "/musicalizacao",
  },
  {
    icon: Mic2,
    title: "Prática Instrumental",
    desc: "Aulas individuais e coletivas em sopros, cordas e teclas para todos os níveis.",
    image: programMusic,
    tag: "Instrumentos",
    link: "/instrumental",
  },
  {
    icon: Drum,
    title: "Percussão Popular",
    desc: "Da batucada à música de concerto — explore a riqueza rítmica brasileira.",
    image: programPercussion,
    tag: "Ritmo",
    link: "/percussao",
  },
  {
    icon: Sparkles,
    title: "Dança e Teatro",
    desc: "Corpo, voz e cena: expressão artística que liberta e conecta.",
    image: programDance,
    tag: "Cena",
    link: "/danca",
  },
  {
    icon: Compass,
    title: "Banda Marcial Heitor Villa Lobos",
    desc: "Tradição, disciplina e arte: uma das mais respeitadas bandas marciais da região.",
    image: programMarching,
    tag: "Banda",
    link: "/quemsomos",
  },
];

const values = [
  { icon: Heart, title: "Respeito e Inclusão", text: "Acolhemos todos, sem distinção." },
  { icon: Music2, title: "Educação e Cultura", text: "Compromisso permanente com o aprender." },
  { icon: Users, title: "Responsabilidade Social", text: "Elo entre poder público e sociedade." },
  { icon: Sparkles, title: "Liberdade Criativa", text: "A arte como expressão genuína." },
  { icon: Target, title: "Desenvolvimento Sustentável", text: "Crescer com propósito e raiz." },
];

export default function Home() {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useContext(AuthContext);

  const isAuthorized = isAuthenticated && (user?.perfil === "ADMIN" || user?.perfil === "COLAB");

  const whatsappUrl = `https://wa.me/5581994644959?text=${encodeURIComponent(
    "Olá, gostaria de saber mais informações para realizar minha inscrição."
  )}`;

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(programs.length - 1, idx + dir));
    setIdx(next);
    trackRef.current?.children[next]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/10 p-8 md:p-16">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBand}
            alt="Crianças do projeto tocando na banda marcial"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Desde 1991 · Associação Pró-Cidadania
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl text-foreground">
              A arte como
              <span className="block text-gradient-gold">Instrumentos de cidadania.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Música, dança e teatro transformando a vida de crianças e
              adolescentes — abrindo caminhos de aprendizados, expressão e
              pertencimento.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {isAuthorized ? (
                <Link
                  to="/cadastro-aluno"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:translate-y-[-2px]"
                >
                  Fazer inscrição
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:translate-y-[-2px]"
                >
                  FAÇA SUA INSCRIÇÃO!
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <a
                href="https://youtu.be/NGSHrdqLxTE?si=iULOoOUpiDat2suC"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:border-primary"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
                Vídeo do Projeto BMHVL
              </a>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-6 pt-8">
              {[
                { n: "34+", l: "anos de história" },
                { n: "3", l: "áreas artísticas" },
                { n: "5.000+", l: "vidas transformadas" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl font-bold text-primary md:text-4xl">
                    {s.n}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden md:block">
            <div className="animate-float relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-glow">
              <img
                src={heroBand}
                alt="Banda Marcial Heitor Villa Lobos"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  Banda Marcial
                </div>
                <div className="font-display text-2xl font-bold">
                  HEITOR VILLA LOBOS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border/40 bg-card/20 py-4 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[
            "Música",
            "Dança",
            "Teatro",
            "Cidadania",
            "Educação",
            "Inclusão",
            "Cultura",
            "Música",
            "Dança",
            "Teatro",
            "Cidadania",
            "Educação",
            "Inclusão",
            "Cultura",
          ].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-12 font-display text-2xl font-bold text-muted-foreground/60"
            >
              {t}
              <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              Nossos Programas
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
              Caminhos artísticos,
              <br />
              uma só <span className="text-gradient-gold">missão</span>.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card/40 backdrop-blur transition hover:border-primary hover:text-primary cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próximo"
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card/40 backdrop-blur transition hover:border-primary hover:text-primary cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="group relative h-[420px] w-[280px] sm:w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl border border-border/40"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary backdrop-blur font-semibold">
                      {p.tag}
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-xl font-bold leading-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    <Link
                      to={p.link}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-primary group-hover:underline"
                    >
                      Saber mais <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="grid items-center gap-14 md:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-glow">
            <img
              src={aboutCommunity}
              alt="Comunidade do projeto Arte & Frequência"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden rounded-2xl border border-border bg-card-gradient p-6 shadow-glow md:block">
            <div className="font-display text-5xl font-bold text-primary">1991</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Fundação
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
            Quem Somos
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl text-foreground">
            Associação <span className="text-gradient-gold">Pró-Cidadania</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A Associação Pró-Cidadania é uma entidade sem fins lucrativos criada
            em 26 de junho de 1991, com a finalidade inicial de promover socialmente
            crianças e adolescentes com tempo ocioso ou em risco social, através do estudo da música,
            dança e teatro.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Desde sua fundação, formalizou diversos projetos e convênios com
            entidades municipais, estaduais e federais. Hoje, focando em fomentar e valorizar
            o crescimento da educação e da cidadania na sociedade.
          </p>

          <div className="rounded-2xl border border-border/40 bg-card-gradient p-6">
            <div className="flex items-start gap-4">
              <Users className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <div className="font-display text-lg font-semibold text-foreground">
                  Nosso público
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Crianças e adolescentes em situação de carência, vulnerabilidade e exclusão
                  social — seja por falta de recursos financeiros, intelectuais,
                  geográficos ou de oportunidades. Somos o elo entre o Poder Público,
                  a Iniciativa Privada e a Sociedade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="space-y-12">
        <div className="flex items-end justify-between">
          <h3 className="font-display text-2xl font-bold md:text-4xl text-foreground">
            Nossos <span className="text-gradient-gold">Valores</span>
          </h3>
          <div className="hidden h-px flex-1 ml-8 bg-gradient-to-r from-border/40 to-transparent md:block" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="group rounded-2xl border border-border/40 bg-card/20 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/60 hover:bg-card/40"
              >
                <Icon className="h-7 w-7 text-primary transition group-hover:scale-110" />
                <div className="mt-5 font-display text-lg font-semibold text-foreground">
                  {v.title}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
            Galeria
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl text-foreground">
            Momentos que viram <span className="text-gradient-gold">história</span>.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:[grid-auto-rows:200px]">
          {[galeria1, galeria2, galeria4, galeria5, galeria3, galeria6 ].map((src, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 ${
                i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`Momento do projeto ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-card-gradient p-10 md:p-16 shadow-glow">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="relative space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              Faça parte
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-6xl text-foreground">
              Inscreva sua criança ou
              <span className="block text-gradient-gold">adolescente — é online.</span>
            </h2>
            <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
              Conheça o projeto, escolha o caminho artístico e garanta sua vaga
              de forma simples e rápida pelo nosso portal de matrículas.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {isAuthorized ? (
                <Link
                  to="/cadastro-aluno"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-gold transition hover:translate-y-[-2px]"
                >
                  Iniciar inscrição
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-gold transition hover:translate-y-[-2px]"
                >
                  Iniciar inscrição
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <Link
                to="/quemsomos"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold transition hover:border-primary text-foreground bg-card/20 backdrop-blur"
              >
                Conhecer o projeto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
