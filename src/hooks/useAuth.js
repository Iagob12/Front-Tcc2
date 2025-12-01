import { useState, useEffect } from 'react';
import { apiGet } from '../config/api';

/**
 * Hook customizado para gerenciar autenticação e verificar roles
 * 
 * @returns {Object} - Objeto contendo:
 *   - isAuthenticated: boolean - Se o usuário está autenticado
 *   - isAdmin: boolean - Se o usuário tem role de ADMIN
 *   - user: Object|null - Dados do usuário logado
 *   - loading: boolean - Se está carregando os dados
 *   - checkAuth: Function - Função para revalidar autenticação
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const cached = localStorage.getItem('userLoggedIn');
    return cached === 'true';
  });

  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('userData');
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(false);
  const [isVoluntario, setIsVoluntario] = useState(false);

  // Verifica se o usuário é ADMIN, agora pegando diretamente do localStorage
  const isAdmin = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')).role === 'ADMIN';

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await apiGet('/auth/check');
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data);
        
        // Salva no localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data));

        // Verifica se é voluntário
        if (data.id) {
          checkVoluntarioStatus(data.id);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsVoluntario(false);
        
        // Limpa o cache
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsVoluntario(false);
      
      // Limpa o cache
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const checkVoluntarioStatus = async (userId) => {
    try {
      const response = await apiGet(`/voluntario/usuario/${userId}`);
      if (response.ok) {
        const voluntarioData = await response.json();
        const isActive = voluntarioData.status === 'ATIVO';
        setIsVoluntario(isActive);
        localStorage.setItem('isVoluntario', isActive.toString());
      } else {
        setIsVoluntario(false);
        localStorage.setItem('isVoluntario', 'false');
      }
    } catch (error) {
      console.error('Erro ao verificar status de voluntário:', error);
      setIsVoluntario(false);
      localStorage.setItem('isVoluntario', 'false');
    }
  };

  useEffect(() => {
    // Verifica autenticação ao montar
    checkAuth();

    // Escuta evento de login bem-sucedido
    const handleLoginSuccess = () => {
      checkAuth();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  // Carrega status de voluntário do localStorage na inicialização
  useEffect(() => {
    const cached = localStorage.getItem('isVoluntario');
    if (cached) {
      setIsVoluntario(cached === 'true');
    }
  }, []);

  return {
    isAuthenticated,
    isAdmin,
    isVoluntario,
    user,
    loading,
    checkAuth,
    checkVoluntarioStatus
  };
}