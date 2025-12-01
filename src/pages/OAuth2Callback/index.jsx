import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("🔄 OAuth2Callback - Processando login do Google");
    
    // Extrair parâmetros da URL
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const id = searchParams.get('id');
    const nome = searchParams.get('nome');

    console.log('Dados recebidos:', { token: token?.substring(0, 20) + '...', email, role, id, nome });

    if (token && email) {
      // Salvar no localStorage
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      const userData = {
        id: parseInt(id),
        email: email,
        role: role,
        nome: decodeURIComponent(nome || email.split('@')[0])
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userLoggedIn', 'true');
      
      console.log('✅ Dados salvos no localStorage');
      
      // Disparar evento de login
      window.dispatchEvent(new Event('loginSuccess'));
      
      setTimeout(() => {
        console.log("🏠 Redirecionando para home");
        navigate('/', { replace: true });
      }, 500);
    } else {
      console.error('❌ Token ou email não encontrados na URL');
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#B20000', marginBottom: '1rem' }}>
          Processando login...
        </h2>
        <p style={{ color: '#808080' }}>
          Aguarde enquanto redirecionamos você.
        </p>
      </div>
    </div>
  );
}
