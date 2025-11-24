import React, { useState } from "react";
import img_doe from "../../../assets/ComoAjudar/img-doacao.png"
import "../../../styles/ComoAjudar/section-doe-agora/style.css"
import Button from "../../Button"
import AnimatedSection from "../../AnimatedSection";
import  Title from "../../Title"
import ModalEmDesenvolvimento from "../../Modais/ModalEmDesenvolvimento";

export default function ComoAjudar() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleDoeAgora = () => {
        setModalOpen(true);
    };

    return (
        <>
        <AnimatedSection delay={0.4}>
            <section className="section-doe" id="doacao">
                <Title title={"Faça a Difereça"} />
             <div className="container-doe">
                
                <img src={img_doe} />
                <div className="texto-doe">
                    <p>A ONG <span> Voluntários Pro Bem </span> sobrevive graças às doações recebidas. Todas as nossas ações, eventos e campanhas são realizadas por meio dos recursos doados, para que esses projetos possam continuar acontecendo e, assim, tanto a comunidade quanto o bairro possam ser transformados. <br />Por isso, contamos com a sua ajuda. Colabore para um mundo melhor. <br /> Faça a diferença, doe!</p>
                    <div onClick={handleDoeAgora}>
                        <Button text={"Doe agora"}/>
                    </div>
                </div>
            </div>
            </section>
           
            </AnimatedSection>
            <ModalEmDesenvolvimento isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    )
}