import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MobileWarning from '../../components/MobileWarning';
import { apiGet, apiPut } from '../../config/api';
import { useToast } from '../../components/Toast/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import './style.css';

const GerenciarVoluntarios = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('APROVADO'); // 'APROVADO', 'PENDENTE', 'TODOS'

  useEffect(() => {
    carregarVoluntarios();
  }, [filtro]);

  const carregarVoluntarios = async () => {
    setLoading(true);
    try {
      let url = '/voluntario/listar';
      if (filtro === 'APROVADO') {
        url = '/voluntario/listar/aprovados';
      } else if (filtro === 'PENDENTE') {
        url = '/voluntario/listar/pendentes';
      }

      const response = await apiGet(url);
      if (response.ok) {
        const data = await response.json();
        setVoluntarios(data);
      } else {
        toast.error('Erro ao carregar voluntários');
      }
    } catch (error) {
      toast.error('Erro ao carregar voluntários');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverVoluntario = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover ${nome} como voluntário?`)) {
      return;
    }

    try {
      const response = await apiPut(`/voluntario/admin/remover-voluntario/${id}`);
      if (response.ok) {
        toast.success('Voluntário removido com sucesso!');
        carregarVoluntarios();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao remover voluntário');
      }
    } catch (error) {
      toast.error('Erro ao remover voluntário');
    }
  };

  const handleAprovar = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja aprovar ${nome} como voluntário?`)) {
      return;
    }

    try {
      const response = await apiPut(`/voluntario/aprovar/${id}`);
      if (response.ok) {
        toast.success('Voluntário aprovado com sucesso!');
        carregarVoluntarios();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao aprovar voluntário');
      }
    } catch (error) {
      toast.error('Erro ao aprovar voluntário');
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Header />
      <MobileWarning pageName="Gerenciar Voluntários" />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="container-gerenciar-voluntarios">
        <div className="header-gerenciar">
          <h1>Gerenciar Voluntários</h1>
          <div className="filtros">
            <button
              className={`btn-filtro ${filtro === 'APROVADO' ? 'ativo' : ''}`}
              onClick={() => setFiltro('APROVADO')}
            >
              Aprovados
            </button>
            <button
              className={`btn-filtro ${filtro === 'PENDENTE' ? 'ativo' : ''}`}
              onClick={() => setFiltro('PENDENTE')}
            >
              Pendentes
            </button>
            <button
              className={`btn-filtro ${filtro === 'TODOS' ? 'ativo' : ''}`}
              onClick={() => setFiltro('TODOS')}
            >
              Todos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : voluntarios.length === 0 ? (
          <div className="vazio">Nenhum voluntário encontrado</div>
        ) : (
          <div className="tabela-container">
            <table className="tabela-voluntarios">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Data Cadastro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {voluntarios.map((voluntario) => (
                  <tr key={voluntario.id}>
                    <td>{voluntario.idUsuario?.nome || 'N/A'}</td>
                    <td>{voluntario.idUsuario?.email || 'N/A'}</td>
                    <td>{voluntario.telefone || 'N/A'}</td>
                    <td>{voluntario.cpf || 'N/A'}</td>
                    <td>{formatarData(voluntario.dataVoluntario)}</td>
                    <td>
                      <span className={`badge badge-${voluntario.status.toLowerCase()}`}>
                        {voluntario.status}
                      </span>
                    </td>
                    <td className="acoes">
                      {voluntario.status === 'PENDENTE' && (
                        <button
                          className="btn-aprovar"
                          onClick={() => handleAprovar(voluntario.id, voluntario.idUsuario?.nome)}
                        >
                          ✓ Aprovar
                        </button>
                      )}
                      {voluntario.status === 'APROVADO' && (
                        <button
                          className="btn-remover"
                          onClick={() => handleRemoverVoluntario(voluntario.id, voluntario.idUsuario?.nome)}
                        >
                          ✕ Remover
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default GerenciarVoluntarios;
