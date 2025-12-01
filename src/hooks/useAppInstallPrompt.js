import { useState, useEffect } from 'react';
import { isMobileDevice, isDesktop } from '../utils/deviceDetection';

export const useAppInstallPrompt = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verifica se já mostrou o modal nesta sessão
    const hasShownModal = sessionStorage.getItem('appInstallPromptShown');
    
    if (!hasShownModal) {
      const mobile = isMobileDevice();
      const desktop = isDesktop();
      
      setIsMobile(mobile);
      
      // Mostra o modal após 3 segundos na primeira visita
      const timer = setTimeout(() => {
        if (mobile || desktop) {
          setShowModal(true);
          sessionStorage.setItem('appInstallPromptShown', 'true');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return {
    showModal,
    isMobile,
    closeModal,
    openModal
  };
};
