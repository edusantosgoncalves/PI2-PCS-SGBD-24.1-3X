import React from 'react';
import ReactDOM from 'react-dom/client';
import './bootstrap.min.css';
import './config.css';

// ! Criando rotas
import { Routes, BrowserRouter, Link, Route } from 'react-router-dom';

// ! Importando páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ValidarUsuario from './pages/ValidarUsuario';
import CadastroPage from './pages/CadastroPage';
import AlterarDadosPage from './pages/AlterarDadosPage';
import UsuarioAdm from './pages/Usuarios/UsuarioAdm';
import TimesView from './pages/Times/TimesView';
import UsuarioAlterar from './pages/Usuarios/UsuarioAlterar';
import UsuarioCriar from './pages/Usuarios/UsuarioCriar';
import CriarTimePage from './pages/Times/TimesCriar';
import AlterarTimePage from './pages/Times/TimesAlterar';
import DetalharTimePage from './pages/Times/TimesDetalhar';
import TarefasAdm from './pages/Tarefas/TarefasAdm';
import TarefasMinhas from './pages/Tarefas/TarefasMinhas';
import TarefasDetalhar from './pages/Tarefas/TarefasDetalhar';
import TarefasSeguidas from './pages/Tarefas/TarefasSeguidas';
import CriarTarefaPage from './pages/Tarefas/TarefasCriar';
import TarefasAlterar from './pages/Tarefas/TarefasAlterar';
import ProjetosView from './pages/Projetos/ProjetosView';
import ProjetosDetalhar from './pages/Projetos/ProjetosDetalhar';
import TarefasProjeto from './pages/Tarefas/TarefasProjeto';
import ProjetosCriar from './pages/Projetos/ProjetosCriar'
import ProjetosAlterar from './pages/Projetos/ProjetosAlterar';
import UsuarioPerfil from './pages/Usuarios/UsuarioPerfil';
import Avaliacoes from './pages/Avaliacoes/Avaliacoes';
import UsuarioSeguidos from './pages/Usuarios/UsuarioSeguidos';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <meta name="referrer" content="no-referrer" />
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/validarusu" element={<ValidarUsuario />}></Route>
        <Route path="/cadastro" element={<CadastroPage />}></Route>
        <Route path="/alterardados" element={<AlterarDadosPage />}></Route>

        {/* Caminhos para pags Usuario */}
        <Route path="/usuarios-adm" element={<UsuarioAdm />}></Route>
        <Route path="/usuarios-adm/alterar" element={<UsuarioAlterar />}></Route>
        <Route path="/usuarios-adm/criar" element={<UsuarioCriar />}></Route>
        <Route path="/usuarios/seguidos" element={<UsuarioSeguidos />}></Route>
        <Route path="/perfil/" element={<UsuarioPerfil />}></Route>
        <Route path="/avaliacoes" element={<Avaliacoes />}></Route>


        {/* Caminhos para pags Time */}
        <Route path="/times-adm/criar-time" element={<CriarTimePage />}></Route>
        <Route path="/times-adm/alterar-time" element={<AlterarTimePage />}></Route>
        <Route path="/times" element={<TimesView />}></Route>
        <Route path="/times/detalhar" element={<DetalharTimePage />}></Route>


        {/* Caminhos para pags Tarefas */}
        <Route path="/tarefas/adm" element={<TarefasAdm />}></Route>
        <Route path="/tarefas/" element={<TarefasMinhas />}></Route>
        <Route path="/tarefas/detalhar" element={<TarefasDetalhar />}></Route>
        <Route path="/tarefas/seguidas" element={<TarefasSeguidas />}></Route>
        <Route path="/tarefas/criar" element={<CriarTarefaPage />}></Route>
        <Route path="/tarefas/alterar" element={<TarefasAlterar />}></Route>

        {/* Caminhos para pags Projeto */}
        <Route path="/projetos" element={<ProjetosView />}></Route>
        <Route path="/projetos/criar" element={<ProjetosCriar />}></Route>
        <Route path="/projetos/detalhar" element={<ProjetosDetalhar />}></Route>
        <Route path="/projetos/alterar" element={<ProjetosAlterar />}></Route>
        <Route path="/projetos/tarefas" element={<TarefasProjeto />}></Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals