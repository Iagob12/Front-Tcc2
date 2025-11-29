import "../../styles/TornarVoluntario/SerVoluntario/style.css";
import Button from "../Button";
import Header from "../Header";
import { useState, useEffect } from "react";
import { apiPost, apiGet } from "../../config/api";
import { useNavigate } from "react-router-dom";

const SerVoluntario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dataNascimento: "",
    telefone: "",
    endereco: "",
    cpf: "",
    descricao: "",
  });

  const [idUsuario, setIdUsuario] = useState(null);
  const [jaVoluntario, setJaVoluntario] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUsuario = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const email = userData.email;
      if (!email) {
        setLoading(false);
        return;
      }

      // Buscar lista de usuários (se sua API tiver endpoint direto por email, pode usar)
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
      setIdUsuario(userId);

      // Verificar se já existe um registro de voluntário para esse usuário
      const responseVoluntarioUsuario = await apiGet(`/voluntario/usuario/${userId}`);
      if (responseVoluntarioUsuario.ok) {
        const voluntario = await responseVoluntarioUsuario.json();
        if (voluntario) {
          setJaVoluntario(true);
          // redireciona direto para dashboard (já tem inscrição)
          navigate("/dashboard-voluntario");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    };

    buscarUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idUsuario) {
      alert("Usuário não identificado. Faça login e tente novamente.");
      return;
    }

    const dadosParaEnviar = {
      idUsuario: idUsuario,
      cpf: formData.cpf,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
      endereco: formData.endereco,
      descricao: formData.descricao,
    };

    try {
      const response = await apiPost("/voluntario/tornar", dadosParaEnviar);
      
      if (response.ok) {
        alert("Inscrição como voluntário realizada com sucesso!");
        setFormData({
          dataNascimento: "",
          telefone: "",
          endereco: "",
          cpf: "",
          descricao: "",
        });
        navigate("/dashboard-voluntario");
      } else {
        // Tentar pegar a mensagem de erro do backend
        const errorText = await response.text();
        let errorMessage = "Não foi possível se inscrever como voluntário.";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.mensagem || errorMessage;
        } catch {
          // Se não for JSON, usar o texto direto
          errorMessage = errorText || errorMessage;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro:", error);
      // Verificar se é um erro de validação do backend
      if (error.message) {
        alert(error.message);
      } else {
        alert("Erro ao se inscrever como voluntário. Tente novamente.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-ser-voluntario">
          <div className="content-ser-voluntario">
            <h1>Inscrição de voluntário</h1>
            <p>Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container-ser-voluntario">
        <div className="content-ser-voluntario">
          <h1>Inscrição de voluntário</h1>

          {jaVoluntario ? (
            <p>Você já tem uma inscrição como voluntário. Você será redirecionado ao painel.</p>
          ) : (
            <form className="form-ser-voluntario" onSubmit={handleSubmit}>
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                name="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleChange}
              />

              <label htmlFor="telefone">Número de telefone</label>
              <input
                name="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleChange}
              />

              <label htmlFor="endereco">Endereço</label>
              <input
                name="endereco"
                type="text"
                placeholder="Digite seu endereço"
                value={formData.endereco}
                onChange={handleChange}
              />

              <label htmlFor="cpf">Seu CPF</label>
              <input
                name="cpf"
                type="text"
                placeholder="Digite seu CPF..."
                value={formData.cpf}
                onChange={handleChange}
              />

              <label htmlFor="descricao">Porque quero me voluntariar?</label>
              <textarea
                name="descricao"
                placeholder="Escreva o motivo de querer se voluntariar..."
                value={formData.descricao}
                onChange={handleChange}
              />

              <Button text={"Enviar"} />
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SerVoluntario;
