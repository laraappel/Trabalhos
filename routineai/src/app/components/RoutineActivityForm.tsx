import { useState, type FormEvent } from 'react';
import type { Category, Recurrence, RoutineActivity, WeekDay } from '@/shared/types';
import {
  CATEGORY_LABELS,
  RECURRENCE_LABELS,
  WEEKDAY_LABELS,
} from '@/shared/types';
import { ALL_CATEGORIES } from '@/shared/types/activityKind';
import { validateRoutineActivity } from '@/shared/utils/validation';

export interface RoutineActivityFormValues {
  title: string;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  category: Category;
  recurrence: Recurrence;
  notes: string;
}

interface RoutineActivityFormProps {
  initial?: RoutineActivity;
  defaultDay?: WeekDay;
  routine: RoutineActivity[];
  onSubmit: (values: RoutineActivityFormValues) => void;
  onCancel: () => void;
}

const WEEK_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0];

const emptyForm = (day: WeekDay = 1): RoutineActivityFormValues => ({
  title: '',
  dayOfWeek: day,
  startTime: '08:00',
  endTime: '09:00',
  category: 'if-escola',
  recurrence: 'semanal',
  notes: '',
});

export function RoutineActivityForm({
  initial,
  defaultDay = 1,
  routine,
  onSubmit,
  onCancel,
}: RoutineActivityFormProps) {
  const [values, setValues] = useState<RoutineActivityFormValues>(
    initial
      ? {
          title: initial.title,
          dayOfWeek: initial.dayOfWeek,
          startTime: initial.startTime,
          endTime: initial.endTime,
          category: initial.category,
          recurrence: initial.recurrence,
          notes: initial.notes ?? '',
        }
      : emptyForm(defaultDay),
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateRoutineActivity(routine, {
      ...values,
      id: initial?.id,
      notes: values.notes || undefined,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(values);
  };

  const set = <K extends keyof RoutineActivityFormValues>(
    key: K,
    value: RoutineActivityFormValues[K],
  ) => {
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
          placeholder="Ex.: Banco de Dados"
          required
          autoFocus
        />
      </label>

      <label className="form__field">
        <span>Dia da semana</span>
        <select
          value={values.dayOfWeek}
          onChange={(e) => set('dayOfWeek', Number(e.target.value) as WeekDay)}
        >
          {WEEK_DAYS.map((day) => (
            <option key={day} value={day}>
              {WEEKDAY_LABELS[day]}
            </option>
          ))}
        </select>
      </label>

      <div className="form__row">
        <label className="form__field">
          <span>Início</span>
          <input
            type="time"
            value={values.startTime}
            onChange={(e) => set('startTime', e.target.value)}
            required
          />
        </label>
        <label className="form__field">
          <span>Fim</span>
          <input
            type="time"
            value={values.endTime}
            onChange={(e) => set('endTime', e.target.value)}
            required
          />
        </label>
      </div>

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
        <span>Recorrência</span>
        <select
          value={values.recurrence}
          onChange={(e) => set('recurrence', e.target.value as Recurrence)}
        >
          {(Object.keys(RECURRENCE_LABELS) as Recurrence[]).map((r) => (
            <option key={r} value={r}>
              {RECURRENCE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>

      <label className="form__field">
        <span>Observação (opcional)</span>
        <textarea
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={2}
          placeholder="Notas sobre esta atividade"
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
