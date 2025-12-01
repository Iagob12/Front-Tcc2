import React from 'react';
import { X, Smartphone, Monitor } from 'lucide-react';
import './style.css';

const ModalInstalarApp = ({ isOpen, onClose, isMobile = false }) => {
  if (!isOpen) return null;

  const appDownloadLink = 'https://expo.dev/artifacts/eas/5RAxAaWjAWsKWxDCVDu6V9.apk';

  return (
    <div className="modal-app-overlay" onClick={onClose}>
      <div className="modal-app-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-app-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-app-content">
          {isMobile ? (
            <>
              <Smartphone size={64} className="modal-app-icon" />
              <h2>Melhor experiência no App!</h2>
              <p>
                Para acessar todas as funcionalidades e ter a melhor experiência,
                baixe nosso aplicativo.
              </p>
              <a 
                href={appDownloadLink} 
                className="btn-download-app"
                download
              >
                Baixar Aplicativo
              </a>
              <button className="btn-continuar-web" onClick={onClose}>
                Continuar no navegador
              </button>
            </>
          ) : (
            <>
              <Monitor size={64} className="modal-app-icon" />
              <h2>Baixe nosso App!</h2>
              <p>
                Escaneie o QR Code abaixo com seu celular para baixar nosso aplicativo
                e ter acesso a todas as funcionalidades.
              </p>
              <div className="qrcode-container">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appDownloadLink)}`}
                  alt="QR Code para download do app"
                  className="qrcode-image"
                />
              </div>
              <p className="qrcode-hint">
                Ou acesse diretamente: <br />
                <a href={appDownloadLink} target="_blank" rel="noopener noreferrer">
                  Link de Download
                </a>
              </p>
              <button className="btn-fechar" onClick={onClose}>
                Fechar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalInstalarApp;
