import React from "react";
import Header from "../../components/Header"
import Main from "../../components/Main";
import Title from "../../components/Title";
import SectionTarefas from "../../components/Tarefas/section-tarefas"
import SectionAgenda from "../../components/Tarefas/section-agenda"
import Footer from "../../components/Footer";
import AppPromoBanner from "../../components/AppPromoBanner";
import img_tarefas from "../../assets/Tarefas/img-tarefas.png"

export default function Tarefas(){
    return (
        <>
            <Header />
            <Main text={"Tarefas"} img={img_tarefas} />
            <SectionAgenda />
            <Footer />
            <AppPromoBanner />
        </>
    )
}