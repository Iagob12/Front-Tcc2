import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Header";
import Footer from "../../Footer";
import { apiGet, apiPost } from "../../../config/api";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from '../../Toast/useToast';
import ToastContainer from '../../Toast/ToastContainer';
import { FaCalendarAlt, FaClock, FaArrowLeft, FaUser, FaPaperPlane } from "react-icons/fa";
import "../../../styles/Blog/blog-detalhes/style.css";

const BlogDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [blog, setBlog] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  useEffect(() => {
    carregarBlog();
    carregarComentarios();
  }, [id]);

  const carregarBlog = async () => {
    try {
      const response = await apiGet(`/blog/buscar/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        toast.error("Erro ao carregar o blog.");
        navigate("/blog");
      }
    } catch (error) {
      console.error("Erro ao carregar blog:", error);
      toast.error("Erro ao carregar o blog.");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const carregarComentarios = async () => {
    try {
      const response = await apiGet(`/comentario/blog/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComentarios(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarDataComentario = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: data.getFullYear() !== agora.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Você precisa estar logado para comentar.");
      navigate("/login");
      return;
    }

    if (!novoComentario.trim()) {
      toast.warning("Por favor, escreva um comentário.");
      return;
    }

    setEnviandoComentario(true);

    try {
      const response = await apiPost('/comentario/postar', {
        idBlog: parseInt(id),
        idUsuario: user?.id,
        comentario: novoComentario.trim()
      });

      if (response.ok) {
        toast.success("Comentário enviado com sucesso!");
        setNovoComentario("");
        carregarComentarios();
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao enviar comentário.");
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      toast.error("Erro ao enviar comentário. Tente novamente.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="blog-detalhes-container">
          <div className="blog-detalhes-loading">
            <p>Carregando...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="blog-detalhes-container">
        <div className="blog-detalhes-content">
          <button className="btn-voltar" onClick={() => navigate("/blog")}>
            <FaArrowLeft /> Voltar
          </button>

          <article className="blog-detalhes-article">
            <h1 className="blog-detalhes-titulo">{blog.tituloMateria}</h1>

            <div className="blog-detalhes-meta">
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{formatarData(blog.dataPostagem)}</span>
              </div>
            </div>

            {blog.urlNoticia && (
              <div className="blog-detalhes-imagem">
                <img
                  src={
                    blog.urlNoticia.startsWith('data:') ||
                      (blog.urlNoticia.length > 100 && /^[A-Za-z0-9+/=]+$/.test(blog.urlNoticia.replace(/\s/g, '')))
                      ? (blog.urlNoticia.startsWith('data:') ? blog.urlNoticia : `data:image/jpeg;base64,${blog.urlNoticia}`)
                      : blog.urlNoticia
                  }
                  alt={blog.tituloMateria}
                  loading="lazy"
                />
              </div>
            )}

            <div className="blog-detalhes-texto">
              <p>{blog.informacao}</p>
            </div>
          </article>

          <section className="blog-comentarios-section">
            <h2 className="comentarios-titulo">
              Comentários ({comentarios.length})
            </h2>

            {isAuthenticated ? (
              <form className="comentario-form" onSubmit={handleEnviarComentario}>
                <div className="comentario-input-wrapper">
                  <textarea
                    className="comentario-input"
                    placeholder="Escreva seu comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    rows="3"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="btn-enviar-comentario"
                    disabled={enviandoComentario || !novoComentario.trim()}
                  >
                    <FaPaperPlane />
                    {enviandoComentario ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="comentario-login-prompt">
                <p>Faça <button onClick={() => navigate("/login")}>login</button> para comentar.</p>
              </div>
            )}

            <div className="comentarios-lista">
              {comentarios.length === 0 ? (
                <div className="sem-comentarios">
                  <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                </div>
              ) : (
                comentarios.map((comentario) => (
                  <div key={comentario.id} className="comentario-item">
                    <div className="comentario-header">
                      <div className="comentario-avatar">
                        {comentario.imagemPerfilUsuario ? (
                          <img 
                            src={comentario.imagemPerfilUsuario} 
                            alt={`Foto de ${comentario.nomeUsuario}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comentario.nomeUsuario) + '&background=B20000&color=fff&size=128';
                            }}
                          />
                        ) : (
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comentario.nomeUsuario)}&background=B20000&color=fff&size=128`}
                            alt={`Avatar de ${comentario.nomeUsuario}`}
                          />
                        )}
                      </div>
                      <div className="comentario-info">
                        <span className="comentario-usuario">
                          {comentario.nomeUsuario}
                        </span>
                        <span className="comentario-data">
                          {formatarDataComentario(comentario.dataComentario)}
                        </span>
                      </div>
                    </div>
                    <div className="comentario-texto">
                      <p>{comentario.comentario}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetalhes;
