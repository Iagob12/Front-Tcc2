import React, { useState, useEffect, useRef } from "react";
import "../../../styles/Blog/adicionar-noticia/style.css";
import IconUpload from "../../../assets/Blog/upload.svg";
import { X, Check } from "lucide-react";
import Button from "../../Button";
import ImageCropModal from '../../PageBlog/ImageCropModal';
import { apiGet, apiPost, apiPut } from '../../../config/api';
import { useToast } from '../../Toast/useToast';
import ToastContainer from '../../Toast/ToastContainer';
import { useNavigate, useParams } from 'react-router-dom';

const AdicionarAtividade = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data: "",
    hora: "",
    vagas: 0
  });

  useEffect(() => {
    if (isEdit) {
      apiGet(`/curso/listar`)
        .then(res => res.json())
        .then(data => {
          const curso = data.find(c => c.id === Number(id));
          if (curso) {
            setFormData({
              nome: curso.titulo,
              descricao: curso.descricao,
              data: curso.dias,
              hora: curso.horario,
              vagas: curso.vagas,
            });
            if (curso.imagem) setImagePreview(curso.imagem);
          }
        })
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      setShowCropModal(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob) => {
    if (croppedImageBlob) {
      const imageUrl = URL.createObjectURL(croppedImageBlob);
      setImagePreview(imageUrl);
      setImageFile(croppedImageBlob);
      setShowCropModal(false);
      setImageToCrop(null);
      toast.success("Imagem ajustada com sucesso!");
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmImage = () => {
    if (imageFile) {
      toast.success("Imagem confirmada!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.nome || !formData.descricao || !formData.data || !formData.hora || !formData.vagas) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!isEdit && !imagePreview) {
      toast.warning("Por favor, selecione uma imagem para a atividade.");
      return;
    }

    setLoading(true);

    try {
      let imagemBase64 = null;

      if (imageFile) {
        const reader = new FileReader();
        
        imagemBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('data:image')) {
        // Caso de edição onde já temos base64
        imagemBase64 = imagePreview;
      }

      const dto = {
        titulo: formData.nome,
        descricao: formData.descricao,
        dias: formData.data,
        horario: formData.hora,
        vagas: Number(formData.vagas),
        imagem: imagemBase64,
      };

      let response;
      if (isEdit) {
        response = await apiPut(`/curso/atualizar/${id}`, dto);
      } else {
        response = await apiPost("/curso/cadastrar", dto);
      }

      if (response.ok) {
        toast.success(isEdit ? "Atividade atualizada com sucesso!" : "Atividade cadastrada com sucesso!");
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else if (response.status === 401) {
        toast.error("Você precisa estar logado para criar uma atividade.");
      } else if (response.status === 403) {
        toast.error("Você não tem permissão para criar uma atividade.");
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao salvar atividade.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar atividade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="container-form-noticia">
        <div className="content-form-noticia">
          <h2>{isEdit ? "Editar Atividade" : "Cadastre uma nova atividade"}</h2>

          <form className="form-noticia" onSubmit={handleSubmit}>
            <label htmlFor="uploadImage" className="upload-label">
              {imagePreview ? (
                <div className="preview-wrapper">
                  <img src={imagePreview} alt="Prévia da imagem" className="preview-image" />
                  <div className="image-actions">
                    <button type="button" className="action-btn" onClick={removeImage}>
                      <X size={24} color="#fff" />
                    </button>
                    <button type="button" className="action-btn" onClick={confirmImage}>
                      <Check size={24} color="#fff" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img id="iconUpload" src={IconUpload} alt="Upload" />
                  <span>Faça o upload da capa ou arraste o arquivo</span>
                </>
              )}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              id="uploadImage"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <label htmlFor="nome" className="label-noticia">Nome da Atividade</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="input-noticia"
              placeholder="Digite o nome da atividade"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="descricao" className="label-noticia">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              className="input-noticia"
              placeholder="Descreva a atividade em detalhes"
              value={formData.descricao}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="data" className="label-noticia">Dias da Semana</label>
            <input
              type="text"
              id="data"
              name="data"
              className="input-noticia"
              placeholder="Ex: Segunda a Sexta"
              value={formData.data}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="hora" className="label-noticia">Horário</label>
            <input
              type="time"
              id="hora"
              name="hora"
              className="input-noticia"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="vagas" className="label-noticia">Número de Vagas</label>
            <input
              type="number"
              id="vagas"
              name="vagas"
              className="input-noticia"
              placeholder="Digite o número de vagas disponíveis"
              value={formData.vagas}
              onChange={handleInputChange}
              min={0}
              required
            />

            <Button
              type="submit"
              text={loading ? "Salvando..." : (isEdit ? "Atualizar Atividade" : "Salvar Atividade")}
              disabled={loading}
            />
          </form>

        </div>
      </div>

      {showCropModal && imageToCrop && (
        <ImageCropModal
          image={imageToCrop}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default AdicionarAtividade;
