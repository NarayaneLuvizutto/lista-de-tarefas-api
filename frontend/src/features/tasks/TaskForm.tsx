import { FormEvent, useEffect, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { todayIsoDate } from '../../shared/utils/date';
import type { Task, TaskPayload } from './taskTypes';

type Props = {
  task?: Task | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
};

export function TaskForm({ task, isSubmitting, onCancelEdit, onSubmit }: Props) {
  const [descricao, setDescricao] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [data, setData] = useState(todayIsoDate());

  useEffect(() => {
    setDescricao(task?.descricao ?? '');
    setDetalhes(task?.detalhes ?? '');
    setData(task?.data ?? todayIsoDate());
  }, [task]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit({ descricao, detalhes, data });

    if (!task) {
      setDescricao('');
      setDetalhes('');
      setData(todayIsoDate());
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Descricao
          <input value={descricao} onChange={(event) => setDescricao(event.target.value)} required />
        </label>

        <label>
          Data
          <input value={data} onChange={(event) => setData(event.target.value)} type="date" required />
        </label>
      </div>

      <label>
        Detalhes
        <textarea value={detalhes} onChange={(event) => setDetalhes(event.target.value)} rows={4} required />
      </label>

      <div className="form-actions">
        {task && (
          <button className="secondary-button" onClick={onCancelEdit} type="button">
            <X size={17} />
            Cancelar
          </button>
        )}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {task ? <Check size={17} /> : <Plus size={17} />}
          {isSubmitting ? 'Salvando...' : task ? 'Salvar tarefa' : 'Adicionar tarefa'}
        </button>
      </div>
    </form>
  );
}
