import { useEffect, useMemo, useState } from 'react';
import { LogOut, RefreshCcw } from 'lucide-react';
import type { LoginResponse } from '../features/auth/authTypes';
import { TaskFilters } from '../features/tasks/TaskFilters';
import { TaskForm } from '../features/tasks/TaskForm';
import { TaskList } from '../features/tasks/TaskList';
import { createTask, deleteTask, listTasks, updateTask, updateTaskStatus } from '../features/tasks/tasksApi';
import type { Task, TaskFilter, TaskPayload } from '../features/tasks/taskTypes';
import { ApiError } from '../shared/api/apiError';

type Props = {
  session: LoginResponse;
  onSignOut: () => void;
};

export function TasksPage({ session, onSignOut }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openTasks = useMemo(() => tasks.filter((task) => task.status === 'Em aberto').length, [tasks]);
  const doneTasks = tasks.length - openTasks;

  async function loadTasks(nextFilter = filter) {
    setError('');
    setIsLoading(true);

    try {
      setTasks(await listTasks(session.token, nextFilter));
    } catch (caughtError) {
      const message = caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel carregar tarefas.';
      setError(message);

      if (caughtError instanceof ApiError && caughtError.status === 401) {
        onSignOut();
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks(filter);
  }, [filter]);

  async function handleSubmit(payload: TaskPayload) {
    setError('');
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await updateTask(session.token, editingTask.id, payload);
        setEditingTask(null);
      } else {
        await createTask(session.token, payload);
      }

      await loadTasks();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel salvar a tarefa.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(task: Task) {
    setError('');

    try {
      await deleteTask(session.token, task.id);
      await loadTasks();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel excluir a tarefa.');
    }
  }

  async function handleToggleStatus(task: Task) {
    const nextStatus = task.status === 'Em aberto' ? 'Concluido' : 'Em aberto';
    setError('');

    try {
      await updateTaskStatus(session.token, task.id, nextStatus);
      await loadTasks();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : 'Nao foi possivel alterar o status.');
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Lista de Tarefas</span>
          <h1>Minhas tarefas</h1>
        </div>
        <button className="secondary-button" onClick={onSignOut} type="button">
          <LogOut size={17} />
          Sair
        </button>
      </header>

      <section className="summary-grid" aria-label="Resumo das tarefas">
        <div>
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </div>
        <div>
          <span>Em aberto</span>
          <strong>{openTasks}</strong>
        </div>
        <div>
          <span>Concluidas</span>
          <strong>{doneTasks}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="panel">
          <h2>{editingTask ? 'Editar tarefa' : 'Nova tarefa'}</h2>
          <TaskForm
            task={editingTask}
            isSubmitting={isSubmitting}
            onCancelEdit={() => setEditingTask(null)}
            onSubmit={handleSubmit}
          />
        </aside>

        <section className="panel list-panel">
          <div className="list-header">
            <TaskFilters value={filter} onChange={setFilter} />
            <button className="icon-button" onClick={() => void loadTasks()} type="button" title="Atualizar">
              <RefreshCcw size={18} />
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading ? <p className="muted">Carregando tarefas...</p> : null}
          {!isLoading ? (
            <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
          ) : null}
        </section>
      </section>
    </main>
  );
}
