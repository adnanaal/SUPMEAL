import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Configuration de l'instance Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

console.log('API_BASE_URL:', API_BASE_URL);

// Type pour standardiser la gestion d'erreurs
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur de requête pour ajouter le token JWT et l'userId
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Ajouter X-User-Id header pour le filtrage côté serveur
        const userId = localStorage.getItem('userId');
        if (userId) {
          config.headers['X-User-Id'] = userId;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse pour gérer les erreurs
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status,
          code: error.code,
        };

        // Gérer les erreurs 401/403
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.error('Authentication error:', apiError);
          const { logout } = useAuthStore.getState();
          logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return Promise.reject(apiError);
        }

        // Log les erreurs 500
        if (error.response?.status === 500) {
          console.error('Server error:', apiError);
          apiError.message = 'Server error occurred. Please try again later.';
          return Promise.reject(apiError);
        }

        // Gérer les autres erreurs
        console.error('API error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // Méthodes HTTP génériques
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    console.log(`POST ${url}`, data);
    const response = await this.client.post<T>(url, data);
    console.log(`Response ${url}`, response.data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
