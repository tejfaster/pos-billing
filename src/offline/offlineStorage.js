
import { dbPromise } from "./db";

// ---------------------------------
// Generic Store Helpers
// ---------------------------------

async function replaceStore(storeName, records) {
  const db = await dbPromise;

  const tx = db.transaction(storeName, "readwrite");

  await tx.store.clear();

  for (const record of records) {
    await tx.store.put(record);
  }

  await tx.done;
}

async function getAllFromStore(storeName) {
  const db = await dbPromise;
  return db.getAll(storeName);
}

// ---------------------------------
// Safe Catalogue Synchronization
// ---------------------------------

const CATALOGUE_STORES = [
  "products",
  "categories",
  "units",
];

/**
 * A queued operation should use this structure:
 *
 * {
 *   localId: "operation-unique-id",
 *   storeName: "products" | "categories" | "units",
 *   action: "create" | "update" | "deactivate",
 *   recordId: "local-or-server-record-id",
 *   payload: {},
 *   status: "pending",
 *   createdAt: ISO timestamp,
 *   updatedAt: ISO timestamp
 * }
 *
 * Queue entries are removed only after successful processing.
 */

async function mergeCatalogueStore(
  store,
  incomingRecords,
  pendingOperations
) {
  const currentRecords = await store.getAll();

  // Preserve local records referenced by pending operations.
  const protectedIds = new Set(
    pendingOperations
      .filter(
        (operation) =>
          operation.storeName === store.name
      )
      .map((operation) => String(operation.recordId))
  );

  const protectedRecords = currentRecords.filter(
    (record) => protectedIds.has(String(record.id))
  );

  // Start with the latest backend catalogue.
  const merged = new Map();

  for (const record of incomingRecords) {
    merged.set(String(record.id), record);
  }

  // Local pending changes take precedence until synced.
  for (const record of protectedRecords) {
    merged.set(String(record.id), record);
  }

  await store.clear();

  for (const record of merged.values()) {
    await store.put(record);
  }
}

/**
 * Replace the catalogue with the backend snapshot while
 * preserving records that have unsynchronized operations.
 *
 * All catalogue stores are updated in one transaction.
 */
export async function saveCatalogue({
  products = [],
  categories = [],
  units = [],
}) {
  const db = await dbPromise;

  const tx = db.transaction(
    [
      ...CATALOGUE_STORES,
      "pendingOperations",
    ],
    "readwrite"
  );

  try {
    const pendingOperations =
      await tx.objectStore("pendingOperations").getAll();

    await mergeCatalogueStore(
      tx.objectStore("products"),
      products,
      pendingOperations
    );

    await mergeCatalogueStore(
      tx.objectStore("categories"),
      categories,
      pendingOperations
    );

    await mergeCatalogueStore(
      tx.objectStore("units"),
      units,
      pendingOperations
    );

    await tx.done;
  } catch (error) {
    try {
      tx.abort();
    } catch {
      // The transaction may already have completed or aborted.
    }

    throw error;
  }
}

// ---------------------------------
// Catalogue Storage
// ---------------------------------

// These direct replacement helpers remain available for
// existing callers. Sync should use saveCatalogue() instead.

export async function saveProducts(products) {
  await replaceStore("products", products);
}

export async function saveCategories(categories) {
  await replaceStore("categories", categories);
}

export async function saveUnits(units) {
  await replaceStore("units", units);
}

// ---------------------------------
// Catalogue Reads
// ---------------------------------

export async function getProducts() {
  return getAllFromStore("products");
}

export async function getCategories() {
  return getAllFromStore("categories");
}

export async function getUnits() {
  return getAllFromStore("units");
}

// ---------------------------------
// Catalogue Clear
// ---------------------------------

export async function clearCatalogue() {
  const db = await dbPromise;

  const tx = db.transaction(
    CATALOGUE_STORES,
    "readwrite"
  );

  for (const storeName of CATALOGUE_STORES) {
    await tx.objectStore(storeName).clear();
  }

  await tx.done;
}

