/**
 * Valida se uma URL de imagem é válida
 * @param {*} imageUrl - URL da imagem para validar
 * @returns {boolean} - true se a URL é válida, false caso contrário
 */
export const isValidImageUrl = (imageUrl) => {
  return (
    imageUrl !== null &&
    imageUrl !== undefined &&
    typeof imageUrl === 'string' &&
    imageUrl.trim() !== '' &&
    imageUrl !== 'null' &&
    imageUrl !== 'undefined'
  );
};

/**
 * Retorna uma URL de imagem válida ou um placeholder
 * @param {*} imageUrl - URL da imagem
 * @param {string} placeholder - URL do placeholder (opcional)
 * @returns {string} - URL válida ou placeholder
 */
export const getValidImageUrl = (imageUrl, placeholder = null) => {
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  return placeholder;
};

/**
 * Retorna true se deve mostrar a imagem, false se deve mostrar o ícone padrão
 * @param {*} imageUrl - URL da imagem
 * @returns {boolean}
 */
export const shouldShowImage = (imageUrl) => {
  return isValidImageUrl(imageUrl);
};
