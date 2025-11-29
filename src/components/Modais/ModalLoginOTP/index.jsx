import { useState, useEffect, useRef } from 'react';
import { X, Mail, Key } from 'lucide-react';
import "../../../styles/Modais/ModalOTP/style.css";
import { apiPost } from '../../../config/api';

export function UseModalLoginOTP() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}

export function ModalLoginOTP({ isOpen, onClose, onSuccess }) {
  const dialogRef = useRef(null);
  const [step, setStep] = useState(1); // 1: solicitar OTP, 2: inserir OTP
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.classList.add('modal-open');
    } else {
      dialog.close();
      document.body.classList.remove('modal-open');
      // Reset ao fechar
      setStep(1);
      setEmail('');
      setCodigo('');
      setMessage('');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleSolicitarOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiPost('/auth/request-otp', { email });

      if (response.ok) {
        setMessage('Código OTP enviado para seu email!');
        setTimeout(() => {
          setStep(2);
          setMessage('');
        }, 1500);
      } else {
        const error = await response.json();
        let errorMsg = error.error || error.message || 'Erro ao solicitar código';
        
        // Mensagens mais amigáveis
        if (response.status === 404) {
          errorMsg = 'Email não encontrado. Verifique se está cadastrado.';
        } else if (response.status === 403) {
          errorMsg = 'Email não verificado. Verifique seu email primeiro.';
        } else if (response.status === 429) {
          errorMsg = 'Muitas tentativas. Aguarde 1 hora.';
        }
        
        setMessage(errorMsg);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao solicitar código');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiPost('/auth/login-otp', { email, token: codigo });

      if (response.ok) {
        const data = await response.json();
        setMessage('Login realizado com sucesso!');
        
        // Salvar dados do usuário no localStorage
        const userData = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          role: data.role,
          imagemPerfil: data.imagemPerfil
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userLoggedIn', 'true');
        
        // Disparar evento para atualizar o Header
        window.dispatchEvent(new Event('loginSuccess'));
        
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Código inválido ou expirado');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="modal-wrapper-otp">
        <div className="modal-card modal-otp">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-icon">
              {step === 1 ? <Mail size={32} /> : <Key size={32} />}
            </div>
            <button onClick={onClose} className="modal-close-btn">
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <h1 className="modal-title">Login com Código</h1>

            {step === 1 ? (
              <>
                <p className="modal-subtitle">
                  Digite seu email para receber um código de acesso
                </p>

                <form onSubmit={handleSolicitarOTP} className="otp-form">
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="form-input"
                      autoFocus
                    />
                  </div>

                  {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="modal-subtitle">
                  Digite o código enviado para<br />
                  <strong>{email}</strong>
                </p>

                <form onSubmit={handleLoginOTP} className="otp-form">
                  <div className="form-group">
                    <label htmlFor="codigo">Código OTP</label>
                    <input
                      type="text"
                      id="codigo"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      placeholder="Digite o código de 6 dígitos"
                      maxLength="6"
                      required
                      className="form-input"
                      autoFocus
                    />
                  </div>

                  {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn-submit"
                      disabled={loading || codigo.length < 6}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-back"
                    >
                      Voltar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
