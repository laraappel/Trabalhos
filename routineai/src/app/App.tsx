import { useCallback, useEffect, useState } from 'react';
import type { AppData, ScreenId } from '@/shared/types';
import { loadAppData, subscribeAppData } from '@/shared/storage';
import { Navigation } from './components/Navigation';
import { HojeScreen } from './screens/HojeScreen';
import { SemanaScreen } from './screens/SemanaScreen';
import { TarefasScreen } from './screens/TarefasScreen';
import { ProjetosScreen } from './screens/ProjetosScreen';
import { ConfiguracoesScreen } from './screens/ConfiguracoesScreen';

export function App() {
  const [screen, setScreen] = useState<ScreenId>('hoje');
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const appData = await loadAppData();
      setData(appData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeAppData((newData) => {
      setData(newData);
    });
  }, [refresh]);

  if (loading) {
    return (
      <div className="app app--loading">
        <p>Carregando RoutineAI…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app app--error">
        <p>{error ?? 'Dados não disponíveis'}</p>
        <button type="button" onClick={() => void refresh()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>RoutineAI</h1>
          <p className="app-header__subtitle">Assistente pessoal de rotina</p>
        </div>
      </header>

      <Navigation active={screen} onChange={setScreen} />

      <main className="app-main">
        {screen === 'hoje' && <HojeScreen data={data} />}
        {screen === 'semana' && <SemanaScreen data={data} onDataChange={setData} />}
        {screen === 'tarefas' && <TarefasScreen data={data} onDataChange={setData} />}
        {screen === 'projetos' && <ProjetosScreen data={data} />}
        {screen === 'configuracoes' && (
          <ConfiguracoesScreen data={data} onDataChange={setData} />
        )}
      </main>
    </div>
  );
}
