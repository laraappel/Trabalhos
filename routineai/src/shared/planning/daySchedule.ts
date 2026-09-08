import type { DayScheduleItem, RoutineActivity, WeekDay } from '../types';
import { getCurrentTime, getCurrentWeekDay, isTimeBefore, isTimeInRange, isTimePast } from '../utils/time';

/** Monta o cronograma do dia a partir da rotina semanal (sem motor de planejamento ainda) */
export function buildDayScheduleFromRoutine(
  routine: RoutineActivity[],
  dayOfWeek: WeekDay = getCurrentWeekDay() as WeekDay,
): DayScheduleItem[] {
  const now = getCurrentTime();

  return routine
    .filter((item) => item.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((item) => {
      let status: DayScheduleItem['status'] = 'pendente';

      if (isTimeInRange(now, item.startTime, item.endTime)) {
        status = 'em-andamento';
      } else if (isTimePast(now, item.endTime)) {
        status = 'concluida';
      }

      return {
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        category: item.category,
        status,
        source: 'routine' as const,
        sourceId: item.id,
      };
    });
}

export interface TodayView {
  schedule: DayScheduleItem[];
  current: DayScheduleItem | null;
  next: DayScheduleItem | null;
  remaining: DayScheduleItem[];
}

export function getTodayView(
  routine: RoutineActivity[],
  dayOfWeek: WeekDay = getCurrentWeekDay() as WeekDay,
): TodayView {
  const schedule = buildDayScheduleFromRoutine(routine, dayOfWeek);
  const now = getCurrentTime();

  const current = schedule.find((item) => item.status === 'em-andamento') ?? null;

  const next =
    schedule.find(
      (item) =>
        item.status === 'pendente' && isTimeBefore(now, item.startTime),
    ) ?? null;

  const remaining = schedule.filter(
    (item) =>
      item.status === 'pendente' ||
      item.status === 'em-andamento',
  );

  return { schedule, current, next, remaining };
}
