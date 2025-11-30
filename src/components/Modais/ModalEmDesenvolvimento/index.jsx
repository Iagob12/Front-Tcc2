import React from 'react';
import './style.css';
import { Construction, Heart, CreditCard, Shield } from 'lucide-react';
import qrcode from "../../../assets/QRCode/qrcode_pix.png"

const ModalEmDesenvolvimento = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          
          {/* <div className="modal-features-dev">
            <div className="feature-item-dev">
              <Heart size={24} className="feature-icon-dev" />
              <span>Doações únicas ou mensais</span>
            </div>
            <div className="feature-item-dev">
              <CreditCard size={24} className="feature-icon-dev" />
              <span>Múltiplas formas de pagamento</span>
            </div>
            <div className="feature-item-dev">
              <Shield size={24} className="feature-icon-dev" />
              <span>Transações 100% seguras</span>
            </div>
          </div>

          <p className="modal-subtext-dev">
            Enquanto isso, você pode se tornar um voluntário e ajudar de outras formas!
          </p> */}

          <img className='qrcode' src={qrcode} alt="QRCode para Pix" />

        </div>

        <div className="modal-footer-dev">
          <button className="modal-button-dev" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEmDesenvolvimento;
