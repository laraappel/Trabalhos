import type { ScreenId } from '@/shared/types';

interface NavigationProps {
  active: ScreenId;
  onChange: (screen: ScreenId) => void;
}

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'semana', label: 'Semana' },
  { id: 'tarefas', label: 'Tarefas' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'configuracoes', label: 'Configurações' },
];

export function Navigation({ active, onChange }: NavigationProps) {
  return (
    <nav className="nav" aria-label="Navegação principal">
      {SCREENS.map((screen) => (
        <button
          key={screen.id}
          type="button"
          className={`nav__item${active === screen.id ? ' nav__item--active' : ''}`}
          onClick={() => onChange(screen.id)}
          aria-current={active === screen.id ? 'page' : undefined}
        >
          {screen.label}
        </button>
      ))}
    </nav>
  );
}
