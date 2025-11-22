import React from "react";
import "../../../styles/Cards/CardEventos/style.css"
import Button from "../../Button"
import { useAuth } from "../../../hooks/useAuth";
import { FaCalendarAlt, FaMapMarkerAlt, FaTrash, FaPen } from "react-icons/fa";

const CardEventos = ({ img, titulo, local, data, onDelete, id }) => {
    const { isAdmin } = useAuth();

    const handleDelete = () => {
            onDelete(id);
    };

    return (
        <div className="cardEventos-container">
            <img src={img} alt="Evento" />
            <div className="cardEventos-info">
                <h2>{titulo}</h2>
                <div className="dados-evento">
                    <p>
                        <FaMapMarkerAlt className="endereco" style={{ marginRight: "8px" }} />{local}</p>
                    <p>
                        <FaCalendarAlt className="data" style={{ marginRight: "8px" }} />
                        {data}</p>
                    <Button className="btn" text={"Saiba mais"} primary={true} />
                </div>
                {isAdmin && (
                    <div className="opcoes-modificar-evento">
                        <p>
                            <FaTrash 
                                style={{ color: "red", cursor: "pointer" }} 
                                onClick={handleDelete}
                            />
                        </p>
                        <p>
                            <FaPen
                                style={{ cursor: "pointer" }}
                            />
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CardEventos;
