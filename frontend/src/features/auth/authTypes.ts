export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  tipo: 'Bearer';
  expiraEm: number;
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type User = {
  id: number;
  nome: string;
  email: string;
};
