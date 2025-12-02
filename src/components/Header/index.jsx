import React, { useState, useEffect, useRef } from "react";
import "../../styles/Header/style.css";
import Logo from "../../assets/Logos/Logo.svg";
import Button from "../Button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiGet, apiPost } from '../../config/api';
import { User, X, Menu, Smartphone } from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";
import { shouldShowImage } from "../../utils/imageUtils";

const Header = () => {
  const { isAdmin } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [mobileMenuAberto, setMobileMenuAberto] = useState(false);

  // Inicializa o estado de login com cache do localStorage para evitar "piscar"
  const [logado, setLogado] = useState(() => {
    const cached = localStorage.getItem('userLoggedIn');
    return cached === 'true';
  });

  const [carregando, setCarregando] = useState(false); // Não mostra loading inicial
  const [perfilAberto, setPerfilAberto] = useState(false);

  // Inicializa userData com cache do localStorage
  const [userData, setUserData] = useState(() => {
    const cached = localStorage.getItem('userData');
    return cached ? JSON.parse(cached) : null;
  });

  const perfilRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("🎨 Header renderizado - Estado logado:", logado, "Carregando:", carregando);

  // Checa se o usuário está logado
  useEffect(() => {
    const checkLogin = async () => {
      try {
        console.log("🔍 Verificando login...");
        const response = await apiGet('/auth/check');
        console.log("📡 Resposta do /auth/check:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Usuário logado:", data);
          setLogado(true);
          setUserData(data);

          // Salva no localStorage para cache
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(data));
        } else {
          console.log("❌ Usuário não logado");
          setLogado(false);
          setUserData(null);

          // Limpa o cache
          localStorage.removeItem('userLoggedIn');
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error("❌ Erro ao verificar login:", error);
        setLogado(false);
        setUserData(null);

        // Limpa o cache em caso de erro
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
      } finally {
        setCarregando(false);
      }
    };

    // Executa a verificação em background
    checkLogin();

    // Escuta evento customizado para atualizar o estado após login
    window.addEventListener('loginSuccess', checkLogin);

    return () => {
      window.removeEventListener('loginSuccess', checkLogin);
    };
  }, []);

  // Fecha o dropdown de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (perfilRef.current && !perfilRef.current.contains(event.target)) {
        setPerfilAberto(false);
      }
    };

    if (perfilAberto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [perfilAberto]);

  const handleLogout = async () => {
    try {
      const response = await apiPost('/auth/logout', {});

      if (response.ok) {
        console.log("✅ Logout realizado com sucesso");
        setLogado(false);
        setUserData(null);
        setPerfilAberto(false);

        // Limpa TODOS os dados do localStorage relacionados ao usuário
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isVoluntario');
        
        // Limpa todo o localStorage para garantir
        localStorage.clear();

        navigate("/");
        window.location.reload();
      } else {
        console.error("❌ Erro no logout");
        alert('Erro ao fazer logout');
      }
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      alert('Erro ao fazer logout');
    }
  };



  return (
    <>
      {/* Overlay do menu mobile */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuAberto ? 'active' : ''}`}
        onClick={() => setMobileMenuAberto(false)}
      ></div>
      
      <header>
        <Link to="/">
          <img src={Logo} alt="Logo dos Voluntarios Pro Bem, três bonequinhos, preto cinza e vermelho" className="logo" />
        </Link>

        {/* Menu Hamburger - Mobile */}
        <button 
          className={`mobile-menu-btn ${mobileMenuAberto ? 'active' : ''}`}
          onClick={() => setMobileMenuAberto(!mobileMenuAberto)}
          aria-label="Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navegação Desktop */}
        <nav className={`nav-header ${mobileMenuAberto ? 'mobile-open' : ''}`}>
          <ul className="lista-header">
            <li className={location.pathname === '/eventos' ? 'active' : ''}>
              <Link to="/eventos" onClick={() => setMobileMenuAberto(false)}>Eventos</Link>
            </li>

            {/* Sobre Nós - Desktop com dropdown, Mobile sem dropdown */}
            <li
              className={`menu-item-com-dropdown desktop-only ${location.pathname === '/sobre' ? 'active' : ''}`}
              onMouseEnter={() => setAberto(true)}
              onMouseLeave={() => setAberto(false)}
            >
              <div className="sobre-nos-header">
                <Link to="/sobre" onClick={() => setMobileMenuAberto(false)}>Sobre Nós</Link>
                <button 
                  className="dropdown-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAberto(!aberto);
                  }}
                  aria-label="Expandir menu"
                >
                  ▾
                </button>
              </div>

              <div className={`sobre-dropdown ${aberto ? "ativo" : "inativo"}`}>
                <ul className="lista-dropdown">
                  <li><Link to="/sobre#nossa_historia" className="drop-item" onClick={() => { setAberto(false); setMobileMenuAberto(false); }}>Nossa História</Link></li>
                  <li><Link to="/sobre#linha-do-tempo" className="drop-item" onClick={() => { setAberto(false); setMobileMenuAberto(false); }}>Linha do Tempo</Link></li>
                  <li><Link to="/sobre#equipe" className="drop-item" onClick={() => { setAberto(false); setMobileMenuAberto(false); }}>Equipe</Link></li>
                  <li><Link to="/sobre#projetos" className="drop-item" onClick={() => { setAberto(false); setMobileMenuAberto(false); }}>Projetos</Link></li>
                </ul>
              </div>
            </li>
            
            {/* Sobre Nós - Mobile simples (sem dropdown) */}
            <li className={`mobile-only ${location.pathname === '/sobre' ? 'active' : ''}`}>
              <Link to="/sobre" onClick={() => setMobileMenuAberto(false)}>Sobre Nós</Link>
            </li>
            <li className={location.pathname === '/blog' ? 'active' : ''}>
              <Link to="/blog" onClick={() => setMobileMenuAberto(false)}>Blog</Link>
            </li>
            <li className={location.pathname === '/como-ajudar' ? 'active' : ''}>
              <Link to="/como-ajudar" onClick={() => setMobileMenuAberto(false)}>Como Ajudar</Link>
            </li>
            
            {/* Link do App - apenas visível no mobile */}
            <li className="menu-item-app-mobile">
              <a 
                href="https://expo.dev/artifacts/eas/5RAxAaWjAWsKWxDCVDu6V9.apk" 
                onClick={() => setMobileMenuAberto(false)}
                download
              >
                <Smartphone size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Nosso App
              </a>
            </li>
          </ul>

          {/* Botões no menu mobile */}
          <div className="mobile-menu-buttons">
            <Link to="/como-ajudar#doacao" onClick={() => setMobileMenuAberto(false)}>
              <Button text="Doe Agora" primary={true} />
            </Link>
            
            {logado ? (
              <button 
                className="mobile-logout-btn"
                onClick={() => {
                  handleLogout();
                  setMobileMenuAberto(false);
                }}
              >
                Sair da conta
              </button>
            ) : (
              <Link to="/cadastrar-se" onClick={() => setMobileMenuAberto(false)}>
                <Button text="Cadastrar-se" primary={false} />
              </Link>
            )}
          </div>
        </nav>

        {/* Botões Desktop */}
        <div className="header-buttons hide-desktop">
          <Link to="/como-ajudar#doacao">
            <Button text="Doe Agora" primary={true} />
          </Link>

          <div style={{ minWidth: '150px', position: 'relative' }} ref={perfilRef}>
            {logado ? (
              <>
                <button 
                  className="profile-icon-btn" 
                  onClick={() => setPerfilAberto(!perfilAberto)}
                  aria-label="Abrir perfil"
                >
                  {shouldShowImage(userData?.imagemPerfil) ? (
                    <img 
                      src={userData.imagemPerfil} 
                      alt="Foto de perfil" 
                      className="profile-icon-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <User 
                    size={24} 
                    strokeWidth={2} 
                    style={{ display: shouldShowImage(userData?.imagemPerfil) ? 'none' : 'block' }}
                  />
                </button>

                {/* Dropdown de Perfil */}
                <div className={`perfil-dropdown ${perfilAberto ? 'ativo' : 'inativo'}`}>
                  {/* Informações do Usuário */}
                  <div className="perfil-user-info">
                    <div className="perfil-avatar">
                      {shouldShowImage(userData?.imagemPerfil) ? (
                        <img 
                          src={userData.imagemPerfil} 
                          alt="Foto de perfil" 
                          className="perfil-avatar-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="perfil-avatar-icon"
                        style={{ display: shouldShowImage(userData?.imagemPerfil) ? 'none' : 'flex' }}
                      >
                        <User size={32} strokeWidth={2} />
                      </div>
                    </div>
                    <div className="perfil-details">
                      <h3 className="perfil-name">{userData?.nome || 'Usuário'}</h3>
                      <p className="perfil-email">{userData?.email || 'voluntario@gmail.com'}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="perfil-badge">
                    <div className={`perfil-badge-dot ${
                      userData?.role === 'ADMIN' ? 'admin' : 
                      userData?.isVoluntario ? 'voluntario' : 
                      'usuario'
                    }`}></div>
                    <span className="perfil-badge-text">
                      {userData?.role === 'ADMIN' ? 'Admin' : 
                       userData?.isVoluntario ? 'Voluntário' : 
                       'Usuário'}
                    </span>
                  </div>

                  {/* Divisor */}
                  <div className="perfil-divider"></div>

                  {/* Seção de Acesso */}
                  <div className="perfil-section">
                    <h4 className="perfil-section-title">ACESSO</h4>
                    <button 
                      className="perfil-menu-item" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🔵 Navegando para /editar-perfil");
                        setPerfilAberto(false);
                        navigate('/editar-perfil');
                      }}
                    >
                      Editar Perfil
                    </button>
                    {isAdmin && (
                      <button 
                        className="perfil-menu-item" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPerfilAberto(false);
                          navigate('/gerenciar-relatorios');
                        }}
                      >
                        Acessar relatórios
                      </button>
                    )}
                    {isAdmin && (
                      <button 
                        className="perfil-menu-item" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPerfilAberto(false);
                          navigate('/sistema-aprovacao');
                        }}
                      >
                        Sistema de aprovação
                      </button>
                    )}
                    {isAdmin && (
                      <button 
                        className="perfil-menu-item" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPerfilAberto(false);
                          navigate('/gerenciar-inscricoes');
                        }}
                      >
                        Gerenciar inscrições
                      </button>
                    )}
                    <button 
                      className="perfil-menu-item" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPerfilAberto(false);
                        navigate('/tarefas');
                      }}
                    >
                      Tarefas
                    </button>
                  </div>

                  {/* Divisor */}
                  <div className="perfil-divider"></div>

                  {/* Logout */}
                  <button className="perfil-logout" onClick={handleLogout}>
                    Fazer logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/cadastrar-se">
                <Button text="Cadastrar-se →" primary={false} />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
