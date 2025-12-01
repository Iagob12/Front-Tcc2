import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Smartphone } from 'lucide-react';
import { isMobileDevice } from '../../utils/deviceDetection';
import './style.css';

/**
 * Componente de aviso para páginas não otimizadas para mobile
 * Mostra um aviso sugerindo o uso do app para melhor experiência
 */
const MobileWarning = ({ pageName = "esta página" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    
    // Verifica se o aviso já foi fechado para esta página
    const warningKey = `mobileWarning_${pageName}_closed`;
    const warningClosed = sessionStorage.getItem(warningKey);
    
    if (mobile && !warningClosed) {
      // Mostra o aviso após 1 segundo
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pageName]);

  const handleClose = () => {
    setIsVisible(false);
    const warningKey = `mobileWarning_${pageName}_closed`;
    sessionStorage.setItem(warningKey, 'true');
  };

  const handleDownload = () => {
    window.location.href = 'https://expo.dev/artifacts/eas/5RAxAaWjAWsKWxDCVDu6V9.apk';
  };

  if (!isVisible || !isMobile) return null;

  return (
    <div className="mobile-warning-overlay">
      <div className="mobile-warning-container">
        <button className="mobile-warning-close" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <div className="mobile-warning-icon">
          <AlertCircle size={48} />
        </div>
        
        <h3 className="mobile-warning-title">
          Melhor experiência no App
        </h3>
        
        <p className="mobile-warning-text">
          {pageName} está otimizada para desktop. Para acessar todas as funcionalidades 
          com facilidade no celular, recomendamos nosso aplicativo.
        </p>
        
        <div className="mobile-warning-actions">
          <button className="mobile-warning-btn-primary" onClick={handleDownload}>
            <Smartphone size={20} />
            Baixar Aplicativo
          </button>
          <button className="mobile-warning-btn-secondary" onClick={handleClose}>
            Continuar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileWarning;
