import type { RoutineActivity } from '../types';
import { timeToMinutes } from './time';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

export function validateTimeRange(startTime: string, endTime: string): string | null {
  if (!isValidTime(startTime)) return 'Horário inicial inválido (use HH:mm).';
  if (!isValidTime(endTime)) return 'Horário final inválido (use HH:mm).';
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    return 'O horário final deve ser depois do inicial.';
  }
  return null;
}

export function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const aS = timeToMinutes(aStart);
  const aE = timeToMinutes(aEnd);
  const bS = timeToMinutes(bStart);
  const bE = timeToMinutes(bEnd);
  return aS < bE && bS < aE;
}

/** Encontra atividade que conflita com o horário no mesmo dia */
export function findOverlappingActivity(
  routine: RoutineActivity[],
  dayOfWeek: RoutineActivity['dayOfWeek'],
  startTime: string,
  endTime: string,
  excludeId?: string,
): RoutineActivity | undefined {
  return routine.find(
    (item) =>
      item.id !== excludeId &&
      item.dayOfWeek === dayOfWeek &&
      timesOverlap(item.startTime, item.endTime, startTime, endTime),
  );
}

export function validateRoutineActivity(
  routine: RoutineActivity[],
  activity: Omit<RoutineActivity, 'id'> & { id?: string },
): string | null {
  if (!activity.title.trim()) return 'Informe um título.';
  const timeError = validateTimeRange(activity.startTime, activity.endTime);
  if (timeError) return timeError;

  const overlap = findOverlappingActivity(
    routine,
    activity.dayOfWeek,
    activity.startTime,
    activity.endTime,
    activity.id,
  );
  if (overlap) {
    return `Conflito com "${overlap.title}" (${overlap.startTime}–${overlap.endTime}).`;
  }
  return null;
}
