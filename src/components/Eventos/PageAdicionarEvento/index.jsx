import React, { useState, useEffect } from "react";
import "../../../styles/Eventos/adicionar-evento/style.css";
import Button from "../../Button";
import IconUpload from "../../../assets/Blog/upload.svg";
import { apiPost, apiPut, apiGet } from "../../../config/api";
import { useNavigate, useParams } from "react-router-dom";

const AdicionarEvento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [regiao, setRegiao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

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
        
        setImagem(evento.imagem || "default-image.png");
      } else {
        console.error("Erro ao carregar evento:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataEvento = new Date(data);
    const horaEvento = hora;

    const eventoData = {
      nome,
      descricao,
      data: `${dataEvento.toISOString().split("T")[0]}T${horaEvento || "00:00"}:00`,
      local: `${estado} - ${cidade}, ${endereco}, ${regiao}`,
      imagem: imagem || "default-image.png",
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

        setNome("");
        setData("");
        setHora("");
        setEstado("");
        setCidade("");
        setEndereco("");
        setRegiao("");
        setDescricao("");
        setImagem(null);

        setTimeout(() => {
          navigate("/eventos");
        }, 1500);
      } else {
        console.error(id ? "Erro ao atualizar evento" : "Erro ao cadastrar evento");
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
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
    <div className="container-form-evento">
      <h1 className="titulo-form-evento">{id ? "Editar Evento" : "Novo Evento"}</h1>
      <div className="content-form-evento">
        <form className="form-evento" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input
            name="nome"
            type="text"
            placeholder="Nome do evento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <div className="data-hora">
            <label htmlFor="data">Data</label>
            <input
              name="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <label htmlFor="hora">Hora</label>
            <input
              name="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="local-estado">
            <label htmlFor="estado">Estado</label>
            <input
              name="estado"
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <label htmlFor="cidade">Cidade</label>
            <input
              name="cidade"
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <label htmlFor="endereco">Endereço</label>
          <input
            name="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <label htmlFor="regiao">Região</label>
          <input
            name="regiao"
            type="text"
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
          />

          <label htmlFor="descricao">Descrição para o evento</label>
          <textarea
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite aqui..."
          ></textarea>

          <label>Imagem</label>
          <label htmlFor="uploadImage" className="upload-label">
            <img id="iconUpload" src={IconUpload} alt="Upload" />
            <span>Faça o upload da capa ou arraste o arquivo</span>
          </label>

          <Button className="button" text={loading ? "Carregando..." : id ? "Atualizar Evento" : "Salvar Evento"} />
        </form>
      </div>
    </div>
  );
};

export default AdicionarEvento;
