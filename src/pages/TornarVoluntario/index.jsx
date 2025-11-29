import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import main_img from '../../assets/TornarVoluntario/main.png'
import "../../styles/TornarVoluntario/style.css"
import { Link, useNavigate } from 'react-router-dom';
import { apiGet } from '../../config/api';

export default function TornarVoluntario() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [podeInscrever, setPodeInscrever] = useState(true);

    useEffect(() => {
        const verificarStatus = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                const email = userData.email;
                
                if (!email) {
                    setLoading(false);
                    return;
                }

                // Buscar usuário
                const responseUsuarios = await apiGet("/usuario/todos");
                if (!responseUsuarios.ok) {
                    setLoading(false);
                    return;
                }

                const usuarios = await responseUsuarios.json();
                const usuarioEncontrado = usuarios.find(u => u.email === email);
                
                if (!usuarioEncontrado) {
                    setLoading(false);
                    return;
                }

                const userId = usuarioEncontrado.id || usuarioEncontrado.idUsuario;

                // Verificar se já é voluntário
                const responseVoluntario = await apiGet(`/voluntario/usuario/${userId}`);
                if (responseVoluntario.ok) {
                    const voluntario = await responseVoluntario.json();
                    
                    if (voluntario && (voluntario.status === 'PENDENTE' || voluntario.status === 'APROVADO')) {
                        setPodeInscrever(false);
                        // Redirecionar após 2 segundos
                        setTimeout(() => {
                            navigate("/dashboard-voluntario");
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error("Erro ao verificar status:", error);
            } finally {
                setLoading(false);
            }
        };

        verificarStatus();
    }, [navigate]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="main-container">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '60vh' 
                    }}>
                        <p>Carregando...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!podeInscrever) {
        return (
            <>
                <Header />
                <main className="main-container">
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '60vh',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#b20000' }}>
                            Você já é um voluntário!
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
                            Redirecionando para o dashboard...
                        </p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main-container">
                <img src={main_img} />
                <div className="content-container">
                    <h1>
                        A mudança <br /> que o mundo <br />
                        começa com <br /> sua atitude!
                    </h1>
                    <div className="text-container">
                        <p>Venha fazer <br /> parte!</p>
                        <Link to="/ser-voluntario">
                            <Button
                            text={"Quero ser um voluntário!"}
                            primary={false}
                            className="btn-voluntario"
        />
                        </Link>

                    </div>
                </div>
                <div className="overlay-capa"></div>
            </main>
            <Footer />
        </>
    )
}