import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header"
import Main from "../../components/Main"
import img_main from "../../assets/ComoAjudar/img-comoAjudar.png"
import Title from "../../components/Title"
import SectionDoe from "../../components/ComoAjudar/section-doe-agora"
import SectionPlanos from "../../components/ComoAjudar/section-planos"
import Footer from "../../components/Footer"

export default function ComoAjudar() {
    const location = useLocation();

    useEffect(() => {
        // Scroll suave para a seção quando há hash na URL
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }, [location]);

    return (
        <>
            <Header />
            <Main img={img_main} text={"Como Ajudar"} />
            <SectionDoe />
            <SectionPlanos />
            <Footer />
        </>
    )
}