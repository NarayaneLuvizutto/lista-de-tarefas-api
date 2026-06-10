import type { TaskFilter } from './taskTypes';

type Props = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

const filters: Array<{ label: string; value: TaskFilter }> = [
  { label: 'Todas', value: 'todas' },
  { label: 'Em aberto', value: 'Em aberto' },
  { label: 'Concluidas', value: 'Concluido' }
];

export function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="segmented-control" aria-label="Filtrar tarefas">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={value === filter.value ? 'active' : ''}
          onClick={() => onChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
