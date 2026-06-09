import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ArrowLeft, Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const resposta = await api.get(`/usuario/${id}`);
        setFormData({
          usuario: resposta.data.usuario,
          email: resposta.data.email,
        });
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
        navigate("/listausuario");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        usuario: formData.usuario,
        email: formData.email,
      };

      await api.put(`/usuario/${id}`, payload);
      alert("Usuário atualizado com sucesso!");
      navigate("/listausuario");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="border-border/40 bg-card-gradient shadow-glow">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Edit2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-foreground">
            Editar Usuário
          </CardTitle>
          <p className="text-muted-foreground text-xs">Atualize os dados cadastrados.</p>
        </CardHeader>

        <form onSubmit={handleSalvar}>
          <CardContent className="space-y-4">
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
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full rounded-full shadow-gold font-semibold">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => navigate("/listausuario")}
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
