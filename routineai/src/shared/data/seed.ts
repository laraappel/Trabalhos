import type { AppData, RoutineActivity } from '../types';

function createId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

function routine(
  index: number,
  title: string,
  dayOfWeek: RoutineActivity['dayOfWeek'],
  startTime: string,
  endTime: string,
  category: RoutineActivity['category'] = 'if-escola',
  notes?: string,
): RoutineActivity {
  return {
    id: createId('routine', index),
    title,
    dayOfWeek,
    startTime,
    endTime,
    category,
    recurrence: 'semanal',
    notes,
  };
}

/** Rotina escolar IFC Campus Concórdia — turma 2F Informática */
export function createSeedData(): AppData {
  const routineItems: RoutineActivity[] = [
    // Segunda
    routine(1, 'História', 1, '07:30', '08:15'),
    routine(2, 'Biologia', 1, '08:15', '09:45'),
    routine(3, 'Projeto de Software', 1, '10:00', '11:30'),
    routine(4, 'Sociologia', 1, '13:30', '14:15'),
    routine(5, 'Educação Física', 1, '14:15', '15:00'),
    routine(6, 'Banco de Dados', 1, '16:00', '17:30', 'if-escola'),

    // Terça
    routine(7, 'Língua Portuguesa e Literatura', 2, '08:15', '09:00'),
    routine(8, 'Filosofia', 2, '09:00', '09:45'),
    routine(9, 'Desenvolvimento Web', 2, '10:00', '11:30'),
    routine(10, 'Matemática', 2, '13:30', '14:15'),
    routine(11, 'Educação Física', 2, '14:15', '15:00'),
    routine(12, 'Intervalo livre', 2, '15:00', '15:45', 'lazer'),
    routine(13, 'Geografia', 2, '16:00', '17:30'),

    // Quarta
    routine(14, 'Física', 3, '07:30', '09:00'),
    routine(15, 'Sociologia', 3, '09:00', '09:45'),
    routine(16, 'Artes', 3, '10:00', '10:45'),
    routine(17, 'História', 3, '10:45', '11:30'),
    routine(18, 'Tempo livre', 3, '13:30', '16:00', 'lazer'),
    routine(19, 'Tempo livre', 3, '16:00', '17:30', 'lazer'),

    // Quinta
    routine(20, 'Língua Portuguesa e Literatura', 4, '08:15', '09:45'),
    routine(21, 'Química', 4, '09:45', '11:30'),
    routine(22, 'Matemática', 4, '13:30', '15:00'),
    routine(23, 'Artes', 4, '15:00', '15:45'),
    routine(24, 'Livre / optativas', 4, '16:00', '17:30', 'lazer'),

    // Sexta
    routine(25, 'Filosofia', 5, '07:30', '08:15'),
    routine(26, 'Desenvolvimento Web', 5, '08:15', '09:45'),
    routine(27, 'Tempo livre', 5, '10:00', '11:30', 'lazer'),
  ];

  return {
    version: 1,
    routine: routineItems,
    tasks: [
      {
        id: 'task-1',
        title: 'Lavar louça',
        description: 'Tarefa doméstica',
        priority: 'media',
        category: 'casa',
        estimatedMinutes: 20,
        status: 'pendente',
      },
      {
        id: 'task-2',
        title: 'Organizar mesa de estudo',
        priority: 'baixa',
        category: 'casa',
        estimatedMinutes: 15,
        status: 'pendente',
      },
    ],
    projects: [
      {
        id: 'project-1',
        name: 'Projeto pessoal 1',
        description: 'Primeiro projeto — renomeie nas configurações futuras.',
        priority: 'alta',
        nextAction: 'Definir próxima ação',
      },
      {
        id: 'project-2',
        name: 'Projeto pessoal 2',
        description: 'Segundo projeto — renomeie nas configurações futuras.',
        priority: 'media',
        nextAction: 'Definir próxima ação',
      },
      {
        id: 'project-3',
        name: 'Projeto pessoal 3',
        description: 'Terceiro projeto — renomeie nas configurações futuras.',
        priority: 'media',
        nextAction: 'Definir próxima ação',
      },
    ],
    settings: {
      notifications: {
        enabled: false,
        dailySummaryTime: '07:00',
        advanceMinutes: 10,
      },
      sleep: {
        bedtime: '23:00',
        wakeTime: '06:30',
      },
    },
  };
}
