# RoutineAI

Extensão de navegador (Chrome / Edge) que funciona como assistente pessoal de rotina.

**Etapa 1** — base funcional com rotina semanal demo e tela "Hoje".

## O que funciona nesta etapa

- Extensão Chrome Manifest V3 com interface própria
- Armazenamento local (`chrome.storage.local`)
- Rotina semanal do IFC Campus Concórdia (2F Informática) pré-carregada
- Tela **Hoje** com: Agora, Próxima atividade, Restante do dia
- Telas **Semana**, **Tarefas**, **Projetos** e **Configurações** (visualização)
- Módulo WhatsApp separado (apenas detecta a página — sem envio de mensagens)
- Restaurar dados iniciais nas configurações

## O que ainda NÃO está implementado

- Motor de planejamento automático
- Cadastro/edição de rotina, tarefas e projetos
- Replanejamento e linguagem natural
- Notificações reais do navegador
- Integração com WhatsApp para envio de mensagens

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Google Chrome ou Microsoft Edge

## Instalação para desenvolvimento

```bash
cd routineai
npm install
node scripts/generate-icons.mjs
npm run dev
```

O comando `npm run dev` inicia o Vite com hot reload. Para carregar a extensão:

1. Abra `chrome://extensions`
2. Ative **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `routineai/dist` (criada após o dev iniciar)

## Instalação para uso (build de produção)

```bash
cd routineai
npm install
node scripts/generate-icons.mjs
npm run build
```

Carregue a pasta `routineai/dist` em `chrome://extensions`.

## Como usar

1. Clique no ícone da extensão RoutineAI na barra do navegador
2. A interface abre em uma nova aba
3. Use a navegação superior para alternar entre as telas
4. Na tela **Hoje**, veja sua agenda do dia com destaque para a atividade atual

## Estrutura do projeto

```
routineai/
├── src/
│   ├── app/              # Interface React (telas principais)
│   ├── background/       # Service worker
│   ├── content/whatsapp/ # Módulo WhatsApp (separado do núcleo)
│   └── shared/
│       ├── data/         # Dados iniciais (seed)
│       ├── planning/     # Lógica de cronograma (expandir nas próximas etapas)
│       ├── storage/      # Persistência local
│       ├── types/        # Tipos TypeScript
│       └── utils/        # Utilitários (horários, etc.)
├── manifest.config.ts
└── package.json
```

## Próximas etapas sugeridas

1. **Etapa 2** — Cadastro e edição de rotina semanal
2. **Etapa 3** — Cadastro de tarefas e projetos
3. **Etapa 4** — Motor de planejamento do dia
4. **Etapa 5** — Replanejamento e comandos estruturados
5. **Etapa 6** — Notificações do navegador
6. **Etapa 7** — Camada de linguagem natural (sem IA externa inicialmente)

## WhatsApp

A extensão **não depende** do WhatsApp para funcionar. O módulo em `src/content/whatsapp/` está isolado e, nesta etapa, apenas registra que o WhatsApp Web foi detectado. Envio automático de mensagens pessoais **não** será implementado por métodos inseguros ou não oficiais.
