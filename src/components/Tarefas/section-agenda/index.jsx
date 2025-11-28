import React, { useState } from "react";
import "../../../styles/Tarefa/section-agenda/style.css";
import Title from "../../Title";
import SectionAulas from "../../../components/Tarefas/section-aulas";
import SectionTarefas from "../../../components/Tarefas/section-tarefas";

export default function Agenda() {
    const [opcao, setOpcao] = useState("tarefas");

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
                        onClick={() => setOpcao("tarefas")} 
                        className={opcao === "tarefas" ? "ativo" : ""}
                    >
                        meus eventos
                    </p>
                </div>

                {opcao === "aulas" && <SectionAulas />}
                {opcao === "tarefas" && <SectionTarefas emAgenda={true} />}
            </section>
        </>
    );
}