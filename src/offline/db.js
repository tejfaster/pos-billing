import { openDB } from "idb";

const DB_NAME = "pos-offline";
const DB_VERSION = 2;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // -----------------------------
    // Products
    // -----------------------------
    if (!db.objectStoreNames.contains("products")) {
      const store = db.createObjectStore("products", {
        keyPath: "id",
      });

      store.createIndex(
        "category_id",
        "category_id"
      );

      store.createIndex(
        "status",
        "status"
      );

      store.createIndex(
        "updated_at",
        "updated_at"
      );
    }

    // -----------------------------
    // Categories
    // -----------------------------
    if (!db.objectStoreNames.contains("categories")) {
      const store = db.createObjectStore(
        "categories",
        {
          keyPath: "id",
        }
      );

      store.createIndex(
        "status",
        "status"
      );

      store.createIndex(
        "updated_at",
        "updated_at"
      );
    }

    // -----------------------------
    // Units
    // -----------------------------
    if (!db.objectStoreNames.contains("units")) {
      const store = db.createObjectStore(
        "units",
        {
          keyPath: "id",
        }
      );

      store.createIndex(
        "status",
        "status"
      );

      store.createIndex(
        "updated_at",
        "updated_at"
      );
    }

    // -----------------------------
    // Pending Sales
    // -----------------------------
    if (!db.objectStoreNames.contains("pendingSales")) {
      const store = db.createObjectStore(
        "pendingSales",
        {
          keyPath: "localId",
        }
      );

      store.createIndex(
        "status",
        "status"
      );

      store.createIndex(
        "createdAt",
        "createdAt"
      );
    }

    // -----------------------------
    // Pending Operations
    // -----------------------------
    if (!db.objectStoreNames.contains("pendingOperations")) {
      const store = db.createObjectStore(
        "pendingOperations",
        {
          keyPath: "localId",
        }
      );

      store.createIndex(
        "status",
        "status"
      );

      store.createIndex(
        "createdAt",
        "createdAt"
      );
    }

    // -----------------------------
    // Sync Metadata
    // -----------------------------
    if (!db.objectStoreNames.contains("syncMetadata")) {
      db.createObjectStore(
        "syncMetadata",
        {
          keyPath: "key",
        }
      );
    }

    // -----------------------------
    // Bill History
    // -----------------------------
    if (!db.objectStoreNames.contains("bills")) {
      const store = db.createObjectStore(
        "bills",
        {
          keyPath: "localId",
        }
      );

      store.createIndex(
        "billNumber",
        "billNumber"
      );

      store.createIndex(
        "userId",
        "userId"
      );

      store.createIndex(
        "createdAt",
        "createdAt"
      );

      store.createIndex(
        "syncStatus",
        "syncStatus"
      );
    }

    // -----------------------------
    // Bill Counters
    // -----------------------------
    if (!db.objectStoreNames.contains("billCounters")) {
      db.createObjectStore(
        "billCounters",
        {
          keyPath: "userId",
        }
      );
    }
  },
});