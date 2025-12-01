import React, { useState } from 'react';
import './style.css';
import { Copy, Check } from 'lucide-react';
import qrcode from "../../../assets/QRCode/qrcode_pix.png"

const ModalEmDesenvolvimento = ({ isOpen, onClose }) => {
  const [copiado, setCopiado] = useState(false);
  const pixCode = "00020126330014BR.GOV.BCB.PIX0111478329968465204000053039865802BR5924Thiago Campos de Resende6009SAO PAULO62140510x0SiJfuUAP6304B6F3";

  if (!isOpen) return null;

  const copiarPixCode = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar o código PIX');
    });
  };

  return (
    <div className="modal-overlay-dev" onClick={onClose}>
      <div className="modal-content-dev" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-dev">
          <h2 className="modal-title-dev">Sistema de Doações</h2>
        </div>

        <div className="modal-body-dev">
          <p className="modal-text-dev">
            Faça uma doação agora mesmo, via Pix!
          </p>
          
          <div className="qrcode-container-dev">
            <img className='qrcode' src={qrcode} alt="QRCode para Pix" />
          </div>

          <div className="pix-code-section">
            <p className="pix-code-label">Ou copie o código PIX:</p>
            <div className="pix-code-box">
              <input 
                type="text" 
                value={pixCode} 
                readOnly 
                className="pix-code-input"
              />
              <button 
                className={`copy-button ${copiado ? 'copied' : ''}`}
                onClick={copiarPixCode}
                title={copiado ? "Copiado!" : "Copiar código"}
              >
                {copiado ? (
                  <>
                    <Check size={18} />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer-dev">
          <button className="modal-button-dev modal-close-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEmDesenvolvimento;
