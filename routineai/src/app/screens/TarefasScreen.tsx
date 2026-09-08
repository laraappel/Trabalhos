import { useMemo, useState } from 'react';
import type { AppData, Task, TaskStatus } from '@/shared/types';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/shared/types';
import { generateId } from '@/shared/utils/id';
import { formatDuration } from '@/shared/utils/time';
import { mutateAppData } from '@/shared/storage';
import { Modal } from '../components/Modal';
import { TaskForm, type TaskFormValues } from '../components/TaskForm';

interface TarefasScreenProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
}

type TaskFilter = 'ativas' | 'concluidas' | 'todas';

const ACTIVE_STATUSES: TaskStatus[] = ['pendente', 'em-andamento', 'adiada'];

export function TarefasScreen({ data, onDataChange }: TarefasScreenProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('ativas');

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'ativas':
        return data.tasks.filter((t) => ACTIVE_STATUSES.includes(t.status));
      case 'concluidas':
        return data.tasks.filter(
          (t) => t.status === 'concluida' || t.status === 'cancelada',
        );
      case 'todas':
        return data.tasks;
    }
  }, [data.tasks, filter]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (values: TaskFormValues) => {
    const task: Task = {
      id: editing?.id ?? generateId('task'),
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      dueDate: values.dueDate || undefined,
      priority: values.priority,
      category: values.category,
      estimatedMinutes: values.estimatedMinutes,
      status: values.status,
      projectId: editing?.projectId,
    };

    const updated = await mutateAppData((current) => {
      const tasks = editing
        ? current.tasks.map((item) => (item.id === editing.id ? task : item))
        : [...current.tasks, task];
      return { ...current, tasks };
    });

    onDataChange(updated);
    closeModal();
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Excluir tarefa "${task.title}"?`);
    if (!confirmed) return;

    const updated = await mutateAppData((current) => ({
      ...current,
      tasks: current.tasks.filter((item) => item.id !== task.id),
    }));
    onDataChange(updated);
  };

  const handleQuickStatus = async (task: Task, status: TaskStatus) => {
    const updated = await mutateAppData((current) => ({
      ...current,
      tasks: current.tasks.map((item) =>
        item.id === task.id ? { ...item, status } : item,
      ),
    }));
    onDataChange(updated);
  };

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <h2>Tarefas</h2>
          <p className="screen-header__subtitle">
            {data.tasks.filter((t) => ACTIVE_STATUSES.includes(t.status)).length} ativa(s)
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          + Nova tarefa
        </button>
      </header>

      <div className="filter-bar">
        {(['ativas', 'concluidas', 'todas'] as TaskFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-bar__item${filter === f ? ' filter-bar__item--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'ativas' ? 'Ativas' : f === 'concluidas' ? 'Concluídas' : 'Todas'}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma tarefa neste filtro.</p>
        </div>
      ) : (
        <ul className="item-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="item-card">
              <div className="item-card__header">
                <h3>{task.title}</h3>
                <div className="item-card__buttons">
                  <button
                    type="button"
                    className="btn btn--small btn--secondary"
                    onClick={() => openEdit(task)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => void handleDelete(task)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="item-card__description">{task.description}</p>
              )}
              <div className="item-card__meta">
                <span className={`badge badge--priority-${task.priority}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
                <span className="badge badge--category">{CATEGORY_LABELS[task.category]}</span>
                <span className="badge">{formatDuration(task.estimatedMinutes)}</span>
                <span className={`badge badge--status-${task.status}`}>
                  {TASK_STATUS_LABELS[task.status]}
                </span>
                {task.dueDate && <span className="badge">Prazo: {task.dueDate}</span>}
              </div>
              {task.status !== 'concluida' && task.status !== 'cancelada' && (
                <div className="item-card__quick-actions">
                  {task.status !== 'em-andamento' && (
                    <button
                      type="button"
                      className="btn btn--small btn--secondary"
                      onClick={() => void handleQuickStatus(task, 'em-andamento')}
                    >
                      Iniciar
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--small btn--secondary"
                    onClick={() => void handleQuickStatus(task, 'concluida')}
                  >
                    Concluir
                  </button>
                  <button
                    type="button"
                    className="btn btn--small btn--secondary"
                    onClick={() => void handleQuickStatus(task, 'adiada')}
                  >
                    Adiar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal
        title={editing ? 'Editar tarefa' : 'Nova tarefa'}
        open={modalOpen}
        onClose={closeModal}
      >
        <TaskForm
          initial={editing ?? undefined}
          onSubmit={(values) => void handleSave(values)}
          onCancel={closeModal}
        />
      </Modal>
    </section>
  );
}
