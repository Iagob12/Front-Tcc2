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
  const { user, checkAuth } = useAuth();
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
      
      // Carregar dados do usuário
      const responseUsuario = await apiGet("/usuario/perfil");
      if (responseUsuario.ok) {
        const usuario = await responseUsuario.json();
        setFormData({
          nome: usuario.nome || "",
          fotoPerfil: usuario.fotoPerfil || null
        });
        
        if (usuario.fotoPerfil) {
          setImagePreview(usuario.fotoPerfil);
        }
        
        // Verificar se é voluntário
        try {
          const responseVoluntario = await apiGet("/voluntario/dados");
          if (responseVoluntario.ok) {
            const voluntario = await responseVoluntario.json();
            setIsVoluntario(true);
            setVoluntarioData(voluntario);
            setVoluntarioFormData({
              telefone: voluntario.telefone || "",
              endereco: voluntario.endereco || "",
              descricao: voluntario.descricao || ""
            });
          }
        } catch (error) {
          // Não é voluntário ou ainda não foi aprovado
          setIsVoluntario(false);
        }
      } else {
        toast.error("Erro ao carregar dados do perfil.");
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do perfil.");
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
      let fotoPerfilUrl = formData.fotoPerfil;

      // Se houver nova imagem, converter para base64
      if (imageFile) {
        const reader = new FileReader();
        fotoPerfilUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      // Atualizar dados do usuário
      const usuarioData = {
        nome: formData.nome,
        fotoPerfil: fotoPerfilUrl
      };

      const responseUsuario = await apiPut("/usuario/perfil", usuarioData);
      if (responseUsuario.ok) {
        const usuarioAtualizado = await responseUsuario.json();
        
        // Atualizar dados do voluntário se for voluntário
        if (isVoluntario && voluntarioData) {
          const responseVoluntario = await apiPut("/voluntario/atualizar", voluntarioFormData);
          if (!responseVoluntario.ok) {
            toast.warning("Perfil atualizado, mas houve erro ao atualizar dados do voluntário.");
          }
        }
        
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
