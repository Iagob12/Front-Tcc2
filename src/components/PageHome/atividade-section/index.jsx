import "../../../styles/Home/Atividades-section/style.css";
import CardAtividades from "../../Cards/CardAtividades";
import Title from "../../Title";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useState, useRef, useEffect, useCallback } from "react";
import 'swiper/css';
import 'swiper/css/pagination';
import ModalAtividades from "../../Modais/ModalAtividades";
import ModalAtividadeInscricao from "../../Modais/ModalAtividadesInscricao";
import { UseModalAtividades } from "../../Modais/ModalAtividades/UseModalAtividades.jsx";
import { useAuth } from "../../../hooks/useAuth";
import { useAutoRefresh } from "../../../hooks/useAutoRefresh";
import defaultImg from "../../../assets/default-imgs/default-atividade.png";
import { apiGet, apiDelete } from "../../../config/api";
import ModalExclusao from "../../Modais/ModalExclusao";

const AtividadeSection = () => {
  const modalAtividade = UseModalAtividades();
  const modalInscricao = UseModalAtividades();
  const { isAdmin } = useAuth();

  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [modalExclusaoOpen, setModalExclusaoOpen] = useState(false);
  const [excluirId, setExcluirId] = useState(null);
  const swiperRef = useRef(null);

  const fetchAtividades = useCallback(async () => {
    try {
      const response = await apiGet("/curso/listar");
      if (response.ok) {
        const dados = await response.json();

        const atividadesFormatadas = dados.map((item) => ({
          id: item.id,
          name: item.titulo,
          image: item.imagem || defaultImg,
          descricao: item.descricao,
          data: item.dias,
          horario: item.horario,
          vagas: item.vagas,
        }));
        setAtividades(atividadesFormatadas);
      } else {
        console.error("Erro ao listar atividades:", response.status);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    }
  }, []);

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  // Auto-refresh a cada 30 segundos
  useAutoRefresh(fetchAtividades, 30000);

  const handleCardClick = (atividade, event) => {
    event?.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();

    setAtividadeSelecionada({
      ...atividade,
      position: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      cursoId: atividade.id,
    });
    modalAtividade.open();
  };

  const handleInscrever = () => {
    modalAtividade.close();
    modalInscricao.open();
  };

  const handleDeleteClick = (id) => {
    setExcluirId(id);
    setModalExclusaoOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!excluirId) return;
    try {
      const response = await apiDelete(`/curso/deletar/${excluirId}`);
      if (!response.ok) {
        alert("Erro ao excluir atividade.");
        return;
      }
      setAtividades((prev) => prev.filter((item) => item.id !== excluirId));
      alert("Atividade excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro inesperado ao excluir.");
    } finally {
      setModalExclusaoOpen(false);
      setExcluirId(null);
    }
  };

  return (
    <>
      <section className="atividades">
        <Title title="Conheça nossas atividades" />
        <div className="atividades-container">
          {atividades.length === 0 ? (
            <div className="sem-atividades">
              <p>Sem atividades disponíveis no momento!</p>
            </div>
          ) : (
            <Swiper
              ref={swiperRef}
              modules={[Pagination]}
              slidesPerView="auto"
              spaceBetween={16}
              centeredSlides={false}
              pagination={{ clickable: true }}
              allowTouchMove={true}
              grabCursor={true}
              preventClicks={false}
              preventClicksPropagation={false}
              className="atividades-swiper"
            >
              {atividades.map((atividade) => (
                <SwiperSlide key={atividade.id} className="atividade-slide">
                  <CardAtividades
                    id={atividade.id}
                    image={atividade.image}
                    name={atividade.name}
                    onClick={(event) => handleCardClick(atividade, event)}
                    onDelete={() => handleDeleteClick(atividade.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {isAdmin && (
          <Link to="/adicionar-atividade" id="btn-blog" className="btn-link">
            + Adicionar atividade
          </Link>
        )}
      </section>

      {atividadeSelecionada && (
        <ModalAtividades
          isOpen={modalAtividade.isOpen}
          onClose={modalAtividade.close}
          aula={atividadeSelecionada.name}
          data={atividadeSelecionada.data}
          descricao={atividadeSelecionada.descricao}
          horario={atividadeSelecionada.horario}
          position={atividadeSelecionada.position}
          onInscrever={handleInscrever}
        />
      )}

      {atividadeSelecionada && (
        <ModalAtividadeInscricao
          isOpen={modalInscricao.isOpen}
          onClose={modalInscricao.close}
          atividade={atividadeSelecionada.name}
          vagas={atividadeSelecionada.vagas}
          cursoId={atividadeSelecionada.cursoId}
        />
      )}

      <ModalExclusao
        isOpen={modalExclusaoOpen}
        onClose={() => setModalExclusaoOpen(false)}
        onConfirm={handleConfirmDelete}
        mensagem="Tem certeza que deseja excluir esta atividade?"
      />
    </>
  );
};

export default AtividadeSection;
