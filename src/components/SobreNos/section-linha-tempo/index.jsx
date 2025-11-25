import React from "react";
import Title from "../../Title"
import "../../../styles/SobreNos/section-linha-tempo/style.css"
import Card from "../../Cards/Cards-SobreNos/Card"

// Img dos cards
import card1 from "../../../assets/SobreNos/card1.png"
import card2 from "../../../assets/SobreNos/card2.png"
import card3 from "../../../assets/SobreNos/card3.png"
import card4 from "../../../assets/SobreNos/card4.png"
import card5 from "../../../assets/SobreNos/card5.png"

const SectionLinhaTempo = ({ id }) => {
  return (
    <section id={id} className="section-linha-tempo">
            <Title title={"Linha do tempo"} />
    
            <div className="lista-acontecimentos">
                <Card
                    ano={2015}
                    img={card1}
                    acontecimento={"Inicio do projeto"}
                    texto={"Iniciou com as entregas de sopa todas a terças-feiras a noite"}
                    invertido={false}
                />
                <Card
                    ano={2020}
                    img={card2}
                    acontecimento={"Pandemia"}
                    texto={"Mesmo na pandemia, seguimos com as entregas de sopa e cestas básicas"}
                    invertido={true}
                />
                <Card
                    ano={2023}
                    img={card3}
                    acontecimento={"Construção da Sede"}
                    texto={"Com apoio do vereador Gilson Barreto, a sede foi construída e passou a oferecer diversas atividades sociais gratuitas"}
                    invertido={false}
                />
                <Card
                    ano={2024}
                    img={card4}
                    acontecimento={"Eventos"}
                    texto={"Continuamos a realizar eventos de Natal, Páscoa e Dia das Crianças em prol da comunidade"}
                    invertido={true}
                />
                <Card
                    ano={2025}
                    img={card5}
                    acontecimento={"Projetos"}
                    texto={"Raízes do Bem visa valorizar a história do bairro e preservar a Praça local."}
                    invertido={false}
                />
            </div>
         
        </section>
    )
};

export default SectionLinhaTempo