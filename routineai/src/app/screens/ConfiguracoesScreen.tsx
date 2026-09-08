import { useState } from 'react';
import type { AppData } from '@/shared/types';
import { resetAppData, saveAppData } from '@/shared/storage';

interface ConfiguracoesScreenProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
}

export function ConfiguracoesScreen({ data, onDataChange }: ConfiguracoesScreenProps) {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Restaurar dados iniciais? Isso substitui rotina, tarefas e projetos pelos valores demo.',
    );
    if (!confirmed) return;

    setResetting(true);
    setMessage(null);
    try {
      const seed = await resetAppData();
      onDataChange(seed);
      setMessage('Dados restaurados com sucesso.');
    } catch {
      setMessage('Erro ao restaurar dados.');
    } finally {
      setResetting(false);
    }
  };

  const toggleNotifications = async () => {
    const updated: AppData = {
      ...data,
      settings: {
        ...data.settings,
        notifications: {
          ...data.settings.notifications,
          enabled: !data.settings.notifications.enabled,
        },
      },
    };
    await saveAppData(updated);
    onDataChange(updated);
  };

  return (
    <section className="screen">
      <header className="screen-header">
        <h2>Configurações</h2>
      </header>

      <div className="settings-group">
        <h3>Sono</h3>
        <dl className="settings-list">
          <div>
            <dt>Acordar</dt>
            <dd>{data.settings.sleep.wakeTime}</dd>
          </div>
          <div>
            <dt>Dormir</dt>
            <dd>{data.settings.sleep.bedtime}</dd>
          </div>
        </dl>
        <p className="settings-hint">Edição de horários virá em etapa futura.</p>
      </div>

      <div className="settings-group">
        <h3>Notificações</h3>
        <dl className="settings-list">
          <div>
            <dt>Status</dt>
            <dd>{data.settings.notifications.enabled ? 'Ativadas' : 'Desativadas'}</dd>
          </div>
          <div>
            <dt>Resumo diário</dt>
            <dd>{data.settings.notifications.dailySummaryTime}</dd>
          </div>
          <div>
            <dt>Antecedência</dt>
            <dd>{data.settings.notifications.advanceMinutes} minutos</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--secondary" onClick={() => void toggleNotifications()}>
          {data.settings.notifications.enabled ? 'Desativar' : 'Ativar'} notificações
        </button>
        <p className="settings-hint">
          Notificações reais serão implementadas na Etapa dedicada. Por enquanto, apenas o
          preferência é salva.
        </p>
      </div>

      <div className="settings-group">
        <h3>Dados</h3>
        <button
          type="button"
          className="btn btn--danger"
          disabled={resetting}
          onClick={() => void handleReset()}
        >
          {resetting ? 'Restaurando…' : 'Restaurar dados iniciais'}
        </button>
        {message && <p className="settings-message">{message}</p>}
      </div>

      <div className="settings-group">
        <h3>WhatsApp Web</h3>
        <p className="settings-hint">
          Módulo separado — a extensão funciona sem o WhatsApp aberto. Integração com envio de
          mensagens não está implementada (requer abordagem segura e oficial).
        </p>
      </div>
    </section>
  );
}
