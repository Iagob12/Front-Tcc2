import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', color: '#B20000', marginBottom: '20px' }}>🚫</h1>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>Acesso Negado</h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#B20000',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#8B0000'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#B20000'}
        >
          Voltar
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
