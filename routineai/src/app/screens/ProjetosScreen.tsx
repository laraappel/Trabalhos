import type { AppData } from '@/shared/types';
import { PRIORITY_LABELS } from '@/shared/types';

interface ProjetosScreenProps {
  data: AppData;
}

export function ProjetosScreen({ data }: ProjetosScreenProps) {
  const tasksForProject = (projectId: string) =>
    data.tasks.filter((t) => t.projectId === projectId);

  return (
    <section className="screen">
      <header className="screen-header">
        <h2>Projetos</h2>
        <p className="screen-header__subtitle">
          Projetos separados de tarefas — cada um com próxima ação
        </p>
      </header>

      <ul className="item-list">
        {data.projects.map((project) => {
          const relatedTasks = tasksForProject(project.id);
          return (
            <li key={project.id} className="item-card item-card--project">
              <h3>{project.name}</h3>
              {project.description && (
                <p className="item-card__description">{project.description}</p>
              )}
              <div className="item-card__meta">
                <span className={`badge badge--priority-${project.priority}`}>
                  {PRIORITY_LABELS[project.priority]}
                </span>
                {project.dueDate && <span className="badge">Prazo: {project.dueDate}</span>}
              </div>
              {project.nextAction && (
                <p className="item-card__next-action">
                  <strong>Próxima ação:</strong> {project.nextAction}
                </p>
              )}
              {relatedTasks.length > 0 && (
                <ul className="item-card__sublist">
                  {relatedTasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <p className="screen-note">
        Fase 2: cadastro e edição de projetos com próxima ação.
      </p>
    </section>
  );
}
