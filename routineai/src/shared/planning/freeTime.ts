import type { DayScheduleItem } from '../types';
import { getActivityKind } from '../types/activityKind';
import { timeToMinutes } from '../utils/time';

export interface FreeTimeBlock {
  startTime: string;
  endTime: string;
  /** true quando o bloco já passou hoje */
  isPast: boolean;
  /** true quando é o intervalo atual */
  isNow: boolean;
}

export interface LeisureBlock {
  startTime: string;
  endTime: string;
  title: string;
}

const DEFAULT_DAY_START = '06:00';
const DEFAULT_DAY_END = '23:00';

/** Calcula intervalos livres entre atividades agendadas */
export function findFreeTimeBlocks(
  schedule: DayScheduleItem[],
  now: string,
  dayStart = DEFAULT_DAY_START,
  dayEnd = DEFAULT_DAY_END,
): FreeTimeBlock[] {
  if (schedule.length === 0) {
    const nowMin = timeToMinutes(now);
    const startMin = timeToMinutes(dayStart);
    const endMin = timeToMinutes(dayEnd);
    if (nowMin >= endMin) return [];
    return [
      {
        startTime: nowMin > startMin ? now : dayStart,
        endTime: dayEnd,
        isPast: false,
        isNow: nowMin >= startMin && nowMin < endMin,
      },
    ];
  }

  const sorted = [...schedule].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const blocks: FreeTimeBlock[] = [];
  let cursor = dayStart;

  for (const item of sorted) {
    if (timeToMinutes(item.startTime) > timeToMinutes(cursor)) {
      blocks.push(createFreeBlock(cursor, item.startTime, now));
    }
    if (timeToMinutes(item.endTime) > timeToMinutes(cursor)) {
      cursor = item.endTime;
    }
  }

  if (timeToMinutes(cursor) < timeToMinutes(dayEnd)) {
    blocks.push(createFreeBlock(cursor, dayEnd, now));
  }

  return blocks.filter((b) => timeToMinutes(b.startTime) < timeToMinutes(b.endTime));
}

function createFreeBlock(start: string, end: string, now: string): FreeTimeBlock {
  const nowMin = timeToMinutes(now);
  const endMin = timeToMinutes(end);
  const startMin = timeToMinutes(start);
  return {
    startTime: start,
    endTime: end,
    isPast: nowMin >= endMin,
    isNow: nowMin >= startMin && nowMin < endMin,
  };
}

/** Blocos de lazer já cadastrados na rotina */
export function findLeisureBlocks(schedule: DayScheduleItem[]): LeisureBlock[] {
  return schedule
    .filter((item) => getActivityKind(item.category) === 'lazer')
    .map((item) => ({
      startTime: item.startTime,
      endTime: item.endTime,
      title: item.title,
    }));
}

/** Tarefas pendentes ou em andamento (não agendadas no cronograma ainda) */
export function countPendingTasks(
  tasks: { status: string }[],
): number {
  return tasks.filter(
    (t) => t.status === 'pendente' || t.status === 'em-andamento',
  ).length;
}
