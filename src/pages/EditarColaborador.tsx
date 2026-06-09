import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ArrowLeft, Save, Briefcase, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditarColaborador() {
  const { matricula } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    dataExpedRg: "",
    dataNascimento: "",
    idade: "",
    areaInstrucao: "",
    formacao: "",
    apelido: "",
    redeSocial: "",
    telefone: "",
    email: "",
    perfil: "PROF",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchColaborador = async () => {
      try {
        const res = await api.get(`/colaborador/${matricula}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Erro ao carregar colaborador:", error);
        alert("Erro ao carregar dados do educador.");
        navigate("/listacolaborador");
      } finally {
        setLoading(false);
      }
    };
    fetchColaborador();
  }, [matricula, navigate]);

  const formatarData = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length >= 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    return v.slice(0, 10);
  };

  const handleDataNascimento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataFormatada = formatarData(e.target.value);
    setFormData((prev) => ({ ...prev, dataNascimento: dataFormatada }));
  };

  const handleDataExpedRg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataFormatada = formatarData(e.target.value);
    setFormData((prev) => ({ ...prev, dataExpedRg: dataFormatada }));
  };

  useEffect(() => {
    const data = formData.dataNascimento;
    const partes = data.split("/");
    if (partes.length === 3) {
      const [dd, mm, yyyy] = partes.map(Number);
      const nascimento = new Date(yyyy, mm - 1, dd);
      if (!isNaN(nascimento.getTime())) {
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        setFormData((prev) => ({ ...prev, idade: idade >= 0 ? String(idade) : "" }));
      }
    }
  }, [formData.dataNascimento]);

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    setFormData((prev) => ({ ...prev, telefone: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      return setFormData((prev) => ({ ...prev, cpf: value.replace(/\D/g, "") }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        idade: formData.idade ? Number(formData.idade) : null,
      };

      await api.put(`/colaborador/${matricula}`, payload);
      alert("Colaborador atualizado com sucesso!");
      navigate("/listacolaborador");
    } catch (error) {
      console.error("Erro ao atualizar colaborador:", error);
      alert("Erro ao salvar dados.");
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Editar Educador: <span className="text-gradient-gold">{formData.nome}</span>
          </h1>
          <p className="text-muted-foreground text-sm">Atualize os dados cadastrados.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Nome Completo</label>
              <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">CPF</label>
                <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">RG</label>
                <Input type="text" name="rg" value={formData.rg} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Expedição RG</label>
                <Input type="text" name="dataExpedRg" maxLength={10} placeholder="dd/mm/aaaa" value={formData.dataExpedRg} onChange={handleDataExpedRg} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Data Nascimento</label>
                <Input type="text" name="dataNascimento" maxLength={10} placeholder="dd/mm/aaaa" value={formData.dataNascimento} onChange={handleDataNascimento} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Idade</label>
                <Input type="text" name="idade" value={formData.idade ? `${formData.idade} anos` : ""} readOnly className="bg-background/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Atividade Profissional e Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Área de Instrução</label>
                <Input type="text" name="areaInstrucao" value={formData.areaInstrucao || ""} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Formação Acadêmica</label>
                <Input type="text" name="formacao" value={formData.formacao} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Apelido</label>
                <Input type="text" name="apelido" value={formData.apelido || ""} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Perfil de Acesso</label>
                <Select
                  value={formData.perfil}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, perfil: val }))}
                >
                  <SelectTrigger className="bg-transparent border-input">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="PROF">Professor</SelectItem>
                    <SelectItem value="ESTAG">Estagiário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Telefone</label>
                <Input type="text" name="telefone" maxLength={15} placeholder="(99) 99999-9999" value={formData.telefone} onChange={handleTelefone} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Endereço de E-mail</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Rede Social</label>
                <Input type="text" name="redeSocial" value={formData.redeSocial || ""} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full px-6">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="rounded-full px-8 shadow-gold">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Atualizando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
