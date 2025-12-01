import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/Cadastro/Capa/style.css"
import logo from "../../../assets/Logos/Logo.svg"

const CapaCadastro = ({title, img}) => {
    return (
        <>
        {/* Cabeçalho mobile - fora do main para garantir clique */}
        <Link to="/" className="cabecalho-mobile">
            <img src={logo} alt="logo" />
            <p>Fazer o Bem <br /> Faz Muito Bem</p>
        </Link>
        
        <main className="cadastro">
              <div className="capa-container">
                <img src={img} className="fundo" />
                <div className="overlay"></div>
                
                {/* Cabeçalho desktop - dentro do container */}
                <Link to="/" className="cabecalho-desktop">
                    <img src={logo} alt="logo" />
                    <p>Fazer o Bem <br /> Faz Muito Bem</p>
                </Link>
                
                <h1>{title}</h1>
            </div>
        </main>
          
        </>
    )
}

export default CapaCadastro
