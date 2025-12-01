import { useState } from 'react';
import { apiGet } from '../config/api';

const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      console.log('Token no localStorage:', token ? token.substring(0, 20) + '...' : 'Não encontrado');
      console.log('UserData no localStorage:', userData);

      const response = await apiGet('/debug/auth-info');
      const data = await response.json();
      
      setDebugInfo({
        localStorage: {
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 30) + '...' : null,
          userData: userData ? JSON.parse(userData) : null
        },
        backend: data
      });
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      background: 'white', 
      padding: 20, 
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: 400,
      zIndex: 9999
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Debug Auth</h3>
      <button 
        onClick={checkAuth}
        disabled={loading}
        style={{
          background: '#B20000',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        {loading ? 'Verificando...' : 'Verificar Autenticação'}
      </button>
      
      {debugInfo && (
        <pre style={{ 
          marginTop: 10, 
          fontSize: 11, 
          overflow: 'auto',
          maxHeight: 300,
          background: '#f5f5f5',
          padding: 10,
          borderRadius: 4
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugAuth;
