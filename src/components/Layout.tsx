import React, { useContext, useState, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import logo from "/public/Assets/img/favicon_.png";
import logoComdica from "../../public/Assets/img/Logo_Apoio/COMDICA_IGA.png";
import logoHvl from "../../public/Assets/img/Logo_Apoio/HVL.png";
import logoProCidadania from "../../public/Assets/img/Logo_Apoio/ProCidadania.png";
import {
  Music2,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Shield,
  FolderCog,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Download, // Importei o ícone de Download caso queira uma identidade visual bacana
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initials = useMemo(() => {
    if (!user || !user.usuario) return "";
    const parts = user.usuario.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [user]);

  const irParaFinalDaPagina = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const podeVerLista =
    isAuthenticated && (user?.perfil === "PROF" || user?.perfil === "ESTAG");

  const podeVerControle = isAuthenticated && user?.perfil === "ADMIN";
  const podeVerAdmin =
    isAuthenticated && ["ADMIN", "COLAB"].includes(user?.perfil || "");

  // Link do Google Drive convertido para Download Direto utilizando o ID fornecido 
  const linkDownloadDireto = "https://drive.usercontent.google.com/download?id=1GopzWOpPlGES1SpYj9cc_7mUBEozfj5B&export=download&authuser=1";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col bg-hero">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent shadow-gold">
              <img src={logo} alt="" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight">
                Arte <span className="text-primary">&</span> Frequência
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Pró-Cidadania
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/quemsomos"
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`
              }
            >
              Quem Somos
            </NavLink>
            <NavLink
              to="/partituras"
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`
              }
            >
              Biblioteca Partituras
            </NavLink>
            <a
              href="#footer"
              onClick={irParaFinalDaPagina}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              Informações
            </a>

            {podeVerLista && (
              <NavLink
                to="/listapublico"
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`
                }
              >
                Lista dos Alunos
              </NavLink>
            )}

            {/* Dropdown Controle (Administração de Usuários) */}
            {podeVerControle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                    <Shield className="h-4 w-4 text-primary" />
                    Controle
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border/40 bg-card">
                  <DropdownMenuLabel>Gestão de Usuários</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/cadastro-usuarios")}>
                    Cadastro de Usuários
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/listausuario")}>
                    Lista dos Usuários
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Dropdown Painel Administrativo */}
            {podeVerAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                    <FolderCog className="h-4 w-4 text-accent" />
                    Painel Administrativo
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 border-border/40 bg-card">
                  <DropdownMenuLabel>Menu Administrativo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/cadastro-aluno")}>
                    Cadastro Alunos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cadastro-colaborador")}>
                    Cadastro Educadores
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/biblioteca")}>
                    Cadastro das Partituras
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/telegram")}>
                    Cadastro Mensagem Telegram
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/documentacao")}>
                    Documentação Crachá
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/form-frequencia")}>
                    Frequência Alunos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/listaalunos")}>
                    Lista dos Alunos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/listacolaborador")}>
                    Lista dos Educadores
                  </DropdownMenuItem>
                  
                  {/* Divisor Visual Opcional para dar destaque ao Botão de Download */}
                  <DropdownMenuSeparator />
                  
                  {/* NOVO BOTÃO DE DOWNLOAD: Totalmente integrado aos estilos do dropdown */}
                  <DropdownMenuItem asChild className="cursor-pointer text-primary font-semibold focus:bg-primary/10 focus:text-primary">
                    <a href={linkDownloadDireto} download>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Aplicativo
                    </a>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center p-0">
                    <div className="text-sm font-semibold text-secondary-foreground">{initials}</div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border/40 bg-card">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">{user.usuario}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <span className="inline-block w-fit mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-accent/20 text-primary">
                        {user.perfil}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="rounded-full px-5 hover:opacity-90 shadow-gold">
                  Entrar
                  <UserIcon className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            {isAuthenticated && user && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                {initials}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-1 hover:bg-card/40 rounded"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-xl border-t border-border/40 flex flex-col p-6 animate-fade-in">
          <nav className="flex flex-col gap-5 text-lg font-medium">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-muted-foreground"
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/quemsomos"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-muted-foreground"
              }
            >
              Quem Somos
            </NavLink>
            <NavLink
              to="/partituras"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-muted-foreground"
              }
            >
              Biblioteca Partituras
            </NavLink>
            <a
              href="#footer"
              onClick={irParaFinalDaPagina}
              className="text-muted-foreground"
            >
              Informações
            </a>

            {podeVerLista && (
              <NavLink
                to="/listapublico"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-primary" : "text-muted-foreground"
                }
              >
                Lista dos Alunos
              </NavLink>
            )}

            {/* Administrador Links - Mobile */}
            {podeVerAdmin && (
              <>
                <div className="h-px bg-border my-2" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Painel Administrativo
                </span>
                <Link to="/cadastro-aluno" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Cadastro Alunos
                </Link>
                <Link to="/cadastro-colaborador" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Cadastro Educadores
                </Link>
                <Link to="/biblioteca" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Cadastro das Partituras
                </Link>
                <Link to="/telegram" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Cadastro Mensagem Telegram
                </Link>
                <Link to="/documentacao" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Documentação Crachá
                </Link>
                <Link to="/form-frequencia" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Frequência Alunos
                </Link>
                <Link to="/listaalunos" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Lista dos Alunos
                </Link>
                <Link to="/listacolaborador" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Lista dos Educadores
                </Link>
                
                {/* Botão de Download na versão Mobile também APK Arte Fraquência */}
                <a href={linkDownloadDireto} download onClick={() => setMobileMenuOpen(false)} className="text-base text-primary font-semibold pl-2 flex items-center gap-2">
                  <Download className="h-4 w-4" /> Baixar Aplicativo
                </a>
              </>
            )}

            {podeVerControle && (
              <>
                <div className="h-px bg-border my-2" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Controle Usuários
                </span>
                <Link to="/cadastro-usuarios" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Cadastro de Usuários
                </Link>
                <Link to="/listausuario" onClick={() => setMobileMenuOpen(false)} className="text-base text-muted-foreground pl-2">
                  Lista dos Usuários
                </Link>
              </>
            )}

            {/* Mobile Auth Button */}
            <div className="mt-8">
              {isAuthenticated ? (
                <Button variant="destructive" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* CONTENT MAIN */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* FOOTER */}
      <footer id="footer" className="border-t border-border bg-card/40 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.8fr]">
            
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                 <img src={logo} alt="" />
                </div>
                <div className="font-display text-lg font-bold">
                  Arte <span className="text-primary">&</span> Frequência
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                Associação Pró-Cidadania — música, dança e teatro como
                instrumentos de cidadania. Transformando vidas desde 1991.
              </p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                Navegue
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition">Início</Link></li>
                <li><Link to="/quemsomos" className="hover:text-primary transition">Quem Somos</Link></li>
                <li><Link to="/partituras" className="hover:text-primary transition">Partituras</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                Contato
              </div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" /> Igarassu, PE
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0" /> procidadania1@gmail.com
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                Siga-nos
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://www.instagram.com/bandamarcialheitorvillalobos/"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary bg-card/60"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.youtube.com/@BandaMarcialHeitorVillaLobos"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary bg-card/60"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                Apoio
              </div>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <img
                  src={logoComdica}
                  alt="Apoio COMDICA Igarassu"
                  className="h-15 w-auto object-contain p-1.5 rounded-lg hover:bg-white transition"
                />
                <img
                  src={logoHvl}
                  alt="Apoio HVL"
                  className="h-15 w-auto object-contain p-1.5 rounded-lg hover:bg-white transition"
                />
                <img
                  src={logoProCidadania}
                  alt="Apoio Pró-Cidadania"
                  className="h-15 w-auto object-contain p-1.5 rounded-lg hover:bg-white transition"
                />
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <div>
              © {new Date().getFullYear()} Associação Pró-Cidadania. Todos os direitos reservados.
            </div>
            <div>Feito com ♪ em Pernambuco</div>
          </div>
        </div>
      </footer>
    </div>
  );
}