import { useState, useEffect } from "react";
import "../../styles/GerenciarInscricoes/style.css";
import Header from "../Header";
import Footer from "../Footer";
import MobileWarning from "../MobileWarning";
import { apiGet, apiDelete } from "../../config/api";
import { useToast } from '../Toast/useToast';
import ToastContainer from '../Toast/ToastContainer';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle, Loader } from 'lucide-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const GerenciarInscricoes = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState("ATIVIDADES"); // ATIVIDADES ou EVENTOS
  const [atividades, setAtividades] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [participacoes, setParticipacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInscricaoId, setLoadingInscricaoId] = useState(null);
  const toast = useToast();

  const fetchAtividades = async () => {
    try {
      const response = await apiGet("/curso/listar");
      if (response.ok) {
        const data = await response.json();
        setAtividades(data);
      } else {
        toast.error("Erro ao buscar atividades");
      }
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      toast.error("Erro ao buscar atividades");
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await apiGet("/evento/listar");
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      } else {
        toast.error("Erro ao buscar eventos");
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      toast.error("Erro ao buscar eventos");
    }
  };

  const fetchInscricoes = async (atividadeId) => {
    setLoading(true);
    try {
      const response = await apiGet(`/curso/inscricoes/${atividadeId}`);
      if (response.ok) {
        const data = await response.json();
        setInscricoes(data.inscricoes || []);
      } else {
        toast.error("Erro ao buscar inscrições");
        setInscricoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar inscrições:", error);
      toast.error("Erro ao buscar inscrições");
      setInscricoes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipacoes = async (eventoId) => {
    setLoading(true);
    try {
      const response = await apiGet(`/participar/evento/${eventoId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipacoes(data || []);
      } else {
        toast.error("Erro ao buscar participações");
        setParticipacoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar participações:", error);
      toast.error("Erro ao buscar participações");
      setParticipacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
    setEventoSelecionado(null);
    fetchInscricoes(atividade.id);
  };

  const handleSelecionarEvento = (evento) => {
    setEventoSelecionado(evento);
    setAtividadeSelecionada(null);
    fetchParticipacoes(evento.id);
  };

  const handleRemoverInscricao = async (inscricaoId) => {
    if (!window.confirm("Tem certeza que deseja remover esta inscrição?")) {
      return;
    }

    setLoadingInscricaoId(inscricaoId);
    try {
      const response = await apiDelete(`/inscricao/deletar/${inscricaoId}`);
      if (response.ok) {
        toast.success("Inscrição removida com sucesso!");
        fetchInscricoes(atividadeSelecionada.id);
        fetchAtividades();
      } else {
        toast.error("Erro ao remover inscrição");
      }
    } catch (error) {
      console.error("Erro ao remover inscrição:", error);
      toast.error("Erro ao remover inscrição");
    } finally {
      setLoadingInscricaoId(null);
    }
  };

  const handleRemoverParticipacao = async (participacaoId) => {
    if (!window.confirm("Tem certeza que deseja remover esta participação?")) {
      return;
    }

    setLoadingInscricaoId(participacaoId);
    try {
      const response = await apiDelete(`/participar/deletar/${participacaoId}`);
      if (response.ok) {
        toast.success("Participação removida com sucesso!");
        fetchParticipacoes(eventoSelecionado.id);
        fetchEventos();
      } else {
        toast.error("Erro ao remover participação");
      }
    } catch (error) {
      console.error("Erro ao remover participação:", error);
      toast.error("Erro ao remover participação");
    } finally {
      setLoadingInscricaoId(null);
    }
  };

  useEffect(() => {
    if (tipoSelecionado === "ATIVIDADES") {
      fetchAtividades();
    } else if (tipoSelecionado === "EVENTOS") {
      fetchEventos();
    }
  }, [tipoSelecionado]);

  return (
    <>
      <Header />
      <MobileWarning pageName="Gerenciar Inscrições" />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="container-gerenciar-inscricoes">
        <section className="dashboard-inscricoes">
          <div className="cabecalho-inscricoes">
            <h1>Gerenciar Inscrições e Participações</h1>
            <p className="subtitulo">Visualize e gerencie as inscrições dos voluntários</p>
            <div className="tabs-container">
              <button
                className={`tab-btn ${tipoSelecionado === "ATIVIDADES" ? "active" : ""}`}
                onClick={() => {
                  setTipoSelecionado("ATIVIDADES");
                  setAtividadeSelecionada(null);
                  setEventoSelecionado(null);
                }}
              >
                <Calendar size={18} />
                <span>Atividades</span>
              </button>
              <button
                className={`tab-btn ${tipoSelecionado === "EVENTOS" ? "active" : ""}`}
                onClick={() => {
                  setTipoSelecionado("EVENTOS");
                  setAtividadeSelecionada(null);
                  setEventoSelecionado(null);
                }}
              >
                <Users size={18} />
                <span>Eventos</span>
              </button>
            </div>
          </div>

          <div className="conteudo-inscricoes">
            {/* Lista de Atividades ou Eventos */}
            <aside className="lista-atividades">
              <h2>{tipoSelecionado === "ATIVIDADES" ? "Atividades" : "Eventos"}</h2>
              {tipoSelecionado === "ATIVIDADES" ? (
                atividades.length > 0 ? (
                  <div className="atividades-scroll">
                    {atividades.map((atividade) => (
                      <div
                        key={atividade.id}
                        className={`atividade-item ${
                          atividadeSelecionada?.id === atividade.id ? "ativa" : ""
                        }`}
                        onClick={() => handleSelecionarAtividade(atividade)}
                      >
                        <h3>{atividade.titulo}</h3>
                        <div className="atividade-info">
                          <span className="info-item">
                            <Calendar size={16} />
                            <span>{atividade.dias}</span>
                          </span>
                          <span className="info-item">
                            <Clock size={16} />
                            <span>{atividade.horario}</span>
                          </span>
                          <span className="info-item vagas">
                            <Users size={16} />
                            <span>{atividade.vagas} vagas</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sem-dados">Nenhuma atividade cadastrada</p>
                )
              ) : (
                eventos.length > 0 ? (
                  <div className="atividades-scroll">
                    {eventos.map((evento) => (
                      <div
                        key={evento.id}
                        className={`atividade-item ${
                          eventoSelecionado?.id === evento.id ? "ativa" : ""
                        }`}
                        onClick={() => handleSelecionarEvento(evento)}
                      >
                        <h3>{evento.nome}</h3>
                        <div className="atividade-info">
                          <span className="info-item">
                            <Calendar size={16} />
                            <span>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                          </span>
                          <span className="info-item">
                            <MapPin size={16} />
                            <span>{evento.local || "Local não informado"}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sem-dados">Nenhum evento cadastrado</p>
                )
              )}
            </aside>

            {/* Detalhes e Inscrições/Participações */}
            <main className="detalhes-inscricoes">
              {atividadeSelecionada || eventoSelecionado ? (
                <>
                  <div className="header-detalhes">
                    <div>
                      <h2>{atividadeSelecionada?.titulo || eventoSelecionado?.nome}</h2>
                      <p className="descricao-atividade">
                        {atividadeSelecionada?.descricao || eventoSelecionado?.descricao}
                      </p>
                    </div>
                    <div className="stats">
                      <div className="stat-card">
                        <span className="stat-numero">
                          {atividadeSelecionada ? inscricoes.length : participacoes.length}
                        </span>
                        <span className="stat-label">
                          {atividadeSelecionada ? "Inscritos" : "Participantes"}
                        </span>
                      </div>
                      {atividadeSelecionada && (
                        <div className="stat-card">
                          <span className="stat-numero">{atividadeSelecionada.vagas}</span>
                          <span className="stat-label">Vagas</span>
                        </div>
                      )}
                      {eventoSelecionado && (
                        <div className="stat-card">
                          <span className="stat-numero">
                            {participacoes.filter(p => p.confirmado).length}
                          </span>
                          <span className="stat-label">Confirmados</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lista-inscricoes">
                    <h3>{atividadeSelecionada ? "Voluntários Inscritos" : "Participantes do Evento"}</h3>
                    {loading ? (
                      <p className="carregando">Carregando...</p>
                    ) : atividadeSelecionada ? (
                      inscricoes.length > 0 ? (
                        <div className="tabela-inscricoes">
                          <table>
                            <thead>
                              <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Data de Inscrição</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inscricoes.map((inscricao) => (
                                <tr key={inscricao.id}>
                                  <td className="nome-usuario">
                                    {inscricao.nomeUsuario || "N/A"}
                                  </td>
                                  <td>{inscricao.emailUsuario || "N/A"}</td>
                                  <td>{formatDate(inscricao.dataInscricao)}</td>
                                  <td>
                                    <button
                                      className="btn-remover"
                                      onClick={() => handleRemoverInscricao(inscricao.id)}
                                      disabled={loadingInscricaoId === inscricao.id}
                                    >
                                      {loadingInscricaoId === inscricao.id ? (
                                        <>
                                          <Loader size={14} className="spinner" />
                                          <span>Removendo...</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle size={14} />
                                          <span>Remover</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="sem-dados">
                          Nenhum voluntário inscrito nesta atividade
                        </p>
                      )
                    ) : (
                      participacoes.length > 0 ? (
                        <div className="tabela-inscricoes">
                          <table>
                            <thead>
                              <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {participacoes.map((participacao) => (
                                <tr key={participacao.id}>
                                  <td className="nome-usuario">
                                    {participacao.nomeUsuario || "N/A"}
                                  </td>
                                  <td>{participacao.emailUsuario || "N/A"}</td>
                                  <td>
                                    <span className={`status-badge ${participacao.confirmado ? 'confirmado' : 'pendente'}`}>
                                      {participacao.confirmado ? (
                                        <>
                                          <CheckCircle size={14} />
                                          <span>Confirmado</span>
                                        </>
                                      ) : (
                                        <>
                                          <Clock size={14} />
                                          <span>Pendente</span>
                                        </>
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn-remover"
                                      onClick={() => handleRemoverParticipacao(participacao.id)}
                                      disabled={loadingInscricaoId === participacao.id}
                                    >
                                      {loadingInscricaoId === participacao.id ? (
                                        <>
                                          <Loader size={14} className="spinner" />
                                          <span>Removendo...</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle size={14} />
                                          <span>Remover</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="sem-dados">
                          Nenhum participante neste evento
                        </p>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="selecione-atividade">
                  <Calendar size={80} strokeWidth={1.5} className="icone-grande" />
                  <h3>Selecione {tipoSelecionado === "ATIVIDADES" ? "uma atividade" : "um evento"}</h3>
                  <p>Escolha {tipoSelecionado === "ATIVIDADES" ? "uma atividade" : "um evento"} ao lado para ver {tipoSelecionado === "ATIVIDADES" ? "as inscrições" : "os participantes"}</p>
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default GerenciarInscricoes;
