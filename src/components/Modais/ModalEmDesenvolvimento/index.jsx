import React, { useState } from 'react';
import './style.css';
import { Copy, Check, X } from 'lucide-react';
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
    <div className="modal-overlay-doacao" onClick={onClose}>
      <div className="modal-content-doacao" onClick={(e) => e.stopPropagation()}>
        
        {/* Botão Fechar */}
        <button className="modal-close-x" onClick={onClose} aria-label="Fechar">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="modal-header-doacao">
          <div className="header-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="modal-title-doacao">Doe via PIX</h2>
          <p className="modal-subtitle-doacao">Sua contribuição faz a diferença</p>
        </div>

        {/* Body */}
        <div className="modal-body-doacao">
          
          {/* QR Code */}
          <div className="qrcode-section">
            <p className="qrcode-instruction">Escaneie o QR Code com seu app de pagamento</p>
            <div className="qrcode-wrapper">
              <img className='qrcode-img' src={qrcode} alt="QRCode PIX" />
            </div>

            <button 
              className={`btn-copy ${copiado ? 'copied' : ''}`}
              onClick={copiarPixCode}
            >
              {copiado ? (
                <>
                  <Check size={20} />
                  <span>Chave Copiada!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>Copiar Chave PIX</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer-doacao">
          <p className="footer-text">
            <strong>Voluntários Pro Bem</strong> • Fazendo o bem, fazendo a diferença
          </p>
        </div>

      </div>
    </div>
  );
};

export default ModalEmDesenvolvimento;
