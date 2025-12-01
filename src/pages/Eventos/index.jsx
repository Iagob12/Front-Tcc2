
import React from "react";
import Header from "../../components/Header"
import Main from "../../components/Main";
import SectionEventos from "../../components/Eventos/section-eventos"
import SectionCampanhas from "../../components/Eventos/section-campanhas";
import Footer from "../../components/Footer"
import AppPromoBanner from "../../components/AppPromoBanner";
import img_eventos from "../../assets/Eventos/main.svg"

export default function Eventos() {
    return (
        <>
        <Header />
        <Main img={img_eventos} text={"Eventos"}/>
        <SectionEventos />
        <SectionCampanhas />
        <Footer />
        <AppPromoBanner />
        </>
    )
}
