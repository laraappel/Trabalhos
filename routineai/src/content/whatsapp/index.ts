/**
 * Módulo WhatsApp Web — placeholder da Etapa 1.
 *
 * Este script só detecta se o WhatsApp Web está aberto.
 * Não envia mensagens, não acessa credenciais e não manipula o chat.
 * A integração real será desenvolvida em etapas futuras.
 */

const WHATSAPP_HOST = 'web.whatsapp.com';

function isWhatsAppPage(): boolean {
  return window.location.hostname === WHATSAPP_HOST;
}

if (isWhatsAppPage()) {
  console.info('[RoutineAI] WhatsApp Web detectado. Módulo de integração ainda não ativo.');
}

export {};
