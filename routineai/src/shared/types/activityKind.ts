import type { Category } from '../types';

/** Filosofia da rotina: três grandes tipos de atividade */
export type ActivityKind = 'obrigacao' | 'manutencao' | 'lazer';

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  obrigacao: 'Obrigação',
  manutencao: 'Manutenção',
  lazer: 'Lazer',
};

/** Mapeia categoria para tipo de atividade */
export const CATEGORY_KIND: Record<Category, ActivityKind> = {
  'if-escola': 'obrigacao',
  estudos: 'manutencao',
  projetos: 'obrigacao',
  casa: 'obrigacao',
  ingles: 'manutencao',
  leitura: 'manutencao',
  escrita: 'manutencao',
  lazer: 'lazer',
  descanso: 'lazer',
  outros: 'obrigacao',
};

export function getActivityKind(category: Category): ActivityKind {
  return CATEGORY_KIND[category];
}

/** Categorias agrupadas por tipo — útil para selects no formulário */
export const CATEGORIES_BY_KIND: Record<ActivityKind, Category[]> = {
  obrigacao: ['if-escola', 'estudos', 'projetos', 'casa', 'outros'],
  manutencao: ['ingles', 'leitura', 'escrita'],
  lazer: ['lazer', 'descanso'],
};

export const ALL_CATEGORIES: Category[] = [
  'if-escola',
  'estudos',
  'projetos',
  'casa',
  'ingles',
  'leitura',
  'escrita',
  'lazer',
  'descanso',
  'outros',
];
