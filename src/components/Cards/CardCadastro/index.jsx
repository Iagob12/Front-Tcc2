import React, { useState } from "react";
import "../../../styles/Cards/CardFormulario/style.css";
import Button from "../../../components/Button";
import google from "../../../assets/CardCadastro/google.png";
import { useNavigate } from "react-router-dom";
import { ModalVerificarEmail, UseModalVerificarEmail } from "../../Modais/ModalVerificarEmail";
import { ModalRecuperarSenha, UseModalRecuperarSenha } from "../../Modais/ModalRecuperarSenha";
import { ModalLoginOTP, UseModalLoginOTP } from "../../Modais/ModalLoginOTP";
import { apiPost, createApiUrl } from '../../../config/api';
import { useToast } from '../../Toast/useToast';
import ToastContainer from '../../Toast/ToastContainer';
import PasswordValidator from '../../PasswordValidator';

const CardCadastro = ({ title, action }) => {
    const navigate = useNavigate();
    
    // Modais
    const modalVerificarEmail = UseModalVerificarEmail();
    const modalRecuperarSenha = UseModalRecuperarSenha();
    const modalLoginOTP = UseModalLoginOTP();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPasswordValidator, setShowPasswordValidator] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (loading) return; // Prevenir múltiplos cliques
        
        setLoading(true);
        
        try {
            const endpoint =
                title === "Login"
                    ? '/auth/login'
                    : '/auth/register-modern';

            const body =
                title === "Login"
                    ? { email: formData.email, senha: formData.senha }
                    : formData;

            // Se for cadastro, abrir modal imediatamente
            if (title !== "Login") {
                modalVerificarEmail.open(formData.email);
            }

            const response = await apiPost(endpoint, body);

            if (response.ok) {
                const data = await response.json();
                
                if (title === "Login") {
                    toast.success("Login realizado com sucesso!");
                    
                    // Limpar TODOS os dados antigos do localStorage antes de salvar novos
                    localStorage.clear();
                    
                    // Salvar dados do usuário no localStorage
                    const userData = {
                        id: data.id,
                        nome: data.nome,
                        email: data.email,
                        role: data.role,
                        imagemPerfil: data.imagemPerfil || ""
                    };
                    
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('userLoggedIn', 'true');
                    
                    // Disparar evento para atualizar o Header
                    window.dispatchEvent(new Event('loginSuccess'));
                    setTimeout(() => navigate("/"), 500);
                } else {
                    // Cadastro bem-sucedido - modal já está aberto
                    toast.success("Cadastro realizado! Verifique seu e-mail.");
                    console.log("✅ Cadastro realizado! Email enviado.");
                }
            } else if (response.status === 401) {
                toast.error("E-mail ou senha incorretos.");
            } else if (response.status === 403) {
                const error = await response.json();
                toast.warning(error.message || "Email não verificado. Verifique sua caixa de entrada.");
            } else if (response.status === 400) {
                const error = await response.json();
                // Mensagem específica para erro de validação de senha
                if (error.message && error.message.includes("senha")) {
                    toast.error("Senha não atende aos requisitos de segurança. Verifique as orientações abaixo.");
                } else {
                    toast.error(error.message || "Dados inválidos. Verifique os campos.");
                }
                // Se for cadastro e deu erro, fechar o modal
                if (title !== "Login") {
                    modalVerificarEmail.close();
                }
            } else {
                const error = await response.json();
                toast.error(error.message || "Erro ao processar requisição.");
                // Se for cadastro e deu erro, fechar o modal
                if (title !== "Login") {
                    modalVerificarEmail.close();
                }
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
            // Se for cadastro e deu erro, fechar o modal
            if (title !== "Login") {
                modalVerificarEmail.close();
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Novo handler para login com Google
    const handleGoogleLogin = () => {
        window.location.href = createApiUrl('/oauth2/authorization/google');
    };

    return (
        <>
            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
            <div className="background-card">
                <div className="card-formulario">
                <h1>{title}</h1>
                <div className="inputs">
                    {title !== "Login" && (
                        <div className="input">
                            <label htmlFor="nome">Nome completo</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="input">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            onFocus={() => title !== "Login" && setShowPasswordValidator(true)}
                            onBlur={() => setShowPasswordValidator(false)}
                            required
                        />
                        {title !== "Login" && (
                            <PasswordValidator 
                                password={formData.senha} 
                                show={showPasswordValidator || formData.senha.length > 0}
                            />
                        )}
                    </div>
                </div>

                <Button 
                    text={loading ? "Processando..." : action} 
                    onClick={handleSubmit}
                    disabled={loading}
                />

                {/* Opções extras para Login */}
                {title === "Login" && (
                    <div className="login-extras">
                        <button 
                            type="button"
                            className="link-button"
                            onClick={() => modalRecuperarSenha.open()}
                        >
                            Esqueci minha senha
                        </button>
                        <span className="separator">|</span>
                        <button 
                            type="button"
                            className="link-button"
                            onClick={() => modalLoginOTP.open()}
                        >
                            Entrar com código
                        </button>
                    </div>
                )}

                <div className="opcoes-login">
                    {title !== "Login" ? (
                        <p className="criar-conta">
                            já tem uma conta?
                            <span onClick={() => navigate("/login")}> Faça login </span>
                        </p>
                    ) : (
                        <p className="criar-conta">
                            não tem uma conta?
                            <span onClick={() => navigate("/cadastrar-se")}> Cadastre-se aqui </span>
                        </p>
                    )}

                    <div className="social-buttons">
                        {/* Botão Google que redireciona para o backend */}
                        <button
                            className="social-btn google"
                            onClick={handleGoogleLogin}
                            title="Entrar com Google"
                        >
                            <img src={google} alt="Google" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modais */}
            <ModalVerificarEmail 
                isOpen={modalVerificarEmail.isOpen}
                onClose={modalVerificarEmail.close}
                email={modalVerificarEmail.email}
                onSuccess={() => navigate("/login")}
            />

            <ModalRecuperarSenha 
                isOpen={modalRecuperarSenha.isOpen}
                onClose={modalRecuperarSenha.close}
            />

            <ModalLoginOTP 
                isOpen={modalLoginOTP.isOpen}
                onClose={modalLoginOTP.close}
                onSuccess={() => navigate("/")}
            />
            </div>
        </>
    );
};

export default CardCadastro;
