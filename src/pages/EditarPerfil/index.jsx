import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/EditarPerfil/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { apiGet, apiPut } from "../../config/api";
import { useToast } from '../../components/Toast/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.js";
import ImageCropModal from '../../components/PageBlog/ImageCropModal';
import IconUpload from "../../assets/Blog/upload.svg";

const EditarPerfil = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isVoluntario, setIsVoluntario] = useState(false);
  const [voluntarioData, setVoluntarioData] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    fotoPerfil: null
  });
  
  const [voluntarioFormData, setVoluntarioFormData] = useState({
    telefone: "",
    endereco: "",
    descricao: ""
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      
      console.log("🔍 EditarPerfil: Carregando dados do usuário...");
      
      // Carregar dados do usuário logado
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        toast.error("Você precisa estar logado.");
        navigate("/login");
        return;
      }
      
      const responseUsuario = await apiGet(`/usuario/${user.id}`);
      console.log("📡 EditarPerfil: Resposta /usuario:", responseUsuario.status);
      
      if (responseUsuario.ok) {
        const usuario = await responseUsuario.json();
        console.log("✅ EditarPerfil: Dados carregados:", usuario);
        
        setFormData({
          nome: usuario.nome || "",
          fotoPerfil: usuario.imagemPerfil || null
        });
        
        if (usuario.imagemPerfil) {
          setImagePreview(usuario.imagemPerfil);
        }
        
        // Verificar se é voluntário APROVADO
        try {
          const responseVoluntario = await apiGet(`/voluntario/usuario/${user.id}`);
          if (responseVoluntario.ok) {
            const voluntario = await responseVoluntario.json();
            // Só mostrar campos de voluntário se estiver APROVADO
            if (voluntario.status === 'APROVADO') {
              setIsVoluntario(true);
              setVoluntarioData(voluntario);
              setVoluntarioFormData({
                telefone: voluntario.telefone || "",
                endereco: voluntario.endereco || "",
                descricao: voluntario.descricao || ""
              });
            } else {
              setIsVoluntario(false);
            }
          }
        } catch (error) {
          // Não é voluntário ou ainda não foi aprovado
          setIsVoluntario(false);
        }
      } else {
        console.error("❌ EditarPerfil: Erro ao carregar perfil, status:", responseUsuario.status);
        
        toast.error("Erro ao carregar dados do perfil.");
        
        // Não redirecionar automaticamente, deixar o usuário decidir
      }
    } catch (error) {
      console.error("❌ EditarPerfil: Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do perfil.");
      
      // Aguarda 2 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } finally {
      setLoadingData(false);
    }
  };

  const handleImageChange = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("A imagem deve ter no máximo 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImageToCrop(imageUrl);
    setImageFile(file);
    setShowCropModal(true);
  }, [toast]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  }, [handleImageChange]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCropComplete = (croppedImageBlob) => {
    const imageUrl = URL.createObjectURL(croppedImageBlob);
    setImagePreview(imageUrl);
    setImageFile(croppedImageBlob);
    setShowCropModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagemPerfilUrl = formData.fotoPerfil;

      // Se houver nova imagem, fazer upload primeiro
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/upload/image`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadFormData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imagemPerfilUrl = uploadData.url;
        } else {
          toast.error("Erro ao fazer upload da imagem.");
          setLoading(false);
          return;
        }
      }

      // Preparar dados para enviar
      const dadosPerfil = {
        nome: formData.nome,
        imagemPerfil: imagemPerfilUrl
      };

      // Se for voluntário, adicionar telefone e endereço
      if (isVoluntario) {
        dadosPerfil.telefone = voluntarioFormData.telefone;
        dadosPerfil.endereco = voluntarioFormData.endereco;
      }

      const responseUsuario = await apiPut("/usuario/editar-perfil", dadosPerfil);
      if (responseUsuario.ok) {
        // Atualizar dados do usuário no localStorage (user e userData)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Atualizar ambos os objetos
        user.nome = formData.nome;
        user.imagemPerfil = imagemPerfilUrl;
        userData.nome = formData.nome;
        userData.imagemPerfil = imagemPerfilUrl;
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Atualizar dados do usuário no contexto
        await checkAuth();
        
        toast.success("Perfil atualizado com sucesso!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const error = await responseUsuario.json();
        toast.error(error.message || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Header />
        <div className="container-editar-perfil">
          <div className="content-editar-perfil">
            <p>Carregando...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="container-editar-perfil">
        <div className="content-editar-perfil">
          <h1>Editar Perfil</h1>
          
          <form className="form-editar-perfil" onSubmit={handleSubmit}>
            {/* Foto de Perfil */}
            <div className="form-field">
              <label className="label-editar-perfil">Foto de Perfil (Opcional)</label>
              <div
                className="upload-area-perfil"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="preview-wrapper-perfil">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, fotoPerfil: null }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-perfil">
                    <img src={IconUpload} alt="Upload" />
                    <p>Clique ou arraste uma imagem aqui</p>
                    <span>PNG, JPG até 5MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Nome */}
            <div className="form-field">
              <label className="label-editar-perfil" htmlFor="nome">
                Nome *
              </label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
                placeholder="Digite seu nome"
              />
            </div>

            {/* Campos do Voluntário */}
            {isVoluntario && (
              <>
                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="telefone">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    value={voluntarioFormData.telefone}
                    onChange={(e) => setVoluntarioFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="endereco">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    value={voluntarioFormData.endereco}
                    onChange={(e) => setVoluntarioFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    placeholder="Digite seu endereço completo"
                  />
                </div>

                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="descricao">
                    Por que quer ser voluntário?
                  </label>
                  <textarea
                    id="descricao"
                    value={voluntarioFormData.descricao}
                    onChange={(e) => setVoluntarioFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva sua motivação para ser voluntário"
                    rows="4"
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={() => navigate("/")}>
                Cancelar
              </button>
              <button type="submit" className="btn-salvar" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {showCropModal && (
        <ImageCropModal
          image={imageToCrop}
          onClose={() => setShowCropModal(false)}
          onConfirm={handleCropComplete}
        />
      )}
    </>
  );
};

export default EditarPerfil;
