import React, { useState } from "react";
import "../../../styles/Tarefa/section-agenda/style.css";
import Title from "../../Title";
import SectionAulas from "../../../components/Tarefas/section-aulas";
import SectionTarefas from "../../../components/Tarefas/section-tarefas";

export default function Agenda() {
    const [opcao, setOpcao] = useState("aulas");
    const [showModal, setShowModal] = useState(false);

    const handleCliqueEventos = () => {
        setOpcao("tarefas");
        setShowModal(true);
    };

    const handleFecharModal = () => {
        setShowModal(false);
        setOpcao("aulas");
    };

    return (
        <>
            <section className="section-agenda">
                <Title title={"Agenda"} />
                <div className="agenda-tarefas">
                    <p
                        onClick={() => setOpcao("aulas")}
                        className={opcao === "aulas" ? "ativo" : ""}
                    >
                        minhas aulas
                    </p>
                    <p
                        onClick={handleCliqueEventos}
                        className={opcao === "tarefas" ? "ativo" : ""}
                    >
                        meus eventos
                    </p>
                </div>

                {opcao === "aulas" && <SectionAulas />}
                {opcao === "tarefas" && <SectionTarefas emAgenda={true} />}

                {showModal && (
                    <div
                        className="modal-overlay-agenda"
                        onClick={handleFecharModal}
                    >
                        <div
                            className="modal-agenda"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p>
                                Para acessar sua agenda de eventos, acesse pelo nosso
                                App!
                            </p>
                            <button onClick={handleFecharModal}>Ok</button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
