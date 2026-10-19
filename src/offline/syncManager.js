import {
  saveCatalogue,
  getPendingOperations,
  updatePendingOperation,
  deletePendingOperation,
  getLocalProduct,
  saveLocalProduct,
  deleteLocalProduct,
  getLocalCategory,
  saveLocalCategory,
  deleteLocalCategory,
  getLocalUnit,
  saveLocalUnit,
  deleteLocalUnit,
} from "./offlineStorage";

import { dbPromise } from "./db";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const LAST_SYNC_KEY = "catalogue:lastSync";
const ID_MAP_KEY = "catalogue:idMap";

const STORE_CONFIG = {
  categories: {
    endpoint: "/categories",
    getLocal: getLocalCategory,
    saveLocal: saveLocalCategory,
    deleteLocal: deleteLocalCategory,
  },
  units: {
    endpoint: "/units",
    getLocal: getLocalUnit,
    saveLocal: saveLocalUnit,
    deleteLocal: deleteLocalUnit,
  },
  products: {
    endpoint: "/products",
    getLocal: getLocalProduct,
    saveLocal: saveLocalProduct,
    deleteLocal: deleteLocalProduct,
  },
};

class DependencyPendingError extends Error {
  constructor(message) {
    super(message);
    this.name = "DependencyPendingError";
  }
}

function isTemporaryId(id) {
  return typeof id === "string" && id.startsWith("local-");
}

function recordKey(storeName, recordId) {
  return `${storeName}:${String(recordId)}`;
}

function operationPriority(operation) {
  const priorities = {
    "categories:create": 1,
    "units:create": 2,
    "products:create": 3,
    "categories:update": 4,
    "units:update": 5,
    "products:update": 6,
    "products:deactivate": 7,
    "categories:deactivate": 8,
    "units:deactivate": 9,
  };

  return (
    priorities[`${operation.storeName}:${operation.action}`] ??
    99
  );
}

function sortOperations(operations) {
  return [...operations].sort((a, b) => {
    const priorityDifference =
      operationPriority(a) - operationPriority(b);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime()
    );
  });
}

async function getMetadata(key) {
  const db = await dbPromise;
  const record = await db.get("syncMetadata", key);
  return record?.value ?? null;
}

async function setMetadata(key, value) {
  const db = await dbPromise;

  await db.put("syncMetadata", {
    key,
    value,
    updatedAt: new Date().toISOString(),
  });
}

async function getIdMap() {
  return (await getMetadata(ID_MAP_KEY)) || {};
}

async function saveIdMapping(localId, serverId) {
  const mappings = await getIdMap();

  mappings[String(localId)] = serverId;

  await setMetadata(ID_MAP_KEY, mappings);

  return mappings;
}

function resolveId(id, mappings) {
  if (id === null || id === undefined || id === "") {
    return id;
  }

  const mapped = mappings[String(id)];

  if (mapped !== undefined && mapped !== null) {
    return mapped;
  }

  return id;
}

function resolveReference(id, mappings, fieldName) {
  if (id === null || id === undefined || id === "") {
    return id;
  }

  const resolved = resolveId(id, mappings);

  if (isTemporaryId(resolved)) {
    throw new DependencyPendingError(
      `${fieldName} is waiting for its record to sync.`
    );
  }

  return resolved;
}

