import { saveCatalogue } from "./offlineStorage";
import { dbPromise } from "./db";

const API_URL = import.meta.env.VITE_API_URL;

const LAST_SYNC_KEY = "catalogue:lastSync";

async function saveLastSync(syncData) {
  const db = await dbPromise;

  await db.put("syncMetadata", {
    key: LAST_SYNC_KEY,
    value: syncData,
    updatedAt: new Date().toISOString(),
  });
}

export async function getLastSync() {
  const db = await dbPromise;

  const record = await db.get(
    "syncMetadata",
    LAST_SYNC_KEY
  );

  return record?.value ?? null;
}

export async function syncCatalogue() {
  if (!navigator.onLine) {
    throw new Error("No internet connection.");
  }

  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is not configured."
    );
  }

  const response = await fetch(`${API_URL}/sync`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Sync failed with status ${response.status}.`
    );
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Invalid sync response.");
  }

  const {
    categories = [],
    units = [],
    products = [],
    syncedAt,
  } = result.data;

  await saveCatalogue({
    categories,
    units,
    products,
  });

  const syncData = {
    syncedAt:
      syncedAt || new Date().toISOString(),
    categories: categories.length,
    units: units.length,
    products: products.length,
  };

  await saveLastSync(syncData);

  return syncData;
}