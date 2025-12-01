import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("🔄 OAuth2Callback - Processando login do Google");
    
    // Tentar pegar tokens da URL (solução híbrida)
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const id = searchParams.get('id');
    const nome = searchParams.get('nome');

    if (token && email) {
      // Tokens vieram na URL - salvar no localStorage
      console.log('✅ Tokens recebidos na URL, salvando no localStorage');
      
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
      
      console.log('✅ Dados salvos:', userData);
    } else {
      // Tokens não vieram na URL - assumir que estão no cookie
      console.log('ℹ️ Tokens não encontrados na URL, assumindo que estão no cookie');
    }
    
    // Disparar evento de login
    window.dispatchEvent(new Event('loginSuccess'));
    
    setTimeout(() => {
      console.log("🏠 Redirecionando para home");
      navigate('/', { replace: true });
    }, 500);
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
