import React from "react";
import Header from "../../components/Header"
import "../../styles/Main/style.css"


const Main = ({img, text}) => {
    return (
        <>
            <main className="main">
                <img src={img} />
                <div className="overlay-capa"/>
                <h1>{text}</h1>
                {text === "Tarefas" && (
                    <p className="main-subtitle">Seja bem vindo a área de voluntários, aqui você pode acessar suas aulas e seus eventos agendados</p>
                )}
            </main>
        </>
    )
}


export default Main;