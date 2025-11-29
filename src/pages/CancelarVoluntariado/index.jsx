import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { apiPost } from '../../config/api';
import { useToast } from '../../components/Toast/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import './style.css';

const CancelarVoluntariado = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [etapa, setEtapa] = useState('confirmacao'); // 'confirmacao', 'codigo'
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolicitarCodigo = async () => {
    setLoading(true);
    try {
      const response = await apiPost('/voluntario/solicitar-cancelamento');
      if (response.ok) {
        setEtapa('codigo');
        toast.success('Código enviado para seu email!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao solicitar cancelamento');
      }
    } catch (error) {
      toast.error('Erro ao solicitar cancelamento');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarCancelamento = async (e) => {
    e.preventDefault();
    
    if (codigo.length !== 6) {
      toast.warning('Digite o código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const response = await apiPost('/voluntario/confirmar-cancelamento', { codigo });
      if (response.ok) {
        toast.success('Voluntariado cancelado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Código inválido');
        setCodigo('');
      }
    } catch (error) {
      toast.error('Erro ao confirmar cancelamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="container-cancelar-voluntariado">
        <div className="content-cancelar">
          {etapa === 'confirmacao' && (
            <>
              <div className="icon-warning">⚠️</div>
              <h1>Cancelar Voluntariado</h1>
              
              <p className="aviso-principal">
                Ao cancelar seu voluntariado, você perderá acesso a:
              </p>

              <ul className="lista-perdas">
                <li>
                  <span className="icon-close">✕</span>
                  Eventos exclusivos para voluntários
                </li>
                <li>
                  <span className="icon-close">✕</span>
                  Gerenciamento de atividades
                </li>
                <li>
                  <span className="icon-close">✕</span>
                  Badge de voluntário no perfil
                </li>
              </ul>

              <div className="info-box">
                <span className="icon-info">ℹ️</span>
                <p>Você pode se tornar voluntário novamente a qualquer momento!</p>
              </div>

              <div className="botoes-confirmacao">
                <button
                  className="btn-cancelar-voluntariado"
                  onClick={handleSolicitarCodigo}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : '📧 Enviar Código de Confirmação'}
                </button>
                <button
                  className="btn-voltar"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Voltar
                </button>
              </div>
            </>
          )}

          {etapa === 'codigo' && (
            <>
              <div className="icon-mail">📧</div>
              <h1>Digite o Código</h1>
              
              <p className="aviso-principal">
                Enviamos um código de 6 dígitos para seu email. Digite-o abaixo para confirmar o cancelamento.
              </p>

              <form onSubmit={handleConfirmarCancelamento}>
                <input
                  type="text"
                  className="input-codigo"
                  placeholder="000000"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />

                <div className="info-box warning">
                  <span className="icon-time">⏰</span>
                  <p>O código expira em 15 minutos</p>
                </div>

                <div className="botoes-confirmacao">
                  <button
                    type="submit"
                    className="btn-cancelar-voluntariado"
                    disabled={loading || codigo.length !== 6}
                  >
                    {loading ? 'Confirmando...' : 'Confirmar Cancelamento'}
                  </button>
                  <button
                    type="button"
                    className="btn-voltar"
                    onClick={handleSolicitarCodigo}
                    disabled={loading}
                  >
                    Reenviar Código
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CancelarVoluntariado;
