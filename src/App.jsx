
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './Styles/styles.css';

import { AuthProvider } from './Context/AuthContext';
import RotasPrivadas from './Context/RotaPrivada';

import MenuBar from '././Componentes/MenuBar/NavBar';
import Cabecalho from '././Componentes/Cabecalho';
import CabecalhoUsuario from '././Componentes/CabecalhoUsuario/CabecalhoUsuario';

//  PAGINAS  PUBLICAS

import Login from './Componentes/Login/Login';
import Equipe from './Paginas/Equipe';
import Galeria from './Paginas/Galeria';
import Home from './Paginas/Home';
import Missao from './Paginas/Missao';
import Danca from './Paginas/Oficinas/Danca';
import Instrumental from './Paginas/Oficinas/Instrumental';
import Musicalizacao from './Paginas/Oficinas/Musicalizacao';
import Percussao from './Paginas/Oficinas/Percussao';
import Partituras from './Paginas/Galeria/Partituras';
import ProCidadania from './Paginas/QuemSomos/ProCidadania';

//  PAGINAS  PRIVADAS

import FormCadAluno from './Componentes/Formulario/FormCadAluno';
import FormCadColaborador from './Componentes/Formulario/FormCadColaborador';
import CadUser from './Componentes/Login/CadUser';
import Telegram from './Componentes/Formulario/GestaoTelegram';


import BibliotecaPartituras from './Paginas/Galeria/Biblioteca';
import Frequencia from './Paginas/FrequenciaAPK/FrequenciaAPK';

import Editaraluno from './Paginas/EditarAlunos/Editaraluno';
import Listaalunos from './Paginas/ListaAlunos/Listaalunos';

import Editarcolaborador from './Paginas/EditarColaborador/Editarcolaborador';
import Listacolaborador from './Paginas/ListaColaborador/Listacolaborador';


import Listapublico from './Paginas/ListaAlunos/Listapublico';
import Documentacao from './Paginas/Documentacao/Documentacao';


import Listausuario from './Paginas/ListaUsuarios/Listausuarios';
import Editarusuario from './Paginas/EditarUsuario/Editarusuarios';


function App() {
  return (
    <>
    
    <AuthProvider>

      <BrowserRouter>

        <Cabecalho />
        <CabecalhoUsuario />
        <MenuBar />

        <Routes>

          {/*ROTAS PUBLICAS*/}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/nossos-colaboradores" element={<Equipe />} />
          <Route path="/missao" element={<Missao />} />
          <Route path="/musicalizacao" element={<Musicalizacao />} />
          <Route path="/percussao" element={<Percussao />} />
          <Route path="/instrumental" element={<Instrumental />} />
          <Route path="/danca" element={<Danca />} />
          <Route path="/partituras"element={<Partituras />}/>
          <Route path="/quemsomos"element={<ProCidadania />}/>
         
                {/*   ROTAS PRIVADAS*/}

          <Route
            path="/listapublico"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB', 'ESTAG', 'PROF' ]}>
                 <Listapublico />
              </RotasPrivadas>
            }
          />


          <Route
            path="/biblioteca"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <BibliotecaPartituras />
              </RotasPrivadas>
            }
          />

           <Route
            path="/telegram"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Telegram />
              </RotasPrivadas>
            }
          />

          <Route
            path="/form-frequencia"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Frequencia />
              </RotasPrivadas>
            }
          />

          <Route
            path="/documentacao"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Documentacao />
              </RotasPrivadas>
            }
          />

          <Route
            path="/cadastro-aluno"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <FormCadAluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/cadastro-colaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <FormCadColaborador />
              </RotasPrivadas>
            }
          />

         
          <Route
            path="/listaalunos"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Listaalunos />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-aluno/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Editaraluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/listacolaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Listacolaborador />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-colaborador/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                <Editarcolaborador />
              </RotasPrivadas>
            }
          />

          
          <Route
            path="/cadastro-usuarios"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <CadUser />
              </RotasPrivadas>
            }
          />


          <Route
            path="/listausuario"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Listausuario />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-usuario/:id"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Editarusuario />
              </RotasPrivadas>
            }
          />  

        </Routes>

      </BrowserRouter>

    </AuthProvider>
 
      </>
    );
}

export default App;

