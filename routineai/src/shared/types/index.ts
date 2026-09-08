/** Dias da semana (0 = domingo, 6 = sábado — padrão JavaScript) */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

export const WEEKDAY_SHORT: Record<WeekDay, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

export type Category =
  | 'if-escola'
  | 'estudos'
  | 'projetos'
  | 'casa'
  | 'ingles'
  | 'leitura'
  | 'escrita'
  | 'lazer'
  | 'descanso'
  | 'outros';

export const CATEGORY_LABELS: Record<Category, string> = {
  'if-escola': 'IF/Escola',
  estudos: 'Estudos',
  projetos: 'Projetos',
  casa: 'Casa',
  ingles: 'Inglês',
  leitura: 'Leitura',
  escrita: 'Escrita',
  lazer: 'Lazer',
  descanso: 'Descanso',
  outros: 'Outros',
};

export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

export const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

export type TaskStatus =
  | 'pendente'
  | 'em-andamento'
  | 'concluida'
  | 'adiada'
  | 'cancelada';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  'em-andamento': 'Em andamento',
  concluida: 'Concluída',
  adiada: 'Adiada',
  cancelada: 'Cancelada',
};

export type Recurrence = 'semanal' | 'quinzenal' | 'mensal';

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  semanal: 'Semanal',
  quinzenal: 'Quinzenal',
  mensal: 'Mensal',
};

/** Atividade recorrente da rotina semanal */
export interface RoutineActivity {
  id: string;
  title: string;
  dayOfWeek: WeekDay;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  category: Category;
  recurrence: Recurrence;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date "YYYY-MM-DD"
  priority: Priority;
  category: Category;
  estimatedMinutes: number;
  projectId?: string;
  status: TaskStatus;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  nextAction?: string;
}

/** Item do cronograma do dia (rotina fixa ou tarefa agendada) */
export interface DayScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: Category;
  priority?: Priority;
  status: 'pendente' | 'em-andamento' | 'concluida' | 'perdida' | 'adiada';
  source: 'routine' | 'task' | 'manual';
  sourceId?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dailySummaryTime: string; // "HH:mm"
  advanceMinutes: number;
}

export interface SleepSettings {
  bedtime: string; // "HH:mm"
  wakeTime: string; // "HH:mm"
}

export interface AppSettings {
  notifications: NotificationSettings;
  sleep: SleepSettings;
}

export interface AppData {
  version: number;
  routine: RoutineActivity[];
  tasks: Task[];
  projects: Project[];
  settings: AppSettings;
}

export type ScreenId = 'hoje' | 'semana' | 'tarefas' | 'projetos' | 'configuracoes';
