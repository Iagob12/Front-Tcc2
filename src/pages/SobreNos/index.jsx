import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Main from "../../components/Main/";
import SectionLinhaTempo from "../../components/SobreNos/section-linha-tempo";
import SectionPilares from "../../components/SobreNos/section-pilares";
import SectionEquipe from "../../components/SobreNos/section-equipe";
import AppPromoBanner from "../../components/AppPromoBanner";
import img_sobreNos from "../../assets/SobreNos/sobreNos.png"
import SectionHistoria from "../../components/SobreNos/section-historia";

import { useSmoothScroll } from "../../components/Hooks/useSmoothScroll";

export default function SobreNos() {
useSmoothScroll();

    return (
        <>
            <Header />
            <Main img={img_sobreNos} text={"Sobre nós"}/>
            <SectionHistoria id="nossa_historia"/>
            <SectionLinhaTempo id="linha-do-tempo"/>
            <SectionPilares id="projetos"/>
            <SectionEquipe id="equipe"/>
            <Footer />
            <AppPromoBanner />
        </>
    )
};