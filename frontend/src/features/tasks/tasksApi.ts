import { apiRequest } from '../../shared/api/httpClient';
import type { Task, TaskFilter, TaskPayload, TaskStatus } from './taskTypes';

export function listTasks(token: string, status: TaskFilter) {
  return apiRequest<Task[]>('/tarefas', {
    token,
    query: {
      status: status === 'todas' ? undefined : status
    }
  });
}

export function createTask(token: string, payload: TaskPayload) {
  return apiRequest<Task>('/tarefas', {
    method: 'POST',
    token,
    body: payload
  });
}

export function updateTask(token: string, taskId: number, payload: TaskPayload) {
  return apiRequest<Task>(`/tarefas/${taskId}`, {
    method: 'PUT',
    token,
    body: payload
  });
}

export function deleteTask(token: string, taskId: number) {
  return apiRequest<void>(`/tarefas/${taskId}`, {
    method: 'DELETE',
    token
  });
}

export function updateTaskStatus(token: string, taskId: number, status: TaskStatus) {
  return apiRequest<Task>(`/tarefas/${taskId}/status`, {
    method: 'PATCH',
    token,
    body: { status }
  });
}
