import React from "react";
import Title from "../../Title"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import "../../../styles/Eventos/section-campanhas/style.css";   
import Button from "../../Button/";
import Campanha01 from "../../../assets/Eventos/campanha-alimentacao.svg"
import Campanha02 from "../../../assets/Eventos/campanha-sangue.svg"
import Campanha03 from "../../../assets/Eventos/campanha-roupa.svg"
import { Link } from "react-router-dom";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade'
import CarrosselCampanha from "../../Carrossel/Carrossel-campanhas";

export default function SectionCampanhas() {

     const imagens = [
            { id: 1, src: Campanha01, alt: 'um homem ajudando uma senhora de tranças', descricao: 'Campanha de Alimentação' },
            { id: 2, src: Campanha02, alt: 'várias mãos juntas, uma em cima da outra', descricao: 'Campanha de Doação de Sangue' },
            { id: 3, src: Campanha03, alt: 'duas mulheres escolhendo roupas', descricao: 'Campanha de Doação de Roupas' },
        ];
    return (
        <>
        <section className="section-campanhas">
            <div className="campanhas-container">
                <Title title={"Campanhas"} />

                <div className="campanhas-carrossel">
                        <Swiper
                        modules={[Autoplay, EffectFade]} // Adicione EffectFade
                        loop={true}
                        effect="fade" 
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}  pagination={{
        clickable: true,
    }}  
                       
                        className="meu-carrossel"
                    >
                        {imagens.map((imagem) => (
                            <SwiperSlide key={imagem.id}>
                                <CarrosselCampanha 
                                image={imagem.src} 
                                alt={imagem.alt} 
                                descricao={imagem.descricao} 
                                />
                            </SwiperSlide>
                        ))}
                        
                       
                    </Swiper>
                    <Link to="/sobre">
                        <Button text={"Saiba mais"} primary={true}/>
                    </Link>
                </div>
            </div>
            
        </section>
        </>
    )
}