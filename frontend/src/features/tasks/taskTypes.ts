export type TaskStatus = 'Em aberto' | 'Concluido' | 'Concluído';

export type Task = {
  id: number;
  descricao: string;
  detalhes: string;
  data: string;
  status: TaskStatus;
  usuarioId: number;
};

export type TaskPayload = {
  descricao: string;
  detalhes: string;
  data: string;
};

export type TaskFilter = 'todas' | 'Em aberto' | 'Concluido';
