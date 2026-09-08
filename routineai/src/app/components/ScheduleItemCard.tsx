import type { DayScheduleItem } from '@/shared/types';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/shared/types';
import { ACTIVITY_KIND_LABELS, getActivityKind } from '@/shared/types/activityKind';
import { durationMinutes, formatDuration } from '@/shared/utils/time';

interface ScheduleItemCardProps {
  item: DayScheduleItem;
  highlight?: 'current' | 'next' | null;
  compact?: boolean;
}

const STATUS_LABELS: Record<DayScheduleItem['status'], string> = {
  pendente: 'Pendente',
  'em-andamento': 'Em andamento',
  concluida: 'Concluída',
  perdida: 'Perdida',
  adiada: 'Adiada',
};

export function ScheduleItemCard({
  item,
  highlight = null,
  compact = false,
}: ScheduleItemCardProps) {
  const duration = formatDuration(durationMinutes(item.startTime, item.endTime));
  const kind = getActivityKind(item.category);

  return (
    <article
      className={`schedule-card schedule-card--${item.category}${
        highlight === 'current' ? ' schedule-card--current' : ''
      }${highlight === 'next' ? ' schedule-card--next' : ''}${
        compact ? ' schedule-card--compact' : ''
      }`}
    >
      <div className="schedule-card__time">
        <span>{item.startTime}</span>
        <span className="schedule-card__separator">–</span>
        <span>{item.endTime}</span>
      </div>

      <div className="schedule-card__body">
        <h3 className="schedule-card__title">{item.title}</h3>
        <div className="schedule-card__meta">
          <span className="badge badge--category">{CATEGORY_LABELS[item.category]}</span>
          <span className={`badge badge--kind-${kind}`}>{ACTIVITY_KIND_LABELS[kind]}</span>
          <span className="badge">{duration}</span>
          {item.priority && (
            <span className={`badge badge--priority-${item.priority}`}>
              {PRIORITY_LABELS[item.priority]}
            </span>
          )}
          {!compact && (
            <span className={`badge badge--status-${item.status}`}>
              {STATUS_LABELS[item.status]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
