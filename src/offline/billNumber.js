import { dbPromise } from "./db";

const BILL_NUMBER_LENGTH = 6;

function getBusinessDate() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export async function generateBillNumber({ userId, prefix }) {
  if (!userId) {
    throw new Error("User ID is required to generate a bill number.");
  }

  if (!prefix) {
    throw new Error("User bill prefix is required.");
  }

  const normalizedPrefix = String(prefix).trim().toUpperCase();
  const today = getBusinessDate();

  const db = await dbPromise;

  // Read and write in one transaction so two rapid calls
  // cannot receive the same number.
  const tx = db.transaction("billCounters", "readwrite");

  const existingCounter = await tx.store.get(userId);

  const nextNumber =
    existingCounter?.date === today ? existingCounter.nextNumber : 1;

  await tx.store.put({
    userId,
    prefix: normalizedPrefix,
    date: today,
    nextNumber: nextNumber + 1,
    updatedAt: new Date().toISOString(),
  });

  await tx.done;

  const billNumber = `${normalizedPrefix}-${String(nextNumber).padStart(
    BILL_NUMBER_LENGTH,
    "0"
  )}`;

  return {
    billNumber,
    sequenceNumber: nextNumber,
    userId,
    prefix: normalizedPrefix,
    date: today,
  };
}