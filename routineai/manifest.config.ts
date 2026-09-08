import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'RoutineAI',
  version: '0.1.0',
  description: 'Assistente pessoal de rotina integrado ao navegador.',
  icons: {
    '16': 'icons/icon16.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  action: {
    default_title: 'RoutineAI',
    default_icon: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
    },
  },
  options_ui: {
    page: 'src/app/index.html',
    open_in_tab: true,
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  permissions: ['storage', 'notifications', 'alarms'],
  host_permissions: ['https://web.whatsapp.com/*'],
  content_scripts: [
    {
      matches: ['https://web.whatsapp.com/*'],
      js: ['src/content/whatsapp/index.ts'],
      run_at: 'document_idle',
    },
  ],
});
