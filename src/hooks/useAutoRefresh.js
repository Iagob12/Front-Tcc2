import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para auto-refresh de dados no web
 * @param {Function} refreshFunction - Função que será chamada para atualizar os dados
 * @param {number} interval - Intervalo em milissegundos (padrão: 30 segundos)
 * @param {boolean} refreshOnVisibilityChange - Se deve atualizar ao voltar para a aba (padrão: true)
 * @param {boolean} enabled - Se o auto-refresh está habilitado (padrão: true)
 */
export const useAutoRefresh = (
  refreshFunction,
  interval = 30000, // 30 segundos
  refreshOnVisibilityChange = true,
  enabled = true
) => {
  const intervalRef = useRef(null);
  const isRefreshing = useRef(false);

  // Wrapper para evitar múltiplas chamadas simultâneas
  const safeRefresh = useCallback(async () => {
    if (isRefreshing.current) {
      console.log('⏳ Refresh já em andamento, pulando...');
      return;
    }

    try {
      isRefreshing.current = true;
      console.log('🔄 Auto-refresh: Atualizando dados...');
      await refreshFunction();
    } catch (error) {
      console.error('❌ Erro no auto-refresh:', error);
    } finally {
      isRefreshing.current = false;
    }
  }, [refreshFunction]);

  // Auto-refresh periódico
  useEffect(() => {
    if (!enabled || interval <= 0) return;

    intervalRef.current = setInterval(() => {
      safeRefresh();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [safeRefresh, interval, enabled]);

  // Refresh ao voltar para a aba
  useEffect(() => {
    if (!enabled || !refreshOnVisibilityChange) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Aba visível: Atualizando dados...');
        safeRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [safeRefresh, refreshOnVisibilityChange, enabled]);

  // Refresh ao focar na janela
  useEffect(() => {
    if (!enabled || !refreshOnVisibilityChange) return;

    const handleFocus = () => {
      console.log('🔍 Janela focada: Atualizando dados...');
      safeRefresh();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [safeRefresh, refreshOnVisibilityChange, enabled]);

  return { refresh: safeRefresh };
};

export default useAutoRefresh;
