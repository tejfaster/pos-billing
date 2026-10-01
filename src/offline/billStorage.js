import { dbPromise } from "./db";

const CURRENT_BILL_KEY = "current";

export async function saveCurrentBill(bill) {
  const db = await dbPromise;

  await db.put("syncMetadata", {
    key: `currentBill:${CURRENT_BILL_KEY}`,
    value: bill,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCurrentBill() {
  const db = await dbPromise;

  const record = await db.get(
    "syncMetadata",
    `currentBill:${CURRENT_BILL_KEY}`
  );

  return record?.value ?? null;
}

export async function clearCurrentBill() {
  const db = await dbPromise;

  await db.delete(
    "syncMetadata",
    `currentBill:${CURRENT_BILL_KEY}`
  );
}

// ---------------------------------
// Bill History
// ---------------------------------

export async function saveBill(bill) {
  const db = await dbPromise;

  await db.put("bills", bill);

  return bill;
}

export async function getBill(localId) {
  const db = await dbPromise;

  return db.get("bills", localId);
}

export async function getBills() {
  const db = await dbPromise;

  return db.getAll("bills");
}

export async function getBillsByUser(userId) {
  const db = await dbPromise;

  return db.getAllFromIndex(
    "bills",
    "userId",
    userId
  );
}

export async function deleteBill(localId) {
  const db = await dbPromise;

  await db.delete("bills", localId);
}

// ---------------------------------
// Bill Counter
// ---------------------------------

export async function getBillCounter(userId) {
  const db = await dbPromise;

  return db.get(
    "billCounters",
    userId
  );
}

export async function saveBillCounter(counter) {
  const db = await dbPromise;

  await db.put(
    "billCounters",
    counter
  );

  return counter;
}