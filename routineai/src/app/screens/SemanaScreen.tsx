import { useState } from 'react';
import type { AppData, RoutineActivity, WeekDay } from '@/shared/types';
import { CATEGORY_LABELS, WEEKDAY_LABELS } from '@/shared/types';
import { ACTIVITY_KIND_LABELS, getActivityKind } from '@/shared/types/activityKind';
import { generateId } from '@/shared/utils/id';
import { durationMinutes, formatDuration } from '@/shared/utils/time';
import { mutateAppData } from '@/shared/storage';
import { Modal } from '../components/Modal';
import {
  RoutineActivityForm,
  type RoutineActivityFormValues,
} from '../components/RoutineActivityForm';

interface SemanaScreenProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
}

const SCHOOL_DAYS: WeekDay[] = [1, 2, 3, 4, 5];

function groupByDay(routine: RoutineActivity[]): Map<WeekDay, RoutineActivity[]> {
  const map = new Map<WeekDay, RoutineActivity[]>();
  for (const day of SCHOOL_DAYS) {
    map.set(day, []);
  }
  for (const item of routine) {
    const list = map.get(item.dayOfWeek);
    if (list) {
      list.push(item);
    } else if (item.dayOfWeek === 6 || item.dayOfWeek === 0) {
      // sábado/domingo — exibir se existirem
      if (!map.has(item.dayOfWeek)) map.set(item.dayOfWeek, []);
      map.get(item.dayOfWeek)!.push(item);
    }
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return map;
}

export function SemanaScreen({ data, onDataChange }: SemanaScreenProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineActivity | null>(null);
  const [defaultDay, setDefaultDay] = useState<WeekDay>(1);

  const byDay = groupByDay(data.routine);

  const openCreate = (day: WeekDay) => {
    setEditing(null);
    setDefaultDay(day);
    setModalOpen(true);
  };

  const openEdit = (activity: RoutineActivity) => {
    setEditing(activity);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (values: RoutineActivityFormValues) => {
    const activity: RoutineActivity = {
      id: editing?.id ?? generateId('routine'),
      title: values.title.trim(),
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime,
      endTime: values.endTime,
      category: values.category,
      recurrence: values.recurrence,
      notes: values.notes.trim() || undefined,
    };

    const updated = await mutateAppData((current) => {
      const routine = editing
        ? current.routine.map((item) => (item.id === editing.id ? activity : item))
        : [...current.routine, activity];
      return { ...current, routine };
    });

    onDataChange(updated);
    closeModal();
  };

  const handleDelete = async (activity: RoutineActivity) => {
    const confirmed = window.confirm(`Excluir "${activity.title}"?`);
    if (!confirmed) return;

    const updated = await mutateAppData((current) => ({
      ...current,
      routine: current.routine.filter((item) => item.id !== activity.id),
    }));
    onDataChange(updated);
  };

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h2>Semana</h2>
          <p className="screen-header__subtitle">
            Rotina fixa — IFC Campus Concórdia, 2F Informática
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => openCreate(1)}>
          + Nova atividade
        </button>
      </header>

      <div className="week-grid">
        {SCHOOL_DAYS.map((day) => {
          const items = byDay.get(day) ?? [];
          return (
            <article key={day} className="week-day">
              <div className="week-day__header">
                <h3 className="week-day__title">{WEEKDAY_LABELS[day]}</h3>
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => openCreate(day)}
                >
                  +
                </button>
              </div>
              {items.length === 0 ? (
                <p className="week-day__empty">Sem atividades</p>
              ) : (
                <ul className="week-day__list">
                  {items.map((item) => {
                    const kind = getActivityKind(item.category);
                    return (
                      <li key={item.id} className="week-day__item">
                        <div className="week-day__item-main">
                          <span className="week-day__time">
                            {item.startTime}–{item.endTime}
                          </span>
                          <span className="week-day__name">{item.title}</span>
                          <div className="week-day__badges">
                            <span className="badge badge--category">
                              {CATEGORY_LABELS[item.category]}
                            </span>
                            <span className={`badge badge--kind-${kind}`}>
                              {ACTIVITY_KIND_LABELS[kind]}
                            </span>
                            <span className="week-day__duration">
                              {formatDuration(durationMinutes(item.startTime, item.endTime))}
                            </span>
                          </div>
                        </div>
                        <div className="week-day__actions">
                          <button
                            type="button"
                            className="btn btn--small btn--secondary"
                            onClick={() => openEdit(item)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--small btn--danger"
                            onClick={() => void handleDelete(item)}
                          >
                            Excluir
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <Modal
        title={editing ? 'Editar atividade' : 'Nova atividade'}
        open={modalOpen}
        onClose={closeModal}
      >
        <RoutineActivityForm
          initial={editing ?? undefined}
          defaultDay={defaultDay}
          routine={data.routine}
          onSubmit={(values) => void handleSave(values)}
          onCancel={closeModal}
        />
      </Modal>
    </section>
  );
}
