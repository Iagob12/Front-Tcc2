import React, { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { isMobileDevice } from '../../utils/deviceDetection';
import './style.css';

const AppPromoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    
    // Verifica se o banner já foi fechado nesta sessão
    const bannerClosed = sessionStorage.getItem('appPromoBannerClosed');
    
    if (mobile && !bannerClosed) {
      // Mostra o banner após 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('appPromoBannerClosed', 'true');
  };

  const handleDownload = () => {
    window.location.href = 'https://expo.dev/artifacts/eas/5RAxAaWjAWsKWxDCVDu6V9.apk';
  };

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
