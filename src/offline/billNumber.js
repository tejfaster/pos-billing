import {
  getBillCounter,
  saveBillCounter,
} from "./billStorage";

const BILL_NUMBER_LENGTH = 6;

function getBusinessDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function generateBillNumber({
  userId,
  prefix,
}) {
  if (!userId) {
    throw new Error(
      "User ID is required to generate a bill number."
    );
  }

  if (!prefix) {
    throw new Error(
      "User bill prefix is required."
    );
  }

  const normalizedPrefix = String(prefix)
    .trim()
    .toUpperCase();

  const today = getBusinessDate();

  const existingCounter = await getBillCounter(userId);

  const nextNumber =
    existingCounter?.date === today
      ? existingCounter.nextNumber
      : 1;

  const billNumber = `${normalizedPrefix}-${String(
    nextNumber
  ).padStart(BILL_NUMBER_LENGTH, "0")}`;

  await saveBillCounter({
    userId,
    prefix: normalizedPrefix,
    date: today,
    nextNumber: nextNumber + 1,
    updatedAt: new Date().toISOString(),
  });

  return {
    billNumber,
    sequenceNumber: nextNumber,
    userId,
    prefix: normalizedPrefix,
    date: today,
  };
}