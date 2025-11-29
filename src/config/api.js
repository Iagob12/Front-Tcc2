/**
 * Configuração centralizada da API
 * 
 * Uso:
 * - Desenvolvimento: npm run dev (usa .env.development)
 * - Produção: npm run build (usa .env.production)
 */

// URL base da API (vem do arquivo .env)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Ambiente atual
export const ENV = import.meta.env.VITE_ENV || 'development';

// Função helper para criar URLs completas
export const createApiUrl = (endpoint) => {
    // Remove barra inicial se existir
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_URL}/${cleanEndpoint}`;
};

// Função para obter headers com autenticação
const getAuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Adicionar token se existir
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Configuração padrão para fetch
export const fetchConfig = {
    credentials: 'include', // Sempre enviar cookies
    headers: {
        'Content-Type': 'application/json'
    }
};

// Helper para fazer requisições GET
export const apiGet = async (endpoint) => {
    const response = await fetch(createApiUrl(endpoint), {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
    });
    return response;
};

// Helper para fazer requisições POST
export const apiPost = async (endpoint, data) => {
    const response = await fetch(createApiUrl(endpoint), {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return response;
};

// Helper para fazer requisições PUT
export const apiPut = async (endpoint, data) => {
    const response = await fetch(createApiUrl(endpoint), {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
    });
    return response;
};

// Helper para fazer requisições DELETE
export const apiDelete = async (endpoint) => {
    const response = await fetch(createApiUrl(endpoint), {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
    });
    return response;
};

// Log da configuração (apenas em desenvolvimento)
if (ENV === 'development') {
    console.log('🔧 API Configuration:');
    console.log('  - API URL:', API_URL);
    console.log('  - Environment:', ENV);
}

export default {
    API_URL,
    ENV,
    createApiUrl,
    fetchConfig,
    apiGet,
    apiPost,
    apiPut,
    apiDelete
};
