
// DocumentoFrequenciaPDF.tsx
// 1. Importamos o componente Image do @react-pdf/renderer
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Definição dos meses para o PDF
const nomesMeses = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Estilização formal adequada para documentação institucional
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#333333",
    lineHeight: 1.6,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#0a0a0a", 
    paddingBottom: 10,
    marginBottom: 20,
    // Ajustado para alinhar a logo e os textos lado a lado
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  headerTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    width: 45,
    height: 45,
    objectFit: "contain",
  },
  institutionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  docType: {
    fontSize: 10,
    color: "#666666",
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  studentInfoBox: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    width: 90,
    fontWeight: "bold",
    color: "#555555",
  },
  infoValue: {
    flex: 1,
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 3,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
  },
  colMonth: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  colDays: {
    width: "70%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
  },
});

interface PDFProps {
  aluno: {
    matricula: string;
    nome: string;
    oficinas: string;
  };
  dadosFrequencia: {
    meses: Array<{ mes: number; dias: number[] }>;
  } | null;
  oficinasFormatadas: string;
}

export function DocumentoFrequenciaPDF({ aluno, dadosFrequencia, oficinasFormatadas }: PDFProps) {
  const anoAtual = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho Institucional com o Logo ao lado */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/Assets/img/Logo_Apoio/ProCidadania.png" 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.institutionName}>Associação Pró-Cidadania</Text>
            <Text style={styles.docType}>Sistema de Registro da Frequência e Monitoramento de Oficinas</Text>
          </View>
        </View>

        {/* Título do Documento */}
        <Text style={styles.title}>Relatório Oficial de Frequência — Ano Letivo {anoAtual}</Text>

        {/* Informações Prévias do Aluno */}
        <View style={styles.studentInfoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aluno(a):</Text>
            <Text style={styles.infoValue}>{aluno.nome}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Matrícula:</Text>
            <Text style={styles.infoValue}>{aluno.matricula || "Não informada"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Oficina(s):</Text>
            <Text style={styles.infoValue}>{oficinasFormatadas || "Nenhuma cadastrada"}</Text>
          </View>
        </View>

        {/* Histórico Analítico */}
        <Text style={styles.sectionTitle}>Histórico de Presenças Mensais</Text>
        
        <View style={styles.table}>
          {/* Cabeçalho da Tabela */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.colMonth}>
              <Text style={styles.tableCellHeader}>Mês</Text>
            </View>
            <View style={styles.colDays}>
              <Text style={styles.tableCellHeader}>Dias de Comparecimento</Text>
            </View>
          </View>

          {/* Linhas de Dados */}
          {dadosFrequencia?.meses && dadosFrequencia.meses.length > 0 ? (
            dadosFrequencia.meses.map((mes) => (
              <View style={styles.tableRow} key={mes.mes}>
                <View style={styles.colMonth}>
                  <Text style={styles.tableCell}>{nomesMeses[mes.mes]}</Text>
                </View>
                <View style={styles.colDays}>
                  <Text style={styles.tableCell}>
                    {mes.dias && mes.dias.length > 0 ? mes.dias.join(", ") : "Sem registros no período"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <View style={{ width: "100%", padding: 10 }}>
                <Text style={{ textAlign: "center", color: "#777" }}>Nenhum registro de chamada encontrado.</Text>
              </View>
            </View>
          )}
        </View>

        {/* Rodapé Padrão */}
        <Text style={styles.footer}>
          Documento gerado automaticamente em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")} | Associação Pró-Cidadania
        </Text>
      </Page>
    </Document>
  );
}
