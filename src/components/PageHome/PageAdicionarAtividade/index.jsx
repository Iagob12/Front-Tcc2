import "../../../styles/Home/AdicionarAtividade/style.css";
import Button from "../../Button";
import IconUpload from "../../../assets/Blog/upload.svg";
import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../../../config/api"; 
import { useNavigate, useParams } from "react-router-dom";
import ImageCropModal from "../../PageBlog/ImageCropModal";

const AdicionarAtividade = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        data: "",
        hora: "",
        vagas: 0,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione apenas arquivos de imagem.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5MB.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setImageToCrop(imageUrl);
        setShowCropModal(true);
    };

    const handleCropComplete = (croppedImage) => {
        setImagePreview(croppedImage);
        setShowCropModal(false);
        setImageToCrop(null);
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageToCrop(null);
        const fileInput = document.getElementById("uploadImage");
        if (fileInput) fileInput.value = "";
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
        const fileInput = document.getElementById("uploadImage");
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            let imagemBase64 = null;

            if (imagePreview) {
                if (imagePreview.startsWith('data:image')) {
                    imagemBase64 = imagePreview;
                } else {
                    const response = await fetch(imagePreview);
                    const blob = await response.blob();
                    
                    imagemBase64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                }
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
                alert(isEdit ? "Atividade atualizada com sucesso!" : "Atividade cadastrada com sucesso!");
                navigate(-1);
            } else {
                alert("Erro ao salvar atividade. Tente novamente.");
                console.error(response.status);
            }
        } catch (error) {
            alert("Erro ao conectar com a API. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-form-atividade">
            <h1 className="titulo-form-atividade">{isEdit ? "Editar Atividade" : "Nova atividade"}</h1>
            <div className="content-form-atividade">
                <form className="form-atividade" onSubmit={handleSubmit}>
                    <label htmlFor="nome">Nome</label>
                    <input
                        name="nome"
                        type="text"
                        placeholder="Nome da atividade"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="descricao">Descrição</label>
                    <input
                        name="descricao"
                        type="text"
                        placeholder="Descrição da atividade"
                        value={formData.descricao}
                        onChange={handleChange}
                        required
                    />

                    <div className="data-hora">
                        <label htmlFor="data">Data e hora</label>
                        <input
                            name="data"
                            type="text"
                            placeholder="Segunda a Sexta"
                            value={formData.data}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="hora"
                            type="time"
                            value={formData.hora}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label htmlFor="vagas">Número de vagas</label>
                    <input
                        name="vagas"
                        type="number"
                        value={formData.vagas}
                        onChange={handleChange}
                        min={0}
                        required
                    />

                    <label>Imagem</label>
                    <label htmlFor="uploadImage" className="upload-label">
                        {imagePreview ? (
                            <div className="preview-wrapper">
                                <img src={imagePreview} alt="Prévia da imagem" className="preview-image" />
                                <button type="button" className="remove-btn" onClick={removeImage}>Remover imagem</button>
                            </div>
                        ) : (
                            <>
                                <img id="iconUpload" src={IconUpload} alt="Upload" />
                                <span>Faça o upload da capa ou arraste o arquivo</span>
                            </>
                        )}
                    </label>

                    <input
                        type="file"
                        id="uploadImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />

                    <Button 
                        className="button" 
                        text={loading ? "Salvando..." : "Salvar"}
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
    );
};

export default AdicionarAtividade;