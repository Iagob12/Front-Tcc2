import React, { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { isMobileDevice } from '../../utils/deviceDetection';
import './style.css';

const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutos em milissegundos

const AppPromoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkAndShowBanner = () => {
    const lastClosed = localStorage.getItem('appPromoBannerLastClosed');
    const now = Date.now();
    
    // Se nunca fechou ou já passou 5 minutos desde o último fechamento
    if (!lastClosed || (now - parseInt(lastClosed)) >= FIVE_MINUTES) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    
    if (!mobile) return;

    // Mostra o banner após 2 segundos
    const initialTimer = setTimeout(() => {
      checkAndShowBanner();
    }, 2000);

    // Verifica a cada 5 minutos se deve mostrar novamente
    const intervalTimer = setInterval(() => {
      checkAndShowBanner();
    }, FIVE_MINUTES);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Salva o timestamp de quando foi fechado
    localStorage.setItem('appPromoBannerLastClosed', Date.now().toString());
  };

  const handleDownload = () => {
    window.location.href = 'https://expo.dev/artifacts/eas/5RAxAaWjAWsKWxDCVDu6V9.apk';
  };

  // Só mostra em dispositivos móveis
  if (!isVisible || !isMobile) return null;

  return (
    <div className="app-promo-banner">
      <button className="banner-close" onClick={handleClose}>
        <X size={20} />
      </button>
      <div className="banner-content">
        <Smartphone size={32} className="banner-icon" />
        <div className="banner-text">
          <h4>Melhor no App!</h4>
          <p>Baixe nosso aplicativo para uma experiência completa</p>
        </div>
        <button className="banner-download-btn" onClick={handleDownload}>
          Baixar
        </button>
      </div>
    </div>
  );
};

export default AppPromoBanner;
