import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../../styles/Blog/adicionar-noticia/style.css";
import Button from "../../Button";
import IconUpload from "../../../assets/Blog/upload.svg";
import { X, Check } from "lucide-react";
import ImageCropModal from '../../PageBlog/ImageCropModal';
import { apiPost, apiPut, apiGet } from "../../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from '../../Toast/useToast';
import ToastContainer from '../../Toast/ToastContainer';

const AdicionarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [regiao, setRegiao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 5MB.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImageToCrop(imageUrl);
    setShowCropModal(true);
  }, [toast]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleCropComplete = async (croppedImage) => {
    setShowCropModal(false);
    setImageToCrop(null);
    setImagePreview(croppedImage);
    setLoading(true);

    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'evento.jpg');

      const uploadResponse = await fetch('http://192.168.15.14:8080/api/upload/image', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        setImagemUrl(data.url);
        toast.success('Imagem enviada com sucesso!');
      } else {
        throw new Error('Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem. Tente novamente.');
      setImagePreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setImagemUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagePreview) {
      toast.success('Imagem confirmada!');
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange(files[0]);
    }
  }, [handleImageChange]);

  const fetchEvento = async (id) => {
    try {
      const response = await apiGet(`/evento/${id}`);
      if (response.ok) {
        const evento = await response.json();

        setNome(evento.nome);
        setData(evento.data.split("T")[0]);
        setDescricao(evento.descricao);
        
        const [estadoLocal, cidadeEndereco] = evento.local.split(" - ");
        const [cidade, enderecoRegiao] = cidadeEndereco.split(", ");
        const [endereco, regiao] = enderecoRegiao.split(", ");

        setEstado(estadoLocal);
        setCidade(cidade);
        setEndereco(endereco);
        setRegiao(regiao);
        
        if (evento.imagemUrl) {
          setImagemUrl(evento.imagemUrl);
          setImagePreview(evento.imagemUrl);
        }
      } else {
        console.error("Erro ao carregar evento:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!nome || !data || !hora || !estado || !cidade || !endereco || !regiao || !descricao) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!id && !imagePreview) {
      toast.warning("Por favor, selecione uma imagem para o evento.");
      return;
    }

    const dataEvento = new Date(data);
    const horaEvento = hora;

    const eventoData = {
      nome,
      descricao,
      data: `${dataEvento.toISOString().split("T")[0]}T${horaEvento || "00:00"}:00`,
      local: `${estado} - ${cidade}, ${endereco}, ${regiao}`,
      imagemUrl: imagemUrl || null,
    };

    setLoading(true);

    try {
      let response;
      if (id) {
        response = await apiPut(`/evento/atualizar/${id}`, eventoData);
      } else {
        response = await apiPost("/evento/marcar", eventoData);
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(id ? "Evento atualizado:" : "Evento cadastrado:", responseData);
        
        toast.success(id ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");

        setNome("");
        setData("");
        setHora("");
        setEstado("");
        setCidade("");
        setEndereco("");
        setRegiao("");
        setDescricao("");
        setImagemUrl("");
        setImagePreview(null);

        setTimeout(() => {
          navigate("/eventos");
        }, 1500);
      } else if (response.status === 401) {
        toast.error("Você precisa estar logado para criar um evento.");
      } else if (response.status === 403) {
        toast.error("Você não tem permissão para criar um evento.");
      } else {
        const error = await response.json();
        toast.error(error.message || (id ? "Erro ao atualizar evento." : "Erro ao cadastrar evento."));
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast.error("Erro ao salvar evento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvento(id);
    }
  }, [id]);

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="container-form-noticia">
        <div className="content-form-noticia">
          <h2>{id ? "Editar Evento" : "Cadastre um novo evento"}</h2>
          <form className="form-noticia" onSubmit={handleSubmit}>
            <label htmlFor="uploadImage" className="upload-label"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="preview-wrapper">
                  <img src={imagePreview} alt="Prévia da imagem do evento" className="preview-image" />
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
                  <img id="iconUpload" src={IconUpload} alt="Ícone de upload" />
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
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />

            <label htmlFor="nome" className="label-noticia">Nome do Evento</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className="input-noticia"
              placeholder="Digite o nome do evento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label htmlFor="data" className="label-noticia">Data</label>
            <input
              id="data"
              name="data"
              type="date"
              className="input-noticia"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />

            <label htmlFor="hora" className="label-noticia">Hora</label>
            <input
              id="hora"
              name="hora"
              type="time"
              className="input-noticia"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />

            <label htmlFor="estado" className="label-noticia">Estado</label>
            <input
              id="estado"
              name="estado"
              type="text"
              className="input-noticia"
              placeholder="Digite o estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />

            <label htmlFor="cidade" className="label-noticia">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              className="input-noticia"
              placeholder="Digite a cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />

            <label htmlFor="endereco" className="label-noticia">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              className="input-noticia"
              placeholder="Digite o endereço completo"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />

            <label htmlFor="regiao" className="label-noticia">Região/Bairro</label>
            <input
              id="regiao"
              name="regiao"
              type="text"
              className="input-noticia"
              placeholder="Digite a região ou bairro"
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              required
            />

            <label htmlFor="descricao" className="label-noticia">Descrição do Evento</label>
            <textarea
              id="descricao"
              name="descricao"
              className="input-noticia"
              placeholder="Descreva o evento em detalhes"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />

            <Button 
              type="submit"
              text={loading ? "Carregando..." : id ? "Atualizar Evento" : "Salvar Evento"}
              disabled={loading}
            />
          </form>
        </div>

        {showCropModal && imageToCrop && (
          <ImageCropModal
            image={imageToCrop}
            onClose={handleCropCancel}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>
    </>
  );
};

export default AdicionarEvento;
