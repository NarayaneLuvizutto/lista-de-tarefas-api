import { apiRequest } from '../../shared/api/httpClient';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './authTypes';

export function login(payload: LoginRequest) {
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: payload
  });
}

export function register(payload: RegisterRequest) {
  return apiRequest<User>('/usuarios', {
    method: 'POST',
    body: payload
  });
}