// ---------------------------------
// Single Product Storage
// ---------------------------------

export async function saveLocalProduct(product) {
  const db = await dbPromise;
  await db.put("products", product);
  return product;
}

export async function getLocalProduct(id) {
  const db = await dbPromise;
  return db.get("products", id);
}

export async function deleteLocalProduct(id) {
  const db = await dbPromise;
  await db.delete("products", id);
}

// ---------------------------------
// Single Category Storage
// ---------------------------------

export async function saveLocalCategory(category) {
  const db = await dbPromise;
  await db.put("categories", category);
  return category;
}

export async function getLocalCategory(id) {
  const db = await dbPromise;
  return db.get("categories", id);
}

export async function deleteLocalCategory(id) {
  const db = await dbPromise;
  await db.delete("categories", id);
}

// ---------------------------------
// Single Unit Storage
// ---------------------------------

export async function saveLocalUnit(unit) {
  const db = await dbPromise;
  await db.put("units", unit);
  return unit;
}

export async function getLocalUnit(id) {
  const db = await dbPromise;
  return db.get("units", id);
}

export async function deleteLocalUnit(id) {
  const db = await dbPromise;
  await db.delete("units", id);
}

// ---------------------------------
// Pending Operations
// ---------------------------------

export async function savePendingOperation(operation) {
  if (!operation?.localId) {
    throw new Error(
      "A pending operation requires a unique localId."
    );
  }

  if (
    !CATALOGUE_STORES.includes(operation.storeName)
  ) {
    throw new Error(
      "A pending operation requires a valid catalogue storeName."
    );
  }

  if (operation.recordId === undefined ||
      operation.recordId === null) {
    throw new Error(
      "A pending operation requires a recordId."
    );
  }

  const now = new Date().toISOString();

  const normalizedOperation = {
    ...operation,
    status: operation.status || "pending",
    createdAt: operation.createdAt || now,
    updatedAt: now,
  };

  const db = await dbPromise;

  await db.put(
    "pendingOperations",
    normalizedOperation
  );

  return normalizedOperation;
}

export async function getPendingOperations() {
  const operations = await getAllFromStore(
    "pendingOperations"
  );

  return operations.sort((a, b) =>
    String(a.createdAt || "").localeCompare(
      String(b.createdAt || "")
    )
  );
}

export async function getPendingOperation(localId) {
  const db = await dbPromise;

  return db.get("pendingOperations", localId);
}

export async function updatePendingOperation(operation) {
  if (!operation?.localId) {
    throw new Error(
      "Cannot update an operation without localId."
    );
  }

  const db = await dbPromise;

  const existing = await db.get(
    "pendingOperations",
    operation.localId
  );

  if (!existing) {
    throw new Error(
      "Pending operation was not found."
    );
  }

  const updatedOperation = {
    ...existing,
    ...operation,
    updatedAt: new Date().toISOString(),
  };

  await db.put(
    "pendingOperations",
    updatedOperation
  );

  return updatedOperation;
}

export async function deletePendingOperation(localId) {
  const db = await dbPromise;

  await db.delete(
    "pendingOperations",
    localId
  );
}

// ---------------------------------
// Pending Sales
// ---------------------------------

// Local-only sales storage is retained for compatibility.
// This data must not be uploaded by catalogue synchronization.

export async function savePendingSale(sale) {
  const db = await dbPromise;
  await db.put("pendingSales", sale);
}

export async function getPendingSales() {
  return getAllFromStore("pendingSales");
}

export async function getPendingSale(localId) {
  const db = await dbPromise;

  return db.get(
    "pendingSales",
    localId
  );
}

export async function updatePendingSale(sale) {
  const db = await dbPromise;
  await db.put("pendingSales", sale);
}

export async function deletePendingSale(localId) {
  const db = await dbPromise;

  await db.delete(
    "pendingSales",
    localId
  );
}

export async function clearPendingSales() {
  const db = await dbPromise;

  await db.clear("pendingSales");
}
