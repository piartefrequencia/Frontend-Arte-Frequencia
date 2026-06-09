import { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, User, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface UsuarioData {
  id: number;
  usuario: string;
  email: string;
  perfil: string;
}

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      const resposta = await api.get("/usuario");
      setUsuarios(resposta.data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Erro ao carregar lista de usuários.");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const excluirUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await api.delete(`/usuario/${id}`);
      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário.");
    }
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Controle de <span className="text-gradient-gold">Usuários</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Lista de contas com acesso administrativo ao portal.
          </p>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {usuarios.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground text-sm">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          usuarios.map((usuario) => (
            <Card key={usuario.id} className="border-border/40 bg-card-gradient flex flex-col justify-between hover:border-primary/40 transition">
              <CardHeader className="p-5 flex flex-row items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="overflow-hidden leading-tight">
                  <h3 className="font-display text-base font-bold text-foreground truncate">{usuario.usuario}</h3>
                  <p className="text-xs text-muted-foreground truncate">ID: {usuario.id}</p>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <strong>Perfil:</strong> {usuario.perfil}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <strong>Email:</strong> {usuario.email}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs rounded-full border-border hover:border-primary gap-1"
                  onClick={() => navigate(`/editar-usuario/${usuario.id}`)}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full text-xs rounded-full gap-1"
                  onClick={() => excluirUsuario(usuario.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
