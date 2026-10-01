import { dbPromise } from "./db";

// ---------------------------------
// Generic Store Helpers
// ---------------------------------

async function replaceStore(storeName, records) {
  const db = await dbPromise;

  const tx = db.transaction(
    storeName,
    "readwrite"
  );

  await tx.store.clear();

  for (const record of records) {
    await tx.store.put(record);
  }

  await tx.done;
}

// ---------------------------------
// Catalogue Storage
// ---------------------------------

export async function saveProducts(products) {
  await replaceStore(
    "products",
    products
  );
}

export async function saveCategories(
  categories
) {
  await replaceStore(
    "categories",
    categories
  );
}

export async function saveUnits(units) {
  await replaceStore(
    "units",
    units
  );
}

export async function saveCatalogue({
  products = [],
  categories = [],
  units = [],
}) {
  await saveProducts(products);
  await saveCategories(categories);
  await saveUnits(units);
}

// ---------------------------------
// Catalogue Reads
// ---------------------------------

export async function getProducts() {
  const db = await dbPromise;

  return db.getAll("products");
}

export async function getCategories() {
  const db = await dbPromise;

  return db.getAll("categories");
}

export async function getUnits() {
  const db = await dbPromise;

  return db.getAll("units");
}

// ---------------------------------
// Catalogue Clear
// ---------------------------------

export async function clearCatalogue() {
  const db = await dbPromise;

  const tx = db.transaction(
    [
      "products",
      "categories",
      "units",
    ],
    "readwrite"
  );

  await tx.objectStore(
    "products"
  ).clear();

  await tx.objectStore(
    "categories"
  ).clear();

  await tx.objectStore(
    "units"
  ).clear();

  await tx.done;
}

// ---------------------------------
// Pending Sales
// ---------------------------------

export async function savePendingSale(
  sale
) {
  const db = await dbPromise;

  await db.put(
    "pendingSales",
    sale
  );
}

export async function getPendingSales() {
  const db = await dbPromise;

  return db.getAll(
    "pendingSales"
  );
}

export async function getPendingSale(
  localId
) {
  const db = await dbPromise;

  return db.get(
    "pendingSales",
    localId
  );
}

export async function updatePendingSale(
  sale
) {
  const db = await dbPromise;

  await db.put(
    "pendingSales",
    sale
  );
}

export async function deletePendingSale(
  localId
) {
  const db = await dbPromise;

  await db.delete(
    "pendingSales",
    localId
  );
}

export async function clearPendingSales() {
  const db = await dbPromise;

  await db.clear(
    "pendingSales"
  );
}