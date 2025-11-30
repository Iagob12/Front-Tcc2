import React from "react";
import imgDefault from "../../../assets/default-imgs/evento-img.png"
import "../../../styles/Eventos/ModalInfoEvento/style.css"
import { FaCalendar, FaClock, FaMapMarked } from "react-icons/fa";

const ModalInfoEventos = ({ isOpen, onClose, evento, loading }) => {
    if (!isOpen) return null;

    return (
        <dialog open className="modal-overlay" onClick={onClose}>
            <div className="info-evento-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Fechar">
                    ×
                </button>
                {loading ? (
                    <div className="loading-container">
                        <p>Carregando...</p>
                    </div>
                ) : evento ? (
                    <>
                        <img src={evento.imagemUrl || imgDefault} alt="Capa do evento" />
                        <div className="info-evento-dados">
                            <h1>{evento.nome}</h1>
                            <p>{evento.descricao}</p>
                        </div>
                        <div className="endereco-hora">
                            <p>
                                <i>
                                    <FaCalendar />
                                </i>
                                {evento.data}
                            </p>
                            <p>
                                <i>
                                    <FaMapMarked />
                                </i>
                                {evento.local}
                            </p>
                            <p>
                                <i>
                                    <FaClock />
                                </i>
                                {evento.hora}
                            </p>
                        </div>
                    </>
                ) : (
                    <p>Evento não encontrado</p>
                )}
            </div>
        </dialog>
    )
}

export default ModalInfoEventos;