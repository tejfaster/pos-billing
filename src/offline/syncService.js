import {
  getLastSync,
  syncCatalogue,
} from "./syncManager";

export async function syncNow() {
  return syncCatalogue();
}

export async function getSyncStatus() {
  const lastSync = await getLastSync();

  return {
    lastSync,
    hasSynced: Boolean(lastSync),
  };
}