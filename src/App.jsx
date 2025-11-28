import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from "./pages/Home";
import Eventos from "./pages/Eventos";
import Cadastro from "./pages/Cadastro";
import EditarPerfil from "./pages/EditarPerfil";
import ComoAjudar from "./pages/ComoAjudar";
import Login from "./pages/Login";
import Tarefas from './pages/Tarefas';
import TornarVoluntario from "./pages/TornarVoluntario";
import SerVoluntario from "./components/SerVoluntario";
import DashboardVoluntario from "./pages/DashboardVoluntario";
import SobreNos from "./pages/SobreNos";
import Blog from "./pages/Blog";
import AdicionarNoticia from "./pages/AdicionarNoticia";
import AdicionarEvento from "./pages/AdicionarEvento";
import AdicionarAtividade from "./pages/AdicionarAtividade";
import OAuth2Callback from "./pages/OAuth2Callback";
import PageSistemaAprovacao from "./pages/SistemaAprovacao";
import PageRelatorios from "./pages/PageRelatorios";
import PageGerenciarInscricoes from "./pages/GerenciarInscricoes";
import BlogDetails from "./components/SistemaAprovacao/BlogDetails";
import BlogDetalhes from "./components/PageBlog/BlogDetalhes";
import VoluntarioDetails from "./components/SistemaAprovacao/VoluntarioDetails";

// Componente para scroll to top ao navegar
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar-se" element={<Cadastro />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/como-ajudar" element={<ComoAjudar />} />
        <Route path="/sobre" element={<SobreNos />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/voluntario" element={<TornarVoluntario />} />
        <Route path="/quero-ser-voluntario" element={<TornarVoluntario />} />
        
        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalhes />} />
        <Route path="/adicionar-noticia" element={<AdicionarNoticia />} />
        <Route path="/adicionar-evento" element={<AdicionarEvento />} />
        <Route path="/editar-evento/:id" element={<AdicionarEvento />} />
        <Route path="/adicionar-atividade" element={<AdicionarAtividade />} />
        <Route path="/atividades/editar/:id" element={<AdicionarAtividade />} />

        {/* Voluntariado */}
        <Route path="/ser-voluntario" element={<SerVoluntario />} />
        <Route path="/dashboard-voluntario" element={<DashboardVoluntario />} /> {/* <-- NOVA ROTA */}
        
        {/* Sistema de aprovação */}
        <Route path="/sistema-aprovacao" element={<PageSistemaAprovacao />} />
        <Route path="/sistema-aprovacao/detalhes-blog/:id" element={<BlogDetails />} />
        <Route path="/sistema-aprovacao/detalhes-voluntario/:id" element={<VoluntarioDetails />} />
        
        {/* Gerenciamento */}
        <Route path="/gerenciar-inscricoes" element={<PageGerenciarInscricoes />} />
        <Route path="/gerenciar-relatorios" element={<PageRelatorios />} />
      </Routes>
    </>
  );
};

export default App;