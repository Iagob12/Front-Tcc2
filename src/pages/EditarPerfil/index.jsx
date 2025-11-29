import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/EditarPerfil/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { apiGet, apiPut } from "../../config/api";
import { useToast } from '../../components/Toast/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth.js";
import ProfileImageCropModal from '../../components/ProfileImageCropModal';
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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); 
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.id) {
        toast.error("Você precisa estar logado.");
        navigate("/login");
        return;
      }
      
      const responseUsuario = await apiGet(`/usuario/${user.id}`);
      
      if (responseUsuario.ok) {
        const usuario = await responseUsuario.json();

        setFormData({
          nome: usuario.nome || "",
          fotoPerfil: usuario.imagemPerfil || null
        });

        if (usuario.imagemPerfil) {
          setImagePreview(usuario.imagemPerfil);
        }

        try {
          const responseVoluntario = await apiGet(`/voluntario/usuario/${user.id}`);
          if (responseVoluntario.ok) {
            const voluntario = await responseVoluntario.json();
            if (voluntario.status === 'APROVADO') {
              setIsVoluntario(true);
              setVoluntarioFormData({
                telefone: voluntario.telefone || "",
                endereco: voluntario.endereco || "",
                descricao: voluntario.descricao || ""
              });
            }
          }
        } catch {}
      } else {
        toast.error("Erro ao carregar dados do perfil.");
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do perfil.");
      setTimeout(() => navigate("/"), 2000);
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
    if (file) handleImageChange(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  }, [handleImageChange]);

  const handleDragOver = (e) => e.preventDefault();

  const handleCropComplete = (croppedImageBlob) => {
    if (croppedImageBlob) {
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setImagePreview(previewUrl);
      setImageFile(croppedImageBlob);
      setShowCropModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagemPerfilBase64 = formData.fotoPerfil;

      // Se o usuário enviou nova imagem
      if (imageFile) {
        imagemPerfilBase64 = await fileToBase64(imageFile);
      }

      const dadosPerfil = {
        nome: formData.nome,
        imagemPerfil: imagemPerfilBase64
      };

      if (isVoluntario) {
        dadosPerfil.telefone = voluntarioFormData.telefone;
        dadosPerfil.endereco = voluntarioFormData.endereco;
      }

      const responseUsuario = await apiPut("/usuario/editar-perfil", dadosPerfil);

      if (responseUsuario.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        user.nome = formData.nome;
        user.imagemPerfil = imagemPerfilBase64;
        userData.nome = formData.nome;
        userData.imagemPerfil = imagemPerfilBase64;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(userData));

        await checkAuth();

        toast.success("Perfil atualizado com sucesso!");
        setTimeout(() => navigate("/"), 800);
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

            {/* FOTO DE PERFIL */}
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

            {/* NOME */}
            <div className="form-field">
              <label className="label-editar-perfil" htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
                placeholder="Digite seu nome"
              />
            </div>

            {/* CAMPOS DE VOLUNTÁRIO */}
            {isVoluntario && (
              <>
                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="telefone">Telefone</label>
                  <input
                    type="text"
                    id="telefone"
                    value={voluntarioFormData.telefone}
                    onChange={(e) => setVoluntarioFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="endereco">Endereço</label>
                  <input
                    type="text"
                    id="endereco"
                    value={voluntarioFormData.endereco}
                    onChange={(e) => setVoluntarioFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    placeholder="Digite seu endereço completo"
                  />
                </div>

                <div className="form-field">
                  <label className="label-editar-perfil" htmlFor="descricao">Por que quer ser voluntário?</label>
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
        <ProfileImageCropModal
          image={imageToCrop}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default EditarPerfil;
