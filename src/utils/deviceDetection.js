// Utilitário para detectar dispositivos móveis
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Verifica se é um dispositivo móvel
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent.toLowerCase());
};

// Verifica se é tablet
export const isTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
};

// Verifica se é desktop
export const isDesktop = () => {
  return !isMobileDevice() && !isTablet();
};

// Verifica largura da tela
export const getScreenSize = () => {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};
