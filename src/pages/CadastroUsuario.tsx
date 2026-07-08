import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Eye, EyeOff, Save, ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cpf: "",
    email: "",
    login: "",
    usuario: "",
    senha: "",
    perfil: "ADMIN",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setLoading(true);

    try {
      const response = await api.post("/usuario", formData);
      setMensagem("Usuário cadastrado com sucesso!");
      console.log("Usuário cadastrado:", response.data);
      setTimeout(() => navigate("/listausuario"), 1200);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setErro("Já existe um usuário com esse CPF.");
      } else {
        setErro("Erro ao cadastrar usuário.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="border-border/40 bg-card-gradient shadow-glow">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary shadow-gold">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-foreground">
            Cadastro de Usuário
          </CardTitle>
          <p className="text-muted-foreground text-xs">Crie um novo login de acesso para o portal.</p>
        </CardHeader>

        <form onSubmit={handleSalvar}>
          <CardContent className="space-y-4">
            {mensagem && (
              <div className="p-3 text-sm rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-center font-medium">
                {mensagem}
              </div>
            )}
            {erro && (
              <div className="p-3 text-sm rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-center font-medium">
                {erro}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="usuario" className="text-xs font-semibold text-muted-foreground">
                Nome do Usuário
              </label>
              <Input
                id="usuario"
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                className="bg-background/40 border-border/40"
              />
            </div>

             <div className="space-y-1">
              <label htmlFor="cpf" className="text-xs font-semibold text-muted-foreground">
                CPF
              </label>
              <Input
                id="cpf"
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                className="bg-background/40 border-border/40"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="login" className="text-xs font-semibold text-muted-foreground">
                Login de Acesso
              </label>
              <Input
                id="login"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
                className="bg-background/40 border-border/40"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                Endereço de E-mail
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background/40 border-border/40"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="senha" className="text-xs font-semibold text-muted-foreground">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
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

            <div className="space-y-1">
              <label htmlFor="perfil" className="text-xs font-semibold text-muted-foreground">
                Perfil de Acesso
              </label>
              <Select
                value={formData.perfil}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, perfil: val }))}
              >
                <SelectTrigger className="bg-background/40 border-border/40">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="COLAB">Colaborador</SelectItem>
                  <SelectItem value="ALUNO">Aluno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full rounded-full shadow-gold font-semibold">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Usuário"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
