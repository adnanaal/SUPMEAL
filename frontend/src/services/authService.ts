import { apiClient } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string;
  dietaryPreferences?: string;
  allergies?: string;
  favoriteCuisine?: string;
  defaultServings?: number;
}

export interface AuthenticationResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  dietaryPreferences?: string;
  allergies?: string;
  favoriteCuisine?: string;
  defaultServings?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthenticationResponse> {
    const response = await apiClient.post<AuthenticationResponse>('/auth/login', {
      email,
      password,
    });
    return response;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/auth/register', data);
    return response;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response;
  },

  async updateProfile(data: {
    firstname?: string;
    lastname?: string;
    email?: string;
    avatar?: string;
  }): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>('/auth/profile', data);
    return response;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.post('/auth/change-password', data);
  },
};
