import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PageSistemaAprovacao/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MobileWarning from "../MobileWarning";
import CardBlog from "../../components/Cards/SistemaAprovacaoCards/AprovarBlog";
import CardVoluntario from "../../components/Cards/SistemaAprovacaoCards/AprovarVoluntario";
import { apiGet, apiPut, apiDelete } from "../../config/api";
import { useToast } from '../../components/Toast/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import defaultImg from "../../assets/default-imgs/default-img.png";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SistemaAprovacao = () => {
  const [seletor, setSeletor] = useState("");
  const [blogsPendentes, setBlogsPendentes] = useState([]);
  const [voluntariosPendentes, setVoluntariosPendentes] = useState([]);
  const [voluntariosAprovados, setVoluntariosAprovados] = useState([]);
  const [loadingBlogId, setLoadingBlogId] = useState(null);
  const [loadingVoluntarioId, setLoadingVoluntarioId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchBlogsPendentes = async () => {
    try {
      const response = await apiGet("/blog/pendentes");
      if (response.ok) {
        const data = await response.json();
        setBlogsPendentes(data);
      } else {
        console.error("Erro ao buscar blogs pendentes");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  const fetchVoluntariosPendentes = async () => {
    try {
      const response = await apiGet("/voluntario/listar/pendentes");
      if (response.ok) {
        const data = await response.json();
        setVoluntariosPendentes(data);
      } else {
        console.error("Erro ao buscar voluntários pendentes");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  const fetchVoluntariosAprovados = async () => {
    try {
      const response = await apiGet("/voluntario/listar/aprovados");
      if (response.ok) {
        const data = await response.json();
        setVoluntariosAprovados(data);
      } else {
        console.error("Erro ao buscar voluntários aprovados");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  const handleRemoverVoluntario = async (voluntarioId, nomeVoluntario, e) => {
    e.stopPropagation();
    if (!window.confirm(`Tem certeza que deseja remover ${nomeVoluntario} como voluntário?`)) {
      return;
    }
    setLoadingVoluntarioId(voluntarioId);
    try {
      const response = await apiPut(`/voluntario/admin/remover-voluntario/${voluntarioId}`);
      if (response.ok) {
        toast.success("Voluntário removido com sucesso!");
        fetchVoluntariosAprovados();
      } else {
        toast.error("Erro ao remover o voluntário.");
      }
    } catch (error) {
      console.error("Erro ao remover voluntário:", error);
      toast.error("Erro ao remover o voluntário.");
    } finally {
      setLoadingVoluntarioId(null);
    }
  };

  const handleAprovarBlog = async (blogId, e) => {
    e.stopPropagation();
    setLoadingBlogId(blogId);
    try {
      const response = await apiPut(`/blog/aprovar/${blogId}`);
      if (response.ok) {
        toast.success("Blog aprovado com sucesso!");
        fetchBlogsPendentes();
      } else {
        toast.error("Erro ao aprovar o blog.");
      }
    } catch (error) {
      console.error("Erro ao aprovar blog:", error);
      toast.error("Erro ao aprovar o blog.");
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleRejeitarBlog = async (blogId, e) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja rejeitar este blog? Esta ação não pode ser desfeita.")) {
      return;
    }
    setLoadingBlogId(blogId);
    try {
      const response = await apiDelete(`/blog/negar/${blogId}`);
      if (response.ok) {
        toast.success("Blog rejeitado e removido com sucesso!");
        fetchBlogsPendentes();
      } else {
        toast.error("Erro ao rejeitar o blog.");
      }
    } catch (error) {
      console.error("Erro ao rejeitar blog:", error);
      toast.error("Erro ao rejeitar o blog.");
    } finally {
      setLoadingBlogId(null);
    }
  };

  const handleAprovarVoluntario = async (voluntarioId, e) => {
    e.stopPropagation();
    setLoadingVoluntarioId(voluntarioId);
    try {
      const response = await apiPut(`/voluntario/aprovar/${voluntarioId}`);
      if (response.ok) {
        toast.success("Voluntário aprovado com sucesso!");
        fetchVoluntariosPendentes();
      } else {
        toast.error("Erro ao aprovar o voluntário.");
      }
    } catch (error) {
      console.error("Erro ao aprovar voluntário:", error);
      toast.error("Erro ao aprovar o voluntário.");
    } finally {
      setLoadingVoluntarioId(null);
    }
  };

  const handleRejeitarVoluntario = async (voluntarioId, e) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja rejeitar este voluntário? Esta ação não pode ser desfeita.")) {
      return;
    }
    setLoadingVoluntarioId(voluntarioId);
    try {
      const response = await apiPut(`/voluntario/cancelar/${voluntarioId}`);
      if (response.ok) {
        toast.success("Solicitação de voluntário rejeitada com sucesso!");
        fetchVoluntariosPendentes();
      } else {
        toast.error("Erro ao rejeitar o voluntário.");
      }
    } catch (error) {
      console.error("Erro ao rejeitar voluntário:", error);
      toast.error("Erro ao rejeitar o voluntário.");
    } finally {
      setLoadingVoluntarioId(null);
    }
  };

  useEffect(() => {
    if (seletor === "BLOGS") {
      fetchBlogsPendentes();
    } else if (seletor === "VOLUNTARIOS") {
      fetchVoluntariosPendentes();
    } else if (seletor === "VOLUNTARIOS_APROVADOS") {
      fetchVoluntariosAprovados();
    }
  }, [seletor]);

  return (
    <>
      <Header />
      <MobileWarning pageName="Sistema de Aprovação" />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="container-sistema-aprovacao">
        <section className="dashboard-sistema">
          <div className="cabecalho-sistema-aprovacao">
            <h1>Sistema de Aprovação</h1>
            <select value={seletor} onChange={(e) => setSeletor(e.target.value)}>
              <option value="" disabled hidden>
                Selecione uma opção
              </option>
              <option value="BLOGS">Blog</option>
              <option value="VOLUNTARIOS">Voluntários Pendentes</option>
              <option value="VOLUNTARIOS_APROVADOS">Gerenciar Voluntários</option>
            </select>
          </div>

          <section className="lista-aprovar">
            {/* Blogs Pendentes */}
            {seletor === "BLOGS" && (
              <>
                {blogsPendentes.length > 0 ? (
                  blogsPendentes.map((blog, index) => (
                    <div key={index} className="blog-card-wrapper">
                      <div
                        onClick={() =>
                          navigate(`/sistema-aprovacao/detalhes-blog/${blog.id}`, {
                            state: { showButtons: true },
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <CardBlog
                          img={blog.urlNoticia}
                          nomeUsuario={blog.idUsuario.nome}
                          titulo={blog.tituloMateria}
                          conteudo={blog.informacao}
                          data={formatDate(blog.dataPostagem)}
                        />
                      </div>
                      <div className="blog-actions">
                        <button 
                          className="btn-aprovar"
                          onClick={(e) => handleAprovarBlog(blog.id, e)}
                          disabled={loadingBlogId === blog.id}
                        >
                          {loadingBlogId === blog.id ? "Aprovando..." : "✓ Aprovar"}
                        </button>
                        <button 
                          className="btn-rejeitar"
                          onClick={(e) => handleRejeitarBlog(blog.id, e)}
                          disabled={loadingBlogId === blog.id}
                        >
                          {loadingBlogId === blog.id ? "Rejeitando..." : "✗ Rejeitar"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="sem-solicitacoes">
                    Não há blogs pendentes no momento!
                  </p>
                )}
              </>
            )}

            {/* Voluntários Pendentes */}
            {seletor === "VOLUNTARIOS" && (
              <>
                {voluntariosPendentes.length > 0 ? (
                  voluntariosPendentes.map((voluntario, index) => (
                    <div key={index} className="voluntario-card-wrapper">
                      <div
                        onClick={() => navigate(`/sistema-aprovacao/detalhes-voluntario/${voluntario.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <CardVoluntario
                          fotoPerfil={defaultImg}
                          descricao={voluntario.descricao}
                          nomeVoluntario={voluntario.idUsuario.nome}
                        />
                      </div>
                      <div className="voluntario-actions">
                        <button 
                          className="btn-aprovar"
                          onClick={(e) => handleAprovarVoluntario(voluntario.id, e)}
                          disabled={loadingVoluntarioId === voluntario.id}
                        >
                          {loadingVoluntarioId === voluntario.id ? "Aprovando..." : "✓ Aprovar"}
                        </button>
                        <button 
                          className="btn-rejeitar"
                          onClick={(e) => handleRejeitarVoluntario(voluntario.id, e)}
                          disabled={loadingVoluntarioId === voluntario.id}
                        >
                          {loadingVoluntarioId === voluntario.id ? "Rejeitando..." : "✗ Rejeitar"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="sem-solicitacoes">
                    Não há solicitações de voluntários no momento!
                  </p>
                )}
              </>
            )}

            {/* Voluntários Aprovados - Gerenciar */}
            {seletor === "VOLUNTARIOS_APROVADOS" && (
              <>
                {voluntariosAprovados.length > 0 ? (
                  <div className="tabela-voluntarios-container">
                    <table className="tabela-voluntarios-aprovacao">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Telefone</th>
                          <th>CPF</th>
                          <th>Data Cadastro</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voluntariosAprovados.map((voluntario) => (
                          <tr key={voluntario.id}>
                            <td>{voluntario.idUsuario?.nome || 'N/A'}</td>
                            <td>{voluntario.idUsuario?.email || 'N/A'}</td>
                            <td>{voluntario.telefone || 'N/A'}</td>
                            <td>{voluntario.cpf || 'N/A'}</td>
                            <td>{formatDate(voluntario.dataVoluntario)}</td>
                            <td>
                              <button 
                                className="btn-remover-tabela"
                                onClick={(e) => handleRemoverVoluntario(voluntario.id, voluntario.idUsuario?.nome, e)}
                                disabled={loadingVoluntarioId === voluntario.id}
                              >
                                {loadingVoluntarioId === voluntario.id ? "Removendo..." : "✕ Remover"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="sem-solicitacoes">
                    Não há voluntários aprovados no momento!
                  </p>
                )}
              </>
            )}
          </section>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SistemaAprovacao;
