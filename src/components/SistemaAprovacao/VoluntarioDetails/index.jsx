import "../../../styles/PageSistemaAprovacao/VoluntarioDetails/style.css";
import { FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../../config/api";

const VoluntarioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voluntario, setVoluntario] = useState(null);

  const fetchVoluntario = async () => {
    try {
      const response = await apiGet(`/voluntario/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVoluntario(data);
      } else {
        alert("Erro ao buscar voluntário!");
      }
    } catch (error) {
      console.error("Erro ao carregar voluntário:", error);
    }
  };

  useEffect(() => {
    fetchVoluntario();
  }, [id]);

  const handleAprovar = async () => {
    try {
      const response = await apiPut(`/voluntario/aprovar/${id}`);
      if (response.ok) {
        const data = await response.json();
        alert(data.mensagem || "Voluntário aprovado com sucesso!");
        navigate(-1);
      } else {
        alert("Erro ao aprovar voluntário!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição!");
    }
  };

  const handleCancelar = async () => {
    try {
      const response = await apiPut(`/voluntario/cancelar/${id}`);
      if (response.ok) {
        const data = await response.json();
        alert(data.mensagem || "Voluntário cancelado com sucesso! Em 1 hora, será deletado!");
        navigate("/sistema-aprovacao");
      } else {
        alert("Erro ao cancelar voluntário!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição!");
    }
  };

  if (!voluntario) return <p>Carregando...</p>;

  return (
    <div className="container-detalhes-voluntario">
      <div className="cabecalho-detalhes-voluntario">
        <h2>Detalhes do Voluntário</h2>
        <FaTimes className="icon-fechar" onClick={() => navigate(-1)} />
      </div>

      <section className="detalhes-voluntario">
        {/* Foto de Perfil */}
        <div className="field-detalhes-voluntario foto-perfil-container">
          <img 
            src={voluntario.idUsuario?.imagemPerfil || "https://via.placeholder.com/150?text=Sem+Foto"} 
            alt="Foto de perfil" 
            className="foto-perfil-voluntario"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=Sem+Foto";
            }}
          />
        </div>

        <div className="field-detalhes-voluntario">
          <p className="field-name">Nome completo</p>
          <p className="field-detalhe">{voluntario.idUsuario?.nome}</p>
        </div>

        <div className="field-detalhes-voluntario">
          <p className="field-name">Email</p>
          <p className="field-detalhe">{voluntario.idUsuario?.email}</p>
        </div>

        <div className="field-detalhes-voluntario">
          <p className="field-name">Data de Nascimento</p>
          <p className="field-detalhe">
            {voluntario.dataNascimento?.split("-").reverse().join("/")}
          </p>
        </div>

        <div className="field-detalhes-voluntario">
          <p className="field-name">Número de Telefone</p>
          <p className="field-detalhe">{voluntario.telefone}</p>
        </div>

        <div className="field-detalhes-voluntario">
          <p className="field-name">Por que quero me voluntariar</p>
          <p className="field-detalhe">{voluntario.descricao}</p>
        </div>

        <div className="opcoes-aprovar">
          {voluntario.status !== "APROVADO" && (
            <button onClick={handleAprovar}>Aprovar</button>
          )}
          {voluntario.status !== "CANCELADO" && (
            <button onClick={handleCancelar}>Cancelar</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default VoluntarioDetails;
