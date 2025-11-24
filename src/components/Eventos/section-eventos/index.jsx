import React, { useEffect, useState } from "react";
import Title from "../../Title";
import CardEventos from "../../Cards/CardEventos";
import "../../../styles/Eventos/section-eventos/style.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { apiGet, apiDelete } from "../../../config/api";
import defaultImg from "../../../assets/default-imgs/evento-img.png";
import ModalExclusao from "../../Modais/ModalExclusao";

export default function SectionEventos() {
  const { isAdmin } = useAuth();

  const [eventos, setEventos] = useState([]);
  const [modalExclusaoOpen, setModalExclusaoOpen] = useState(false);
  const [excluirId, setExcluirId] = useState(null);

  // Função para buscar os eventos
  const fetchEventos = async () => {
    const response = await apiGet("/evento/listar");
    if (response.ok) {
      const data = await response.json();
      setEventos(data);
    }
  };

  const deleteEvento = async () => {
    if (!excluirId) return;

    const response = await apiDelete(`/evento/deletar/${excluirId}`);
    if (!response.ok) {
      alert("Erro ao excluir evento.");
      return;
    }

    setEventos((prev) => prev.filter((evento) => evento.id !== excluirId));
    alert("Evento excluído com sucesso!");
    setModalExclusaoOpen(false);
    setExcluirId(null);
  };

  const handleDeleteClick = (id) => {
    setExcluirId(id);
    setModalExclusaoOpen(true);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <>
      <section className="section-eventos">
        <Title title={"Eventos"} />
        {eventos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--color-grey)', fontSize: '1rem' }}>
            Não há eventos para exibir.
          </p>
        ) : (
          eventos.map((evento) => (
            <CardEventos
              key={evento.id}
              id={evento.id}
              titulo={evento.nome}
              img={evento.imagemUrl || defaultImg}
              local={evento.local}
              data={evento.data}
              onDelete={() => handleDeleteClick(evento.id)}
            />
          ))
        )}
        {isAdmin && (
          <Link to="/adicionar-evento" className="link-adicionar">
            + Adicionar evento
          </Link>
        )}
      </section>

      <ModalExclusao
        isOpen={modalExclusaoOpen}
        onClose={() => setModalExclusaoOpen(false)}
        onConfirm={deleteEvento}
        mensagem="Tem certeza que deseja excluir este evento?"
      />
    </>
  );
}
