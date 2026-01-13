
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './Styles/styles.css';

import { AuthProvider } from './Context/AuthContext';
import RotasPrivadas from './Context/RotaPrivada';



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


//  PAGINAS  PRIVADAS

import FormCadAluno from './Componentes/Formulario/FormCadAluno';
import FormCadColaborador from './Componentes/Formulario/FormCadColaborador';
import CadUser from './Componentes/Login/CadUser';


import BibliotecaPartituras from './Paginas/Galeria/Biblioteca';
import Partituras from './Paginas/Galeria/Partituras';


import Editaraluno from './Paginas/EditarAlunos/Editaraluno';
import Listaalunos from './Paginas/ListaAlunos/Listaalunos';

import Editarcolaborador from './Paginas/EditarColaborador/Editarcolaborador';
import Listacolaborador from './Paginas/ListaColaborador/Listacolaborador';


import Listapublico from './Paginas/ListaAlunos/Listapublico';


import Listausuario from './Paginas/ListaUsuarios/Listausuarios';
import Editarusuario from './Paginas/EditarUsuario/Editarusuarios';

/*   CONSTRUÇÃO DA ROTAS DAS PAGINAS ESTA DIVIDADAS ASSIM

ROTAS PÚBLICAS

ROTAS PRIVADAS – QUALQUER USUÁRIO LOGADO

ROTAS PRIVADAS – SOMENTE ADMIN

ROTAS PRIVADAS – ADMIN E COLAB


ROTAS PRIVADAS – QUALQUER USUÁRIO LOGADO ALUNO , COLADORADOR E ADMINISTARDOR

           <Route
            path="/partituras"
            element={
              <RotasPrivadas>
                <Partituras />
              </RotasPrivadas>
            }
          />

          ROTAS PRIVADAS - SÓ PARA COLABORADORES E ADMINISTRADOR

          <Route
            path="/Listapublico"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                 <Listapublico />
              </RotasPrivadas>
            }
          />

          ROTAS PRIVADAS – SO PARA ADMINISTRADOR 

          <Route
            path="/biblioteca"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <BibliotecaPartituras />
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
            path="/cadastro-aluno"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <FormCadAluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/cadastro-colaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <FormCadColaborador />
              </RotasPrivadas>
            }
          />

         
          <Route
            path="/listaalunos"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Listaalunos />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-aluno/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Editaraluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/listacolaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Listacolaborador />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-colaborador/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Editarcolaborador />
              </RotasPrivadas>
            }
          />

          <Route
            path="/Listausuario"
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
                <Listausuario />
              </RotasPrivadas>
            }
          />


*/

function App() {
  return (
    <>
    
    <AuthProvider>

      <BrowserRouter>

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
         
                {/*   ROTAS PRIVADAS*/}

           <Route
            path="/partituras"
            element={
              <RotasPrivadas>
                <Partituras />
              </RotasPrivadas>
            }
          />


          <Route
            path="/Listapublico"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN', 'COLAB']}>
                 <Listapublico />
              </RotasPrivadas>
            }
          />


          <Route
            path="/biblioteca"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <BibliotecaPartituras />
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
            path="/cadastro-aluno"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <FormCadAluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/cadastro-colaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <FormCadColaborador />
              </RotasPrivadas>
            }
          />

         
          <Route
            path="/listaalunos"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Listaalunos />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-aluno/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Editaraluno />
              </RotasPrivadas>
            }
          />

          <Route
            path="/listacolaborador"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Listacolaborador />
              </RotasPrivadas>
            }
          />

          <Route
            path="/editar-colaborador/:matricula"
            element={
              <RotasPrivadas perfisPermitidos={['ADMIN']}>
                <Editarcolaborador />
              </RotasPrivadas>
            }
          />

          <Route
            path="/Listausuario"
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
                <Listausuario />
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

            
     /*       
            <Route
            path="/partituras"
            element={<Partituras />}/>
            

            <Route path="/Listapublico" 
            element={ <Listapublico />}/>


         
           <Route path="/biblioteca"
            element={ <BibliotecaPartituras />}/>


          <Route path="/cadastro-aluno" element={
          <FormCadAluno />} /> 
          <Route path="/cadastro-colaborador" element={
          <FormCadColaborador />} /> 
          <Route path="/cadastro-usuarios" element={
          <CadUser />} />


          <Route path="/Listaalunos" element={
          <Listaalunos />} />
          <Route path="/editar-aluno/:matricula" element={
          <Editaraluno />} />


          <Route path="/Listacolaborador" element={
          <Listacolaborador />} />
          <Route path="/editar-colaborador/:matricula" element={
          <Editarcolaborador />} />

          
          <Route path="/Listausuario" element={
          <Listausuario />} />
          <Route path="/editar-usuario/:id" element={
          <Editarusuario />} />
       
       
          */