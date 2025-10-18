import api from '../lib/api';
import type { User, LoginDto, CreateUserDto, AuthResponse } from '@friend-gifting/shared';

export const authService = {
  async register(data: CreateUserDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    // Clear local storage and state
    // The backend doesn't have a logout endpoint for JWT
  },
};
