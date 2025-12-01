import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CardAula from "../../Cards/CardAulas";
import defaultImg from "../../../assets/default-imgs/default-atividade.png";
import "../../../styles/Tarefa/section-aulas/style.css";
import { apiGet } from "../../../config/api";

export default function SectionAulas() {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);

    const storedUser = localStorage.getItem("userData");
    const usuarioId = storedUser ? JSON.parse(storedUser).id : null;

    useEffect(() => {
        if (!usuarioId) return;

        async function fetchAulas() {
            try {
                const response = await apiGet(`/curso/usuario/${usuarioId}`);
                if (!response.ok) {
                    console.error("Erro ao carregar cursos:", response.status);
                    return;
                }
                const data = await response.json();
                setAulas(data);
            } catch (error) {
                console.error("Erro de requisição:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAulas();
    }, [usuarioId]);

    if (loading) {
        return <p style={{color: "red" ,height: "200px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem"}}>Carregando suas aulas...</p>;
    }

    if (aulas.length === 0) {
        return <p style={{height: "200px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem"}}>Você ainda não está inscrito em nenhuma aula.</p>;
    }

    return (
        <div className="lista-aulas-container">
            <section className="lista-aulas">
                {aulas.map((curso) => (
                    <CardAula
                        key={curso.idInscricao}
                        idInscricao={curso.idInscricao}
                        titulo={curso.titulo}
                        descricao={curso.descricao}
                        data={curso.dias}
                        img={curso.imagem || defaultImg}
                        onCancel={(cancelledId) =>
                            setAulas(aulas.filter((a) => a.idInscricao !== cancelledId))
                        }
                    />
                ))}
            </section>
            {aulas.length > 1 && (
                <div className="scroll-indicator">
                    <FaChevronLeft />
                    <span>Arraste para ver mais</span>
                    <FaChevronRight />
                </div>
            )}
        </div>
    );
}
