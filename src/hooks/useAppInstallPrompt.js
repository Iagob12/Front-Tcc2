import { useState, useEffect } from 'react';
import { isMobileDevice } from '../utils/deviceDetection';

export const useAppInstallPrompt = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Só mostra em dispositivos móveis
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    
    // Não mostra modal automaticamente - apenas o banner inferior aparece
    // O modal só será mostrado se chamado manualmente via openModal()
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
