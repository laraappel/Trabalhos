import { useState, type FormEvent } from 'react';
import type { Category, Priority, Task, TaskStatus } from '@/shared/types';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/shared/types';
import { ALL_CATEGORIES } from '@/shared/types/activityKind';

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: Category;
  estimatedMinutes: number;
  status: TaskStatus;
}

interface TaskFormProps {
  initial?: Task;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

const emptyForm = (): TaskFormValues => ({
  title: '',
  description: '',
  dueDate: '',
  priority: 'media',
  category: 'casa',
  estimatedMinutes: 30,
  status: 'pendente',
});

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(
    initial
      ? {
          title: initial.title,
          description: initial.description ?? '',
          dueDate: initial.dueDate ?? '',
          priority: initial.priority,
          category: initial.category,
          estimatedMinutes: initial.estimatedMinutes,
          status: initial.status,
        }
      : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError('Informe um título.');
      return;
    }
    if (values.estimatedMinutes < 5) {
      setError('Duração mínima: 5 minutos.');
      return;
    }
    onSubmit(values);
  };

  const set = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="form__error" role="alert">{error}</p>}

      <label className="form__field">
        <span>Título</span>
        <input
          type="text"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ex.: Lavar louça"
          required
          autoFocus
        />
      </label>

      <label className="form__field">
        <span>Descrição (opcional)</span>
        <textarea
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
        />
      </label>

      <div className="form__row">
        <label className="form__field">
          <span>Prioridade</span>
          <select
            value={values.priority}
            onChange={(e) => set('priority', e.target.value as Priority)}
          >
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="form__field">
          <span>Status</span>
          <select
            value={values.status}
            onChange={(e) => set('status', e.target.value as TaskStatus)}
          >
            {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {TASK_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form__row">
        <label className="form__field">
          <span>Categoria</span>
          <select
            value={values.category}
            onChange={(e) => set('category', e.target.value as Category)}
          >
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </label>
        <label className="form__field">
          <span>Duração (min)</span>
          <input
            type="number"
            min={5}
            step={5}
            value={values.estimatedMinutes}
            onChange={(e) => set('estimatedMinutes', Number(e.target.value))}
            required
          />
        </label>
      </div>

      <label className="form__field">
        <span>Prazo (opcional)</span>
        <input
          type="date"
          value={values.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />
      </label>

      <div className="form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          {initial ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
