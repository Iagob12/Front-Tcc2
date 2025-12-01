import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../../../styles/TornarVoluntario/DashBoardVoluntario/style.css";
import { apiGet } from "../../../config/api";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";


const DashboardVoluntario = () => {
  const [statusNum, setStatusNum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voluntario, setVoluntario] = useState(null);

  useEffect(() => {
    const carregarStatus = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const email = userData.email;
      if (!email) {
        setLoading(false);
        return;
      }

      const responseUsuarios = await apiGet("/usuario/todos");
      if (!responseUsuarios.ok) {
        setLoading(false);
        return;
      }
      const usuarios = await responseUsuarios.json();
      const usuario = usuarios.find((u) => u.email === email);
      if (!usuario) {
        setLoading(false);
        return;
      }

      const userId = usuario.id || usuario.idUsuario;
      const responseVol = await apiGet(`/voluntario/usuario/${userId}`);

      if (!responseVol.ok) {
        setStatusNum(0);
        setLoading(false);
        return;
      }

      const vol = await responseVol.json();
      setVoluntario(vol);

      const status = (vol.status || "").toUpperCase();
      let mapped = 1;

      if (status.includes("APROV")) mapped = 2;
      else if (status.includes("CANCEL") || status.includes("NEGADO")) mapped = -1;
      else mapped = 1;

      setStatusNum(mapped);
      setLoading(false);
    };

    carregarStatus();
  }, []);

  return (
    <>
      <Header />
      <div className="dash-container">
        <div className="dash-card">
          <h1>Inscrição de voluntário</h1>
          <p>Acompanhe o seu processo de inscrição</p>

          {loading ? (
            <p>Carregando status...</p>
          ) : statusNum === 0 ? (
            <div className="dash-empty">
              <p>Você ainda não tem uma inscrição de voluntário.</p>
            </div>
          ) : statusNum === -1 ? (
            <div className="dash-denied">
              <h3>❌ Solicitação negada!</h3>
              <p>Em 1 hora você poderá fazer uma nova solicitação.</p>
            </div>
          ) : (
            <div className="dash-steps">
              <div className={`step ${statusNum >= 1 ? "active" : ""}`}>
                <span className="icon-carta"><FaEnvelope /></span>
                <p>Formulário enviado aos administradores</p>
              </div>

              <div className={`step ${statusNum >= 2 ? "active approved" : ""}`}>
                <span className="icon-aprovado"><FaCheckCircle /></span>
                <p>Formulário aprovado</p>
              </div>

              {voluntario && statusNum === 2 && (
                <div className="approved-meta">
                  <p>
                    <strong>Aprovado em:</strong>{" "}
                    {voluntario.dataVoluntario
                      ? new Date(voluntario.dataVoluntario).toLocaleString()
                      : "—"}
                  </p>
                  {voluntario.descricao && (
                    <p>
                      <strong>Sua mensagem:</strong> {voluntario.descricao}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardVoluntario;
