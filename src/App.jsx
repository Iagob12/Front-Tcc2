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
import CancelarVoluntariado from "./pages/CancelarVoluntariado";
import GerenciarVoluntarios from "./pages/GerenciarVoluntarios";
import SerVoluntario from "./components/SerVoluntario";
import DashboardVoluntario from "./pages/DashBoardVoluntario";
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
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/adicionar-noticia" element={<ProtectedRoute><AdicionarNoticia /></ProtectedRoute>} />
        
        {/* Rotas Admin - Eventos e Atividades */}
        <Route path="/adicionar-evento" element={<AdminRoute><AdicionarEvento /></AdminRoute>} />
        <Route path="/editar-evento/:id" element={<AdminRoute><AdicionarEvento /></AdminRoute>} />
        <Route path="/adicionar-atividade" element={<AdminRoute><AdicionarAtividade /></AdminRoute>} />
        <Route path="/atividades/editar/:id" element={<AdminRoute><AdicionarAtividade /></AdminRoute>} />

        {/* Voluntariado */}
        <Route path="/ser-voluntario" element={<ProtectedRoute><SerVoluntario /></ProtectedRoute>} />
        <Route path="/cancelar-voluntariado" element={<ProtectedRoute><CancelarVoluntariado /></ProtectedRoute>} />
        <Route path="/dashboard-voluntario" element={<ProtectedRoute><DashboardVoluntario /></ProtectedRoute>} />
        
        {/* Rotas Admin - Gerenciamento */}
        <Route path="/gerenciar-voluntarios" element={<AdminRoute><GerenciarVoluntarios /></AdminRoute>} />
        <Route path="/sistema-aprovacao" element={<AdminRoute><PageSistemaAprovacao /></AdminRoute>} />
        <Route path="/sistema-aprovacao/detalhes-blog/:id" element={<AdminRoute><BlogDetails /></AdminRoute>} />
        <Route path="/sistema-aprovacao/detalhes-voluntario/:id" element={<AdminRoute><VoluntarioDetails /></AdminRoute>} />
        <Route path="/gerenciar-inscricoes" element={<AdminRoute><PageGerenciarInscricoes /></AdminRoute>} />
        <Route path="/gerenciar-relatorios" element={<AdminRoute><PageRelatorios /></AdminRoute>} />
      </Routes>
    </>
  );
};

export default App;