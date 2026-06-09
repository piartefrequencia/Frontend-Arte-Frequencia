import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Camera, Upload, ArrowLeft, Save, ShieldAlert, Heart, School, ShieldCheck, User as UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function CadastroAluno() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [foto, setFoto] = useState<string | null>(null);
  const [tirandoFoto, setTirandoFoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    oficinas: {
      musicalizacao: false,
      praticaInstrumental: false,
      danca: false,
      percussaoPopular: false,
    },
    nome: "",
    cpf: "",
    rg: "",
    orgaoExp: "",
    dataExpedRg: "",
    rn: "",
    dataNascimento: "",
    idade: "",
    escola: "",
    estado: "",
    cidade: "",
    bairro: "",
    filiacaoPai: "",
    filiacaoMae: "",
    telefonePai: "",
    telefoneMae: "",
    responsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    possuiDoenca: "",
    qualDoenca: "",
    medicacao: "",
    tipoSanguineo: "",
    serieturma: "",
    turnoesc: "",
    autorizacaoImagem: false,
    atividadesExtras: false,
    descricaoAtividadesExtras: "",
    necessidadesEspeciais: false,
    descricaoNecessidadesEspeciais: "",
  });

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFoto(reader.result as string);
    };
    reader.onerror = () => {
      alert("Erro ao ler o arquivo de imagem.");
    };
    reader.readAsDataURL(file);
  };

  const iniciarCamera = async () => {
    setTirandoFoto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Não foi possível acessar a câmera do dispositivo.");
      setTirandoFoto(false);
    }
  };

  const capturarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = 200;
        canvas.height = 250;
        context.drawImage(video, 0, 0, 200, 250);
        const dataUrl = canvas.toDataURL("image/png");
        setFoto(dataUrl);
        pararCamera();
      }
    }
  };

  const pararCamera = () => {
    setTirandoFoto(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => pararCamera();
  }, []);

  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let data = value.replace(/\D/g, "");
    if (data.length >= 2) data = data.slice(0, 2) + "/" + data.slice(2);
    if (data.length >= 5) data = data.slice(0, 5) + "/" + data.slice(5, 9);
    setFormData((prev) => ({ ...prev, [name]: data }));
  };

  // Calculate age automatically
  useEffect(() => {
    const partes = formData.dataNascimento.split("/");
    if (partes.length === 3) {
      const [dia, mes, ano] = partes.map((n) => parseInt(n, 10));
      const hoje = new Date();
      const nascimento = new Date(ano, mes - 1, dia);
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

  const aplicarMascaraTelefone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: aplicarMascaraTelefone(value) }));
  };

  const cpfMask = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (name.startsWith("oficinas.")) {
      const key = name.split(".")[1] as keyof typeof formData.oficinas;
      setFormData((prev) => ({
        ...prev,
        oficinas: {
          ...prev.oficinas,
          [key]: checked,
        },
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    let newValue = value;
    if (name === "cpf") {
      newValue = cpfMask(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        oficinas: JSON.stringify(formData.oficinas),
        foto: foto,
      };

      const response = await api.post("/aluno", dataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data);
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        if (typeof error.response.data === "object") {
          const mensagens = Object.values(error.response.data).join("\n");
          alert("Erros de validação:\n" + mensagens);
        } else {
          alert("Erro: " + error.response.data);
        }
      } else {
        alert("Erro na conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Matrícula de <span className="text-gradient-gold">Novo Aluno</span>
          </h1>
          <p className="text-muted-foreground text-sm">Preencha os dados do estudante.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          
          {/* Picture Box */}
          <Card className="border-border/40 bg-card-gradient h-fit">
            <CardHeader className="p-5 text-center">
              <CardTitle className="text-sm font-semibold">Foto 3x4</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col items-center gap-4">
              {tirandoFoto ? (
                <div className="w-[180px] h-[225px] overflow-hidden rounded-md border border-border relative bg-black">
                  <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : foto ? (
                <img src={foto} alt="Foto 3x4" className="w-[180px] h-[225px] object-cover rounded-md border border-border shadow-md" />
              ) : (
                <div className="w-[180px] h-[225px] rounded-md border border-dashed border-border flex items-center justify-center bg-background/40 text-muted-foreground text-xs">
                  Sem Foto
                </div>
              )}

              <div className="flex flex-col gap-2 w-full">
                {tirandoFoto ? (
                  <>
                    <Button type="button" onClick={capturarFoto} size="sm" className="w-full">
                      Capturar
                    </Button>
                    <Button type="button" onClick={pararCamera} variant="outline" size="sm" className="w-full">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" onClick={iniciarCamera} size="sm" className="w-full gap-2">
                      <Camera className="h-4 w-4" />
                      Tirar foto
                    </Button>
                    <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-input bg-transparent text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer transition">
                      <Upload className="h-4 w-4" />
                      Fazer Upload
                      <input type="file" accept="image/*" onChange={handleFotoUpload} hidden />
                    </label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields Container */}
          <div className="space-y-6">
            
            {/* WORKSHOPS SELECT */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Oficinas Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 grid gap-4 sm:grid-cols-2">
                {[
                  { key: "musicalizacao", label: "Musicalização Infantil (07 a 11 anos)" },
                  { key: "praticaInstrumental", label: "Prática Instrumental (12 a 17 anos)" },
                  { key: "danca", label: "Dança (09 a 17 anos)" },
                  { key: "percussaoPopular", label: "Percussão Popular (12 a 17 anos)" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`oficina-${item.key}`}
                      name={`oficinas.${item.key}`}
                      checked={formData.oficinas[item.key as keyof typeof formData.oficinas]}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          oficinas: {
                            ...prev.oficinas,
                            [item.key]: !!checked,
                          },
                        }));
                      }}
                    />
                    <label htmlFor={`oficina-${item.key}`} className="text-sm font-medium leading-none cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* PERSONAL DATA */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-accent" />
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
                    <Input type="text" name="cpf" value={formData.cpf} placeholder="999.999.999-99" onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">RG</label>
                    <Input type="text" name="rg" value={formData.rg} maxLength={9} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Órgão Exp.</label>
                    <Input type="text" name="orgaoExp" value={formData.orgaoExp} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Expedição RG</label>
                    <Input type="text" name="dataExpedRg" maxLength={10} placeholder="dd/mm/aaaa" value={formData.dataExpedRg} onChange={handleData} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Data Nascimento</label>
                    <Input type="text" name="dataNascimento" maxLength={10} placeholder="dd/mm/aaaa" value={formData.dataNascimento} onChange={handleData} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Idade Calculada</label>
                    <Input type="text" name="idade" value={formData.idade ? `${formData.idade} anos` : ""} readOnly className="bg-background/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Reg. Nascimento (Menores)</label>
                    <Input type="text" name="rn" value={formData.rn} onChange={handleChange} disabled={Number(formData.idade) >= 18} />
                  </div>
                </div>

                {/* Sanguineous Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Tipo Sanguíneo</label>
                  <div className="flex flex-wrap gap-3">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((tipo) => (
                      <label key={tipo} className="flex items-center gap-1 cursor-pointer text-sm">
                        <input
                          type="radio"
                          name="tipoSanguineo"
                          value={tipo}
                          checked={formData.tipoSanguineo === tipo}
                          onChange={handleChange}
                          className="text-primary focus:ring-primary h-4 w-4 bg-background border-border"
                        />
                        {tipo}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PARENTS & CONTACT */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Filiação e Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Nome da Mãe</label>
                    <Input type="text" name="filiacaoMae" value={formData.filiacaoMae} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone Mãe</label>
                    <Input type="text" name="telefoneMae" maxLength={15} placeholder="(99) 99999-9999" value={formData.telefoneMae} onChange={handleTelefone} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Nome do Pai</label>
                    <Input type="text" name="filiacaoPai" value={formData.filiacaoPai} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone Pai</label>
                    <Input type="text" name="telefonePai" maxLength={15} placeholder="(99) 99999-9999" value={formData.telefonePai} onChange={handleTelefone} />
                  </div>
                </div>

                <div className="h-px bg-border/40 my-4" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Responsável Legal</label>
                    <Input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone Responsável</label>
                    <Input type="text" name="telefoneResponsavel" maxLength={15} placeholder="(99) 99999-9999" value={formData.telefoneResponsavel} onChange={handleTelefone} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">E-mail do Responsável</label>
                  <Input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            {/* ADRESS & SCHOOL */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <School className="h-5 w-5 text-accent" />
                  Informações de Endereço e Escola
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Estado</label>
                    <Input type="text" name="estado" value={formData.estado} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Cidade</label>
                    <Input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Bairro</label>
                    <Input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Nome da Escola</label>
                  <Input type="text" name="escola" value={formData.escola} onChange={handleChange} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Série/Turma</label>
                    <Input type="text" name="serieturma" value={formData.serieturma} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Turno Escolar</label>
                    <Input type="text" name="turnoesc" value={formData.turnoesc} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HEALTH INFORMATION */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Informações de Saúde
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Possui alguma doença crônica?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="possuiDoenca"
                        value="sim"
                        checked={formData.possuiDoenca === "sim"}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary h-4 w-4 bg-background border-border"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="possuiDoenca"
                        value="nao"
                        checked={formData.possuiDoenca === "nao"}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary h-4 w-4 bg-background border-border"
                      />
                      Não
                    </label>
                  </div>
                </div>

                {formData.possuiDoenca === "sim" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Qual(ais) Doença(s)</label>
                      <Input type="text" name="qualDoenca" value={formData.qualDoenca} onChange={handleChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Medicação Necessária</label>
                      <Input type="text" name="medicacao" value={formData.medicacao} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AUTHORIZATIONS & AGREEMENTS */}
            <Card className="border-border/40 bg-card/40">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Autorizações e Outras Informações
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
                    Autorizo o uso de imagem da criança/adolescente para divulgação do projeto
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
                      Participa de atividades extracurriculares
                    </label>
                  </div>
                  {formData.atividadesExtras && (
                    <div className="space-y-1 pl-6">
                      <label className="text-xs font-semibold text-muted-foreground">Quais atividades?</label>
                      <Input type="text" name="descricaoAtividadesExtras" value={formData.descricaoAtividadesExtras} onChange={handleChange} />
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
                    <div className="space-y-1 pl-6">
                      <label className="text-xs font-semibold text-muted-foreground">Descreva a necessidade</label>
                      <Input type="text" name="descricaoNecessidadesEspeciais" value={formData.descricaoNecessidadesEspeciais} onChange={handleChange} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full px-6">
                Voltar
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-gold">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Salvando..." : "Salvar Matrícula"}
              </Button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