function resolvePayload(storeName, payload, mappings) {
  const resolved = { ...(payload || {}) };

  if (storeName === "products") {
    if ("categoryId" in resolved) {
      resolved.categoryId = resolveReference(
        resolved.categoryId,
        mappings,
        "Category"
      );
    }

    if ("category_id" in resolved) {
      resolved.category_id = resolveReference(
        resolved.category_id,
        mappings,
        "Category"
      );
    }

    if ("unitId" in resolved) {
      resolved.unitId = resolveReference(
        resolved.unitId,
        mappings,
        "Unit"
      );
    }

    if ("unit_id" in resolved) {
      resolved.unit_id = resolveReference(
        resolved.unit_id,
        mappings,
        "Unit"
      );
    }
  }

  return resolved;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let result;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const error = new Error(
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}.`
    );

    error.status = response.status;

    throw error;
  }

  if (result?.success === false) {
    throw new Error(
      result.message || result.error || "The server rejected the request."
    );
  }

  return result;
}

function extractRecord(result) {
  return result?.data ?? result?.record ?? result;
}

function assertValidStore(storeName) {
  const config = STORE_CONFIG[storeName];

  if (!config) {
    throw new Error(`Unsupported catalogue store: ${storeName}`);
  }

  return config;
}

async function saveServerRecord(storeName, serverRecord, localId) {
  const config = assertValidStore(storeName);

  if (!serverRecord || serverRecord.id === undefined) {
    throw new Error(
      `The server did not return an ID for ${storeName}.`
    );
  }

  let existingRecord = null;

  if (localId !== undefined && localId !== null) {
    existingRecord = await config.getLocal(localId);
  }

  const serverId = serverRecord.id;

  if (String(localId) !== String(serverId)) {
    const existingServerRecord = await config.getLocal(serverId);

    if (existingServerRecord) {
      existingRecord = {
        ...existingServerRecord,
        ...existingRecord,
      };
    }

    if (localId !== undefined && localId !== null) {
      await config.deleteLocal(localId);
    }
  }

  const mergedRecord = {
    ...(existingRecord || {}),
    ...serverRecord,
    id: serverId,
  };

  await config.saveLocal(mergedRecord);
}

async function moveRemainingOperationsToServerId(
  storeName,
  localId,
  serverId,
  currentOperationId
) {
  const operations = await getPendingOperations();

  for (const operation of operations) {
    if (operation.localId === currentOperationId) {
      continue;
    }

    if (
      operation.storeName === storeName &&
      String(operation.recordId) === String(localId)
    ) {
      await updatePendingOperation({
        ...operation,
        recordId: serverId,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

async function processCreate(operation, mappings) {
  const config = assertValidStore(operation.storeName);

  const payload = resolvePayload(
    operation.storeName,
    operation.payload,
    mappings
  );

  const result = await apiRequest(config.endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const serverRecord = extractRecord(result);

  if (
    !serverRecord ||
    serverRecord.id === undefined ||
    serverRecord.id === null
  ) {
    throw new Error(
      `Create request for ${operation.storeName} returned no server ID.`
    );
  }

  const localId = operation.recordId;
  const serverId = serverRecord.id;

  // Persist the mapping before moving local records or deleting the queue item.
  await saveIdMapping(localId, serverId);

  const remainingOperations = await getPendingOperations();

  const pendingDeactivate = remainingOperations.some(
    (item) =>
      item.localId !== operation.localId &&
      item.storeName === operation.storeName &&
      String(item.recordId) === String(localId) &&
      item.action === "deactivate"
  );

  await saveServerRecord(
    operation.storeName,
    serverRecord,
    localId
  );

  // Keep a locally deactivated record inactive until its queued
  // deactivation succeeds.
  if (pendingDeactivate) {
    const currentServerRecord = await config.getLocal(serverId);

    if (currentServerRecord) {
      await config.saveLocal({
        ...currentServerRecord,
        status: "inactive",
      });
    }
  }

  await moveRemainingOperationsToServerId(
    operation.storeName,
    localId,
    serverId,
    operation.localId
  );

  await deletePendingOperation(operation.localId);
}

async function processUpdate(operation, mappings) {
  const config = assertValidStore(operation.storeName);
  const serverId = resolveId(operation.recordId, mappings);

  if (isTemporaryId(serverId)) {
    throw new DependencyPendingError(
      `Cannot update ${operation.storeName} until its create operation succeeds.`
    );
  }

  const payload = resolvePayload(
    operation.storeName,
    operation.payload,
    mappings
  );

  const result = await apiRequest(
    `${config.endpoint}/${encodeURIComponent(serverId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  const serverRecord = extractRecord(result);

  if (serverRecord && serverRecord.id !== undefined) {
    await saveServerRecord(
      operation.storeName,
      serverRecord,
      serverId
    );
  }

  await deletePendingOperation(operation.localId);
}

async function processDeactivate(operation, mappings) {
  const config = assertValidStore(operation.storeName);
  const serverId = resolveId(operation.recordId, mappings);

  if (isTemporaryId(serverId)) {
    throw new DependencyPendingError(
      `Cannot deactivate ${operation.storeName} until its create operation succeeds.`
    );
  }

  const result = await apiRequest(
    `${config.endpoint}/${encodeURIComponent(serverId)}`,
    {
      method: "DELETE",
    }
  );

  const serverRecord = extractRecord(result);
  const existingRecord = await config.getLocal(serverId);

  if (existingRecord) {
    await config.saveLocal({
      ...existingRecord,
      ...(serverRecord && typeof serverRecord === "object"
        ? serverRecord
        : {}),
      id: serverId,
      status: "inactive",
    });
  }

  await deletePendingOperation(operation.localId);
}

async function processOperation(operation) {
  const mappings = await getIdMap();

  if (!STORE_CONFIG[operation.storeName]) {
    throw new Error(
      `Unsupported store "${operation.storeName}" in pending operation.`
    );
  }

  if (operation.action === "create") {
    await processCreate(operation, mappings);
    return;
  }

  if (operation.action === "update") {
    await processUpdate(operation, mappings);
    return;
  }

  if (operation.action === "deactivate") {
    await processDeactivate(operation, mappings);
    return;
  }

  throw new Error(
    `Unsupported operation "${operation.action}" for ${operation.storeName}.`
  );
}

async function markOperationPending(operation, error) {
  try {
    await updatePendingOperation({
      ...operation,
      status: "pending",
      lastError: error?.message || "Sync failed.",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // Preserve the original sync error if updating the queue also fails.
  }
}

async function uploadPendingOperations() {
  const operations = sortOperations(await getPendingOperations());
  const blockedRecords = new Set();

  let processedOperations = 0;
  let failedOperations = 0;

  for (const operation of operations) {
    const key = recordKey(
      operation.storeName,
      operation.recordId
    );

    if (blockedRecords.has(key)) {
      failedOperations += 1;

      await markOperationPending(
        operation,
        new DependencyPendingError(
          "An earlier operation for this record has not synced yet."
        )
      );

      continue;
    }

    try {
      await processOperation(operation);
      processedOperations += 1;
    } catch (error) {
      failedOperations += 1;
      blockedRecords.add(key);

      await markOperationPending(operation, error);
    }
  }

  return {
    processedOperations,
    failedOperations,
    pendingOperations: (await getPendingOperations()).length,
  };
}

export async function getLastSync() {
  return getMetadata(LAST_SYNC_KEY);
}

async function runSync() {
  if (!navigator.onLine) {
    throw new Error("No internet connection.");
  }

  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  // Upload local catalogue changes first, in dependency-aware order.
  const queueResult = await uploadPendingOperations();

  // Download the latest server catalogue even when some queued operations
  // fail. saveCatalogue preserves local records that still have queued work.
  const response = await apiRequest("/sync", {
    method: "GET",
  });

  const result = response;

  if (!result?.success || !result?.data) {
    throw new Error("Invalid catalogue sync response.");
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

  const remainingOperations = await getPendingOperations();

  const syncData = {
    syncedAt: syncedAt || new Date().toISOString(),
    categories: categories.length,
    units: units.length,
    products: products.length,
    processedOperations: queueResult.processedOperations,
    failedOperations: queueResult.failedOperations,
    pendingOperations: remainingOperations.length,
  };

  await setMetadata(LAST_SYNC_KEY, syncData);

  // Let the contexts reload from IndexedDB.
  window.dispatchEvent(new CustomEvent("catalogue:synced"));

  return syncData;
}

// Only one sync runs at a time. Callers that arrive while one is
// running receive the same result.
let inFlight = null;

export function syncCatalogue() {
  if (!inFlight) {
    inFlight = runSync().finally(() => {
      inFlight = null;
    });
  }

  return inFlight;
}