// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Helper to handle response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error?.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

// Helper to make API requests
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from local storage
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: async (apiKey: string) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
      });
    },
    createApiKey: async (name: string) => {
      return request('/auth/apikey', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    },
  },
  
  // Chain endpoints
  chains: {
    list: async () => {
      return request('/chains');
    },
    getById: async (chainId: string) => {
      return request(`/chains/${chainId}`);
    },
    getBalance: async (chainId: string, address: string) => {
      return request(`/chains/${chainId}/balance/${address}`);
    },
    readContract: async (chainId: string, address: string, method: string, args: any[] = []) => {
      return request(`/chains/${chainId}/contract/${address}/read?method=${method}&args=${args.join(',')}`);
    },
  },
  
  // Transaction endpoints
  transactions: {
    prepare: async (data: {
      chainId: string;
      to: string;
      value?: string;
      data?: string;
      gasLimit?: string;
    }) => {
      return request('/transaction/prepare', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    get: async (uuid: string) => {
      return request(`/transaction/${uuid}`);
    },
    submit: async (uuid: string, signedTransaction: string) => {
      return request(`/transaction/${uuid}/submit`, {
        method: 'POST',
        body: JSON.stringify({ signedTransaction }),
      });
    },
  },
  
  // User endpoints
  user: {
    getProfile: async () => {
      return request('/user/profile');
    },
    getTransactions: async () => {
      return request('/user/transactions');
    },
  },
};

export default api;
