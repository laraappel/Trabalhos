/** Converte "HH:mm" em minutos desde meia-noite */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Converte minutos desde meia-noite em "HH:mm" */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Calcula duração em minutos entre dois horários no mesmo dia */
export function durationMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/** Formata duração para exibição */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Retorna horário atual como "HH:mm" */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** Retorna dia da semana atual (0=domingo … 6=sábado) */
export function getCurrentWeekDay(): number {
  return new Date().getDay();
}

/** Formata data para exibição em português */
export function formatTodayDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Verifica se um horário está dentro de um intervalo [start, end) */
export function isTimeInRange(
  current: string,
  start: string,
  end: string,
): boolean {
  const c = timeToMinutes(current);
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return c >= s && c < e;
}

/** Verifica se um horário já passou (>= end) */
export function isTimePast(current: string, end: string): boolean {
  return timeToMinutes(current) >= timeToMinutes(end);
}

/** Verifica se um horário ainda não começou (< start) */
export function isTimeBefore(current: string, start: string): boolean {
  return timeToMinutes(current) < timeToMinutes(start);
}
