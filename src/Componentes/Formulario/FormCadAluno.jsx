

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormCadastros.css';

import Api from "../../Servico/APIservico";


function FormCadAluno() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [foto, setFoto] = useState(null);
  const [tirandoFoto, setTirandoFoto] = useState(false);
  const [loading, setLoading] = useState(false);


  //  Função de Upload de foto

const handleFotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {

    setFoto(reader.result);
  };
  reader.onerror = () => {
    alert('Erro ao ler o arquivo de imagem.');
  };
  reader.readAsDataURL(file);
};
  //  Iniciar câmera do notebbok ou camera instalada
  const iniciarCamera = async () => {
    setTirandoFoto(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      alert('Não foi possível acessar a câmera.');
    }
  };

  //  Capturar foto
  const capturarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 250;
    context.drawImage(video, 0, 0, 200, 250);
    const dataUrl = canvas.toDataURL('image/png');
    setFoto(dataUrl);
    pararCamera();
  };

  //  Parar câmera
  const pararCamera = () => {
    setTirandoFoto(false);
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  // Parar câmera ao desmontar componente
  useEffect(() => {
    return () => pararCamera();
  }, []);

 
  const [formData, setFormData] = useState({
    oficinas: {
      musicalizacao: false,
      praticaInstrumental: false,
      danca: false,
      percussaoPopular: false,
    },
    nome: '',
    cpf: '',
    rg: '',
    orgaoExp: '',
    dataExpedRg: '',
    rn: '',
    dataNascimento: '',
    idade: '',
    escola: '',
    estado: '',
    cidade: '',
    bairro: '',
    filiacaoPai: '',
    filiacaoMae: '',
    telefonePai: '',
    telefoneMae: '',
    responsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    possuiDoenca: '',
    qualDoenca: '',
    medicacao: '',
    tipoSanguineo: '',
    serieturma: '',
    turnoesc: '',
    autorizacaoImagem: false,
    atividadesExtras: false,
    descricaoAtividadesExtras: '',
    necessidadesEspeciais: false,
    descricaoNecessidadesEspeciais: '',
  });

  
  const handleData = (e) => {
    const { name, value } = e.target;
    let data = value.replace(/\D/g, '');
    if (data.length >= 2) data = data.slice(0, 2) + '/' + data.slice(2);
    if (data.length >= 5) data = data.slice(0, 5) + '/' + data.slice(5, 9);
    setFormData({ ...formData, [name]: data });
  };

  // Calcular idade automaticamente
  useEffect(() => {
    const partes = formData.dataNascimento.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes.map((n) => parseInt(n, 10));
      const hoje = new Date();
      const nascimento = new Date(ano, mes - 1, dia);
      if (!isNaN(nascimento)) {
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
        setFormData((prev) => ({ ...prev, idade }));
      }
    }
  }, [formData.dataNascimento]);

  //  Máscara de telefone
  const aplicarMascaraTelefone = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length <= 10)
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleTelefone = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: aplicarMascaraTelefone(value) });
  };

  //  Alterar campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('oficinas.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        oficinas: { ...formData.oficinas, [key]: checked },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };


  const handleVoltar = () => navigate("/");

  
  // Submeter  BACKEND SPRING BOOT

