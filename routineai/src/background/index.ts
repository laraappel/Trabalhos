/** Service worker — abre a interface principal ao clicar no ícone da extensão */

chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});

// Inicializa dados na primeira instalação
chrome.runtime.onInstalled.addListener(async () => {
  const { loadAppData } = await import('../shared/storage/index');
  await loadAppData();
});
