import { CheckCircle2, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { formatDate } from '../../shared/utils/date';
import type { Task } from './taskTypes';

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
};

export function TaskList({ tasks, onEdit, onDelete, onToggleStatus }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <CheckCircle2 size={32} />
        <p>Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isDone = task.status !== 'Em aberto';

        return (
          <article className={isDone ? 'task-item done' : 'task-item'} key={task.id}>
            <div>
              <div className="task-item-header">
                <h2>{task.descricao}</h2>
                <span className={isDone ? 'status-tag done' : 'status-tag open'}>{task.status}</span>
              </div>
              <p>{task.detalhes}</p>
              <time dateTime={task.data}>{formatDate(task.data)}</time>
            </div>

            <div className="task-actions">
              <button
                className={isDone ? 'task-action-reopen' : 'task-action-complete'}
                onClick={() => onToggleStatus(task)}
                type="button"
                title={isDone ? 'Reabrir' : 'Concluir'}
              >
                {isDone ? <RotateCcw size={18} /> : <CheckCircle2 size={18} />}
              </button>
              <button className="task-action-edit" onClick={() => onEdit(task)} type="button" title="Editar">
                <Pencil size={18} />
              </button>
              <button className="task-action-delete" onClick={() => onDelete(task)} type="button" title="Excluir">
                <Trash2 size={18} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
