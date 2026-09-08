import type { AppData } from '../types';
import { createSeedData } from '../data/seed';

const STORAGE_KEY = 'routineai_data';

export async function loadAppData(): Promise<AppData> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as AppData | undefined;

  if (stored && stored.version === 1) {
    return stored;
  }

  const seed = createSeedData();
  await saveAppData(seed);
  return seed;
}

export async function saveAppData(data: AppData): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

export async function mutateAppData(
  updater: (data: AppData) => AppData,
): Promise<AppData> {
  const current = await loadAppData();
  const updated = updater(current);
  await saveAppData(updated);
  return updated;
}

export async function resetAppData(): Promise<AppData> {
  const seed = createSeedData();
  await saveAppData(seed);
  return seed;
}

export function subscribeAppData(callback: (data: AppData) => void): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local' || !changes[STORAGE_KEY]) return;
    callback(changes[STORAGE_KEY].newValue as AppData);
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
