import { useEffect, useState } from 'react';
import type { AppData, Task } from '@/shared/types';
import { PRIORITY_LABELS, TASK_STATUS_LABELS } from '@/shared/types';
import { getTodayView } from '@/shared/planning/daySchedule';
import {
  countPendingTasks,
  findFreeTimeBlocks,
  findLeisureBlocks,
} from '@/shared/planning/freeTime';
import { formatDuration, formatTodayDate, getCurrentTime } from '@/shared/utils/time';
import { ScheduleItemCard } from '../components/ScheduleItemCard';

interface HojeScreenProps {
  data: AppData;
}

function getActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    (t) => t.status === 'pendente' || t.status === 'em-andamento',
  );
}

export function HojeScreen({ data }: HojeScreenProps) {
  const [now, setNow] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => setNow(getCurrentTime()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const view = getTodayView(data.routine);
  const freeBlocks = findFreeTimeBlocks(view.schedule, now);
  const leisureBlocks = findLeisureBlocks(view.schedule);
  const activeTasks = getActiveTasks(data.tasks);
  const hasContent = view.schedule.length > 0 || activeTasks.length > 0;

  const upcomingFree = freeBlocks.filter((b) => !b.isPast);
  const currentFree = freeBlocks.find((b) => b.isNow);

  return (
    <section className="screen screen--hoje">
      <header className="screen-header">
        <div>
          <h2>Hoje</h2>
          <p className="screen-header__date">{formatTodayDate()}</p>
        </div>
        <p className="screen-header__clock" aria-live="polite">
          Agora: <strong>{now}</strong>
        </p>
      </header>

      {!hasContent && (
        <div className="empty-state">
          <p>Não há atividades nem tarefas para hoje.</p>
          <p className="empty-state__hint">
            Cadastre sua rotina na aba Semana ou tarefas na aba Tarefas.
          </p>
        </div>
      )}

      {hasContent && (
        <div className="hoje-grid">
          {/* 1. O que estou fazendo agora? */}
          <section className="today-section today-section--highlight">
            <h3 className="today-section__title">Agora</h3>
            {view.current ? (
              <ScheduleItemCard item={view.current} highlight="current" />
            ) : currentFree ? (
              <div className="free-block free-block--now">
                <p className="free-block__label">Tempo livre</p>
                <p className="free-block__time">
                  {currentFree.startTime} – {currentFree.endTime}
                </p>
              </div>
            ) : (
              <p className="today-section__empty">
                Nenhuma atividade em andamento no momento.
              </p>
            )}
          </section>

          {/* 2. O que vem depois? */}
          <section className="today-section">
            <h3 className="today-section__title">Próxima</h3>
            {view.next ? (
              <ScheduleItemCard item={view.next} highlight="next" />
            ) : (
              <p className="today-section__empty">
                Não há mais atividades programadas para hoje.
              </p>
            )}
          </section>

          {/* 3. O que ainda preciso fazer? */}
          <section className="today-section">
            <h3 className="today-section__title">
              Restante do dia
              {view.remaining.length > 0 && (
                <span className="today-section__count">{view.remaining.length}</span>
              )}
            </h3>
            {view.remaining.length > 0 ? (
              <div className="schedule-list schedule-list--compact">
                {view.remaining.map((item) => (
                  <ScheduleItemCard
                    key={item.id}
                    item={item}
                    compact
                    highlight={
                      item.id === view.current?.id
                        ? 'current'
                        : item.id === view.next?.id
                          ? 'next'
                          : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="today-section__empty">Sem blocos restantes na rotina.</p>
            )}
          </section>

          {/* Tarefas pendentes (ainda não agendadas no cronograma) */}
          {activeTasks.length > 0 && (
            <section className="today-section">
              <h3 className="today-section__title">
                Tarefas pendentes
                <span className="today-section__count">{countPendingTasks(data.tasks)}</span>
              </h3>
              <ul className="task-summary-list">
                {activeTasks.map((task) => (
                  <li key={task.id} className="task-summary-item">
                    <span className="task-summary-item__title">{task.title}</span>
                    <span className={`badge badge--priority-${task.priority}`}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    <span className="badge">{formatDuration(task.estimatedMinutes)}</span>
                    <span className={`badge badge--status-${task.status}`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="today-section__hint">
                Tarefas ainda não entram no cronograma — isso virá na Fase 2 (motor de
                planejamento).
              </p>
            </section>
          )}

          {/* 4. Quando tenho tempo livre? */}
          <section className="today-section">
            <h3 className="today-section__title">Tempo livre</h3>
            {upcomingFree.length > 0 ? (
              <ul className="free-time-list">
                {upcomingFree.map((block) => (
                  <li
                    key={`${block.startTime}-${block.endTime}`}
                    className={`free-block${block.isNow ? ' free-block--now' : ''}`}
                  >
                    <span className="free-block__time">
                      {block.startTime} – {block.endTime}
                    </span>
                    {block.isNow && <span className="badge">Agora</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="today-section__empty">Sem intervalos livres restantes hoje.</p>
            )}
          </section>

          {/* Lazer programado — tratado como parte válida da rotina */}
          {leisureBlocks.length > 0 && (
            <section className="today-section">
              <h3 className="today-section__title">Lazer programado</h3>
              <ul className="free-time-list">
                {leisureBlocks.map((block) => (
                  <li key={`${block.startTime}-${block.title}`} className="free-block free-block--leisure">
                    <span className="free-block__time">
                      {block.startTime} – {block.endTime}
                    </span>
                    <span>{block.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </section>
  );
}
