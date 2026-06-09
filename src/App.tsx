import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import PrivateRoute from "./context/PrivateRoute";

// PUBLIC PAGES
import Home from "./pages/Home";
import QuemSomos from "./pages/QuemSomos";
import Equipe from "./pages/Equipe";
import Missao from "./pages/Missao";
import Login from "./pages/Login";
import Partituras from "./pages/Partituras";

// OFICINAS PAGES
import Danca from "./pages/Oficinas/Danca";
import Instrumental from "./pages/Oficinas/Instrumental";
import Musicalizacao from "./pages/Oficinas/Musicalizacao";
import Percussao from "./pages/Oficinas/Percussao";

// PRIVATE PAGES
import Listapublico from "./pages/Listapublico";
import Biblioteca from "./pages/Biblioteca";
import GestaoTelegram from "./pages/GestaoTelegram";
import Frequencia from "./pages/Frequencia";
import Documentacao from "./pages/Documentacao";
import CadastroAluno from "./pages/CadastroAluno";
import EditarAluno from "./pages/EditarAluno";
import ListaAlunos from "./pages/ListaAlunos";
import CadastroColaborador from "./pages/CadastroColaborador";
import ListaColaborador from "./pages/ListaColaborador";
import EditarColaborador from "./pages/EditarColaborador";

// ADMIN-ONLY PAGES
import CadastroUsuario from "./pages/CadastroUsuario";
import ListaUsuario from "./pages/ListaUsuario";
import EditarUsuario from "./pages/EditarUsuario";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* ROTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quemsomos" element={<QuemSomos />} />
            <Route path="/nossos-colaboradores" element={<Equipe />} />
            <Route path="/missao" element={<Missao />} />
            <Route path="/partituras" element={<Partituras />} />

            {/* OFICINAS */}
            <Route path="/musicalizacao" element={<Musicalizacao />} />
            <Route path="/percussao" element={<Percussao />} />
            <Route path="/instrumental" element={<Instrumental />} />
            <Route path="/danca" element={<Danca />} />

            {/* ROTAS PRIVADAS (PROFESSORES, ESTAGIÁRIOS, COLAB, ADMIN) */}
            <Route
              path="/listapublico"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB", "ESTAG", "PROF"]}>
                  <Listapublico />
                </PrivateRoute>
              }
            />

            {/* ROTAS PRIVADAS ADMINISTRATIVAS (COLAB, ADMIN) */}
            <Route
              path="/biblioteca"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <Biblioteca />
                </PrivateRoute>
              }
            />

            <Route
              path="/telegram"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <GestaoTelegram />
                </PrivateRoute>
              }
            />

            <Route
              path="/form-frequencia"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <Frequencia />
                </PrivateRoute>
              }
            />

            <Route
              path="/documentacao"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <Documentacao />
                </PrivateRoute>
              }
            />

            <Route
              path="/cadastro-aluno"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <CadastroAluno />
                </PrivateRoute>
              }
            />

            <Route
              path="/cadastro-colaborador"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <CadastroColaborador />
                </PrivateRoute>
              }
            />

            <Route
              path="/listaalunos"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <ListaAlunos />
                </PrivateRoute>
              }
            />

            <Route
              path="/editar-aluno/:matricula"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <EditarAluno />
                </PrivateRoute>
              }
            />

            <Route
              path="/listacolaborador"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <ListaColaborador />
                </PrivateRoute>
              }
            />

            <Route
              path="/editar-colaborador/:matricula"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN", "COLAB"]}>
                  <EditarColaborador />
                </PrivateRoute>
              }
            />

            {/* ROTAS EXCLUSIVAS DE ADMIN */}
            <Route
              path="/cadastro-usuarios"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN"]}>
                  <CadastroUsuario />
                </PrivateRoute>
              }
            />

            <Route
              path="/listausuario"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN"]}>
                  <ListaUsuario />
                </PrivateRoute>
              }
            />

            <Route
              path="/editar-usuario/:id"
              element={
                <PrivateRoute perfisPermitidos={["ADMIN"]}>
                  <EditarUsuario />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
