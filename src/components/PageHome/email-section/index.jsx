import { useState } from "react";
import "../../../styles/Home/Email-section/style.css"
import Button from "../../Button"
import { apiPost } from "../../../config/api";
import { useToast } from '../../Toast/useToast';
import ToastContainer from '../../Toast/ToastContainer';

const EmailSection = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.trim()) {
            toast.warning("Por favor, insira um email válido.");
            return;
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.warning("Por favor, insira um email válido.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiPost('/newsletter/inscrever', { email });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || "Inscrição realizada com sucesso!");
                setEmail("");
            } else {
                const error = await response.json();
                toast.error(error.message || "Erro ao realizar inscrição.");
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao realizar inscrição. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
            <section className="email-section">
                <div className="email-container">
                    <div className="email-content">
                        <div className="email-info">
                            <h2>Fique por dentro!</h2>
                            <p>Receba notificações dos nossos eventos e atividades!</p>
                        </div>
                        
                        <div className="email-input">
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="email" 
                                    placeholder="Seu email aqui"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <Button 
                                    text={loading ? "Enviando..." : "Enviar"} 
                                    primary={true}
                                    type="submit"
                                    disabled={loading}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default EmailSection