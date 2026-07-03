import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ArrowLeft, Save, ShieldAlert, Heart, School, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// Mapeamento seguro entre os IDs numéricos do <select> e as chaves do banco de dados para Oficinas
const mapeamentoOficinas: Record<string, string> = {
  "1": "musicalizacao",
  "2": "praticaInstrumental",
  "3": "danca",
  "4": "percussaoPopular",
};

// Mapeamento seguro para Tipo Sanguíneo para evitar digitação errada
const mapeamentoTipoSanguineo: Record<string, string> = {
  "1": "A+",
  "2": "A-",
  "3": "B+",
  "4": "B-",
  "5": "AB+",
  "6": "AB-",
  "7": "O+",
  "8": "O-",
};

export default function EditarAluno() {
  const { matricula } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "", cpf: "", rg: "", dataExpedRg: "", orgaoExp: "",
    rn: "", dataNascimento: "", idade: "", filiacaoPai: "",
    telefonePai: "", filiacaoMae: "", telefoneMae: "",
    responsavel: "", telefoneResponsavel: "",
    emailResponsavel: "", possuiDoenca: false, qualDoenca: "",
    medicacao: "", tipoSanguineo: "", // Guardará o ID numérico ("1" a "8") selecionado
    escola: "", serieturma: "",
    turnoesc: "", autorizacaoImagem: false,
    atividadesExtras: false, descricaoAtividadesExtras: "",
    necessidadesEspeciais: false, descricaoNecessidadesEspeciais: "",
    oficinas: "", // Guardará o ID numérico ("1" a "4") selecionado
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const res = await api.get(`/aluno/${matricula}`);
        
        // 1. TRATAMENTO DE OFICINAS
        let idOficinaSelecionada = "";
        if (res.data.oficinas) {
          try {
            const oficinasObj = JSON.parse(res.data.oficinas);
            const chaveAtiva = Object.keys(oficinasObj).find(key => oficinasObj[key] === true);
            if (chaveAtiva) {
              const idEncontrado = Object.keys(mapeamentoOficinas).find(
                (id) => mapeamentoOficinas[id] === chaveAtiva
              );
              if (idEncontrado) idOficinaSelecionada = idEncontrado;
            }
          } catch {
            const idDireto = String(res.data.oficinas).trim();
            if (mapeamentoOficinas[idDireto]) idOficinaSelecionada = idDireto;
          }
        }

        // 2. TRATAMENTO DE TIPO SANGUÍNEO
        let idTipoSanguineoSelecionado = "";
        if (res.data.tipoSanguineo) {
          const tipoDoBanco = String(res.data.tipoSanguineo).trim().toUpperCase();
          const idEncontrado = Object.keys(mapeamentoTipoSanguineo).find(
            (id) => mapeamentoTipoSanguineo[id].toUpperCase() === tipoDoBanco
          );
          if (idEncontrado) idTipoSanguineoSelecionado = idEncontrado;
        }

        setFormData({
          ...res.data,
          oficinas: idOficinaSelecionada,
          tipoSanguineo: idTipoSanguineoSelecionado,
        });
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        alert("Erro ao carregar dados do aluno.");
        navigate("/listaalunos");
      } finally {
        setLoading(false);
      }
    };
    fetchAluno();
  }, [matricula, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatado = value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
    setFormData((prev) => ({ ...prev, [name]: formatado }));
  };

  useEffect(() => {
    if (formData.dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(formData.dataNascimento);
      if (!isNaN(nascimento.getTime())) {
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        setFormData((prev) => ({ ...prev, idade: String(idade) }));
      }
    }
  }, [formData.dataNascimento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Reconverte o ID numérico das oficinas para JSON String para o backend
      let oficinasParaEnviar = "";
      if (formData.oficinas && mapeamentoOficinas[formData.oficinas]) {
        const chaveOficina = mapeamentoOficinas[formData.oficinas];
        oficinasParaEnviar = JSON.stringify({ [chaveOficina]: true });
      }

      // Reconverte o ID numérico do tipo sanguíneo para a string correspondente ("A+", "O-", etc.)
      let tipoSanguineoParaEnviar = "";
      if (formData.tipoSanguineo && mapeamentoTipoSanguineo[formData.tipoSanguineo]) {
        tipoSanguineoParaEnviar = mapeamentoTipoSanguineo[formData.tipoSanguineo];
      }

      const enviarForm = {
        ...formData,
        oficinas: oficinasParaEnviar,
        tipoSanguineo: tipoSanguineoParaEnviar,
      };

      await api.put(`/aluno/${matricula}`, enviarForm);
      alert("Aluno atualizado com sucesso!");
      navigate("/listaalunos");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      alert("Erro ao atualizar aluno.");
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
            Atualizar dados de <span className="text-gradient-gold">{formData.nome}</span>
          </h1>
          <p className="text-muted-foreground text-sm">Edite a ficha cadastral do aluno.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PERSONAL DATA */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Nome Completo</label>
              <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">CPF</label>
                <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">RG</label>
                <Input type="text" name="rg" value={formData.rg} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Órgão Exp.</label>
                <Input type="text" name="orgaoExp" value={formData.orgaoExp || ""} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Expedição RG</label>
                <Input type="text" name="dataExpedRg" value={formData.dataExpedRg || ""} placeholder="dd/mm/aaaa" onChange={handleDateChange} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Data Nascimento</label>
                <Input type="text" name="dataNascimento" value={formData.dataNascimento || ""} placeholder="dd/mm/aaaa" onChange={handleDateChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Idade</label>
                <Input type="text" name="idade" value={formData.idade ? `${formData.idade} anos` : ""} readOnly className="bg-background/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Reg. Nascimento (Menores)</label>
                <Input type="text" name="rn" value={formData.rn} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Tipo Sanguíneo</label>
                <select 
                  name="tipoSanguineo" 
                  value={formData.tipoSanguineo} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Não informado / Selecione...</option>
                  <option value="1">A+</option>
                  <option value="2">A-</option>
                  <option value="3">B+</option>
                  <option value="4">B-</option>
                  <option value="5">AB+</option>
                  <option value="6">AB-</option>
                  <option value="7">O+</option>
                  <option value="8">O-</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Oficina Vinculada</label>
                <select 
                  name="oficinas" 
                  value={formData.oficinas} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione uma oficina...</option>
                  <option value="1">Musicalização</option>
                  <option value="2">Prática Instrumental</option>
                  <option value="3">Dança</option>
                  <option value="4">Percussão Popular</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAMILIA */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-accent" />
              Família e Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Nome do Pai</label>
                <Input type="text" name="filiacaoPai" value={formData.filiacaoPai} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Telefone Pai</label>
                <Input type="text" name="telefonePai" value={formData.telefonePai} onChange={handleTelefoneChange} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Nome da Mãe</label>
                <Input type="text" name="filiacaoMae" value={formData.filiacaoMae} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Telefone Mãe</label>
                <Input type="text" name="telefoneMae" value={formData.telefoneMae} onChange={handleTelefoneChange} />
              </div>
            </div>

            <div className="h-px bg-border/40 my-4" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Responsável</label>
                <Input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Telefone Responsável</label>
                <Input type="text" name="telefoneResponsavel" value={formData.telefoneResponsavel} onChange={handleTelefoneChange} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Email Responsável</label>
              <Input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* ESCOLA & ENDEREÇO */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Escola e Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Escola</label>
              <Input type="text" name="escola" value={formData.escola} onChange={handleChange} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Turma</label>
                <Input type="text" name="serieturma" value={formData.serieturma} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Turno Escolar</label>
                <Input type="text" name="turnoesc" value={formData.turnoesc} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SAUDE */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              Informações de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="possuiDoenca"
                name="possuiDoenca"
                checked={formData.possuiDoenca}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({ ...prev, possuiDoenca: !!checked }));
                }}
              />
              <label htmlFor="possuiDoenca" className="text-sm font-medium leading-none cursor-pointer">
                Possui doença crônica
              </label>
            </div>

            {formData.possuiDoenca && (
              <div className="grid gap-4 sm:grid-cols-2 pl-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Qual Doença?</label>
                  <Input type="text" name="qualDoenca" value={formData.qualDoenca || ""} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Medicação</label>
                  <Input type="text" name="medicacao" value={formData.medicacao || ""} onChange={handleChange} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AUTORIZAÇÕES */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Autorizações e Extras
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autorizacaoImagem"
                name="autorizacaoImagem"
                checked={formData.autorizacaoImagem}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({ ...prev, autorizacaoImagem: !!checked }));
                }}
              />
              <label htmlFor="autorizacaoImagem" className="text-sm font-medium leading-none cursor-pointer">
                Autorização de uso de Imagem
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="atividadesExtras"
                  name="atividadesExtras"
                  checked={formData.atividadesExtras}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, atividadesExtras: !!checked }));
                  }}
                />
                <label htmlFor="atividadesExtras" className="text-sm font-medium leading-none cursor-pointer">
                  Participa de atividades extras
                </label>
              </div>
              {formData.atividadesExtras && (
                <div className="pl-6">
                  <Input type="text" name="descricaoAtividadesExtras" value={formData.descricaoAtividadesExtras || ""} onChange={handleChange} placeholder="Descreva..." />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="necessidadesEspeciais"
                  name="necessidadesEspeciais"
                  checked={formData.necessidadesEspeciais}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, necessidadesEspeciais: !!checked }));
                  }}
                />
                <label htmlFor="necessidadesEspeciais" className="text-sm font-medium leading-none cursor-pointer">
                  Possui necessidades especiais
                </label>
              </div>
              {formData.necessidadesEspeciais && (
                <div className="pl-6">
                  <Input type="text" name="descricaoNecessidadesEspeciais" value={formData.descricaoNecessidadesEspeciais || ""} onChange={handleChange} placeholder="Descreva..." />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full px-6">
            Cancelar
          </Button>
          <Button type="submit" className="rounded-full px-8 shadow-gold">
            <Save className="h-4 w-4 mr-2" />
            Atualizar Ficha
          </Button>
        </div>

      </form>
    </div>
  );
}

