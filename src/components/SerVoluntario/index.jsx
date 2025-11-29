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
  const [statusVoluntario, setStatusVoluntario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funções de formatação
  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    let cpfFormatado = numeros;
    
    if (numeros.length >= 3) {
      cpfFormatado = numeros.slice(0, 3);
      if (numeros.length >= 4) {
        cpfFormatado += '.' + numeros.slice(3, 6);
      }
      if (numeros.length >= 7) {
        cpfFormatado += '.' + numeros.slice(6, 9);
      }
      if (numeros.length >= 10) {
        cpfFormatado += '-' + numeros.slice(9, 11);
      }
    }
    
    return cpfFormatado;
  };

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    let telefoneFormatado = numeros;
    
    if (numeros.length >= 2) {
      telefoneFormatado = '(' + numeros.slice(0, 2);
      if (numeros.length >= 3) {
        telefoneFormatado += ') ' + numeros.slice(2, 7);
      }
      if (numeros.length >= 8) {
        telefoneFormatado += '-' + numeros.slice(7, 11);
      }
    }
    
    return telefoneFormatado;
  };

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
          setStatusVoluntario(voluntario.status);
          
          // Se está PENDENTE ou APROVADO, bloquear acesso
          if (voluntario.status === 'PENDENTE' || voluntario.status === 'APROVADO') {
            setLoading(false);
            return;
          }
        }
      }

      setLoading(false);
    };

    buscarUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplicar formatação para CPF e telefone
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatarCPF(value) }));
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatarTelefone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        
        // Mensagens específicas
        if (errorMessage.includes("CPF inválido")) {
          alert("❌ CPF inválido. Verifique o número digitado e tente novamente.");
        } else if (errorMessage.includes("em análise") || errorMessage.includes("PENDENTE")) {
          alert("⏳ Você já possui um pedido para se tornar voluntário em análise. Aguarde a aprovação.");
        } else if (errorMessage.includes("18 anos")) {
          alert("⚠️ Você precisa ter 18 anos ou mais para se tornar voluntário.");
        } else {
          alert(errorMessage);
        }
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

          {jaVoluntario && (statusVoluntario === 'PENDENTE' || statusVoluntario === 'APROVADO') ? (
            <div className="mensagem-bloqueio">
              {statusVoluntario === 'PENDENTE' ? (
                <>
                  <div className="icone-bloqueio">⏳</div>
                  <h2>Pedido em Análise</h2>
                  <p>Você já possui um pedido para se tornar voluntário que está sendo analisado.</p>
                  <p>Aguarde a aprovação da equipe. Você será notificado por email assim que houver uma resposta.</p>
                  <button 
                    className="btn-voltar" 
                    onClick={() => navigate("/dashboard-voluntario")}
                  >
                    Ir para Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div className="icone-bloqueio">✅</div>
                  <h2>Você já é um Voluntário!</h2>
                  <p>Seu pedido foi aprovado e você já faz parte da nossa equipe de voluntários.</p>
                  <button 
                    className="btn-voltar" 
                    onClick={() => navigate("/dashboard-voluntario")}
                  >
                    Ir para Dashboard
                  </button>
                </>
              )}
            </div>
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
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
                maxLength={15}
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
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                maxLength={14}
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
