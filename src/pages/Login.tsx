import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Eye, EyeOff, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await login(email, senha);
      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const mensagem = error.response?.data || 
      "Credenciais inválidas. Verifique seu e-mail e senha.";
      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-8">
      <Card className="w-full max-w-md border-border/40 bg-card-gradient shadow-glow">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary shadow-gold">
            <Music className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-foreground">
            Acesso ao Portal
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Entre com seus dados para acessar Biblioteca de Partituras para estuda em sua casa.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                Endereço de E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/40 border-border/40"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="senha" className="text-xs font-semibold text-muted-foreground">
                Senha de Acesso
              </label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-background/40 border-border/40 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full rounded-full shadow-gold font-semibold" disabled={loading}>
              {loading ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={() => navigate("/")}
            >
              Voltar ao Início
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}