const handleSubmit = async (e) => {
  e.preventDefault();
  
// IMPEDE A DUPLICIDA AO CLICAR NO BOTAO DE CADASTRA O ALUNO
  if (loading) return;

  setLoading(true);

  try {

    const dataToSend = {
      ...formData,
      oficinas: JSON.stringify(formData.oficinas),
      foto: foto, 
    };

    const response = await Api.post(
      "/aluno",
      dataToSend,
      { headers: { "Content-Type": "application/json" } }
    );

    alert(response.data);
    navigate("/");
  } catch (error) {
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
  }
  finally {
    
    setLoading(false); 
  }
};


  return (
    <div className="form-container">
      <h2>Matrícula do Aluno</h2>
      <form onSubmit={handleSubmit}>
        {/* 📸 FOTO */}
        <div className="foto3x4-container">
          {tirandoFoto ? (
            <div className="camera-container">
              <video ref={videoRef} autoPlay />
              <canvas ref={canvasRef} hidden />
              <div className="botoes-camera">
                <button type="button" onClick={capturarFoto}>Capturar</button>
                <button type="button" onClick={pararCamera}>Cancelar</button>
              </div>
            </div>
          ) : foto ? (
            <img src={foto} alt="Foto 3x4" className="foto3x4-preview" />
          ) : (
            <div className="foto3x4-placeholder">Foto 3x4</div>
          )}

          <div className="botoes-foto">
            <button type="button" onClick={iniciarCamera}>Tirar foto</button>
            <label className="upload-btn">
              Upload
              <input type="file" accept="image/*" onChange={handleFotoUpload} hidden />
            </label>
          </div>
        </div>

        {/* 🎵 OFICINAS */}
        <div className="oficinas-group">
          <h3>OFICINAS DISPONÍVEIS</h3>
          <div className="oficinas-grid">
            {Object.keys(formData.oficinas).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={`oficinas.${key}`}
                  checked={formData.oficinas[key]}
                  onChange={handleChange}
                />
                {key === 'musicalizacao'
                  ? 'MUSICALIZAÇÃO INFANTIL (07 à 11 ANOS)'
                  : key === 'praticaInstrumental'
                  ? 'PRÁTICA INSTRUMENTAL (12 à 17 ANOS)'
                  : key === 'danca'
                  ? 'DANÇA (09 à 17 ANOS)'
                  : 'PERCUSSÃO POPULAR E ERUDITA (12 à 17 ANOS)'}
              </label>
            ))}
          </div>
        </div>

        {/* 👤 DADOS PESSOAIS */}
        <label>Nome Completo:
          <input type="text" name="nome" value={formData.nome} onChange={handleChange}  />
        </label>

        <div className="linha">
          <label>CPF:
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
          </label>

          <label>RG:
            <input type="text" name="rg" value={formData.rg} onChange={handleChange}  />
          </label>

          <label>Org. Exp.:
            <input type="text" name="orgaoExp" value={formData.orgaoExp} onChange={handleChange}  />
          </label>

           <label>Data de Exp. RG:
            <input type="text" name="dataExpedRg" maxLength="10" placeholder="dd/mm/aaaa"
              value={formData.dataExpedRg} onChange={handleData} />
          </label>
        </div>

        <div className="linha">
          <label>Data de Nascimento:
            <input type="text" name="dataNascimento" maxLength="10" placeholder="dd/mm/aaaa"
              value={formData.dataNascimento} onChange={handleData}  />
          </label>

          <label>Idade:
            <input type="text" name="idade" value={formData.idade ? `${formData.idade} anos` : ''} readOnly />
          </label>

          <label>R.Nasc.:
            <input type="text" name="rn" value={formData.rn} onChange={handleChange}
              disabled={formData.idade >= 18} />
          </label>
        </div>

        <div className="linha">
          <label>Filiação - Pai:
            <input type="text" name="filiacaoPai" value={formData.filiacaoPai} onChange={handleChange} />
          </label>

          <label>Filiação - Mãe:
            <input type="text" name="filiacaoMae" value={formData.filiacaoMae} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>Telefone Pai:
            <input type="text" name="telefonePai" maxLength="15" placeholder="(99) 99999-9999"
              value={formData.telefonePai} onChange={handleTelefone} />
          </label>

          <label>Telefone Mãe:
            <input type="text" name="telefoneMae" maxLength="15" placeholder="(99) 99999-9999"
              value={formData.telefoneMae} onChange={handleTelefone} />
          </label>
        </div>

        {/* ❤️ Tipo sanguíneo */}
        <label>Tipo Sanguíneo:</label>
        <div className="linha-radio">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((tipo) => (
            <label key={tipo}>
              <input
                type="radio"
                name="tipoSanguineo"
                value={tipo}
                checked={formData.tipoSanguineo === tipo}
                onChange={handleChange}
              /> {tipo}
            </label>
          ))}
        </div>

        {/* 🏫 Escola e endereço */}
        <label>Nome da Escola:
          <input type="text" name="escola" value={formData.escola} onChange={handleChange}  />
        </label>

        <div className="linha">
          <label>Estado:
            <input type="text" name="estado" value={formData.estado} onChange={handleChange} />
          </label>
          <label>Cidade:
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
          </label>
          <label>Bairro / Distrito:
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
          </label>
        </div>

        {/* 👨‍👩‍👧 Responsável */}
        <div className="linha">
          <label>Nome do Responsável:
            <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange}  />
          </label>

          <label>Telefone:
            <input type="text" name="telefoneResponsavel" maxLength="15" placeholder="(99) 99999-9999"
              value={formData.telefoneResponsavel} onChange={handleTelefone} required />
          </label>
        </div>

        <label>Email do Responsável:
          <input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange}  />
        </label>

        {/* ⚕️ Doença crônica */}
        <div className="linha-radio">
          <label>Possui doença crônica?</label>
          <label><input type="radio" name="possuiDoenca" value="sim"
            checked={formData.possuiDoenca === 'sim'} onChange={handleChange} /> Sim</label>
          <label><input type="radio" name="possuiDoenca" value="nao"
            checked={formData.possuiDoenca === 'nao'} onChange={handleChange} /> Não</label>
        </div>

        {formData.possuiDoenca === 'sim' && (
          <>
            <label>Qual(is) doença(s)?
              <input type="text" name="qualDoenca" value={formData.qualDoenca} onChange={handleChange}  />
            </label>
            <label>Medicação necessária:
              <input type="text" name="medicacao" value={formData.medicacao} onChange={handleChange}  />
            </label>
          </>
        )}

        {/* 🧾 Checkboxes extras */}
        <div className="checkbox-group">
          <label><input type="checkbox" name="autorizacaoImagem"
            checked={formData.autorizacaoImagem} onChange={handleChange} /> Autorização de uso de imagem</label>

          <label><input type="checkbox" name="atividadesExtras"
            checked={formData.atividadesExtras} onChange={handleChange} /> Participa de atividades extras</label>
          {formData.atividadesExtras && (
            <label>Quais?
              <input type="text" name="descricaoAtividadesExtras"
                value={formData.descricaoAtividadesExtras} onChange={handleChange}  />
            </label>
          )}

          <label><input type="checkbox" name="necessidadesEspeciais"
            checked={formData.necessidadesEspeciais} onChange={handleChange} /> Possui necessidades especiais</label>
          {formData.necessidadesEspeciais && (
            <label>Descreva:
              <input type="text" name="descricaoNecessidadesEspeciais"
                value={formData.descricaoNecessidadesEspeciais} onChange={handleChange}  />
            </label>
          )}
        </div>

      
        <div className="botoes">
          <button type="submit"className="btn-salvar"disabled={loading}>
               {loading ? "Salvando Dados" : "SALVAR"}
          </button>
          <button type="button" className="btn-voltar" 
              onClick={handleVoltar}>FECHAR</button>
        </div>
      </form>
    </div>
  );
}

export default FormCadAluno;
