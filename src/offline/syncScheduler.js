import { dbPromise } from "./db";
import { syncCatalogue } from "./syncManager";

const AUTOMATIC_SYNC_TIMES = [
  "10:00",
  "14:00",
  "19:00",
];

const AUTOMATIC_SYNC_KEY = "automaticSync";
const RETRY_AFTER_MS = 5 * 60 * 1000;

let lastFailureAt = 0;

function getToday() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function getCurrentMinutes() {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

async function getAutomaticSyncState() {
  const db = await dbPromise;

  const record = await db.get("syncMetadata", AUTOMATIC_SYNC_KEY);

  const today = getToday();

  if (!record?.value || record.value.date !== today) {
    return {
      date: today,
      attemptedSlots: [],
    };
  }

  return {
    date: today,
    attemptedSlots: record.value.attemptedSlots || [],
  };
}

async function saveAutomaticSyncState(state) {
  const db = await dbPromise;

  await db.put("syncMetadata", {
    key: AUTOMATIC_SYNC_KEY,
    value: state,
    updatedAt: new Date().toISOString(),
  });
}

export async function runDueAutomaticSync() {
  if (!navigator.onLine) {
    return {
      synced: false,
      reason: "offline",
    };
  }

  if (Date.now() - lastFailureAt < RETRY_AFTER_MS) {
    return {
      synced: false,
      reason: "cooling-down",
    };
  }

  const state = await getAutomaticSyncState();

  const currentMinutes = getCurrentMinutes();

  const dueSlots = AUTOMATIC_SYNC_TIMES.filter(
    (time) =>
      timeToMinutes(time) <= currentMinutes &&
      !state.attemptedSlots.includes(time)
  );

  if (dueSlots.length === 0) {
    return {
      synced: false,
      reason: "no-sync-due",
    };
  }

  /*
   * If the app was closed during one or more scheduled times,
   * only process the latest missed slot. Earlier missed slots are
   * marked as done after a successful sync so they cannot create
   * extra backend requests later.
   */
  const slot = dueSlots[dueSlots.length - 1];

  try {
    const result = await syncCatalogue();

    await saveAutomaticSyncState({
      date: getToday(),
      attemptedSlots: [
        ...new Set([...state.attemptedSlots, ...dueSlots]),
      ],
    });

    return {
      synced: true,
      slot,
      result,
    };
  } catch (error) {
    // The slot stays due, so it retries after the cooldown.
    lastFailureAt = Date.now();

    console.error("Automatic sync failed:", error);

    return {
      synced: false,
      reason: "sync-failed",
      slot,
      error,
    };
  }
}

export function startAutomaticSyncScheduler() {
  let running = false;

  const check = async () => {
    if (running) {
      return;
    }

    running = true;

    try {
      await runDueAutomaticSync();
    } finally {
      running = false;
    }
  };

  // Check immediately when the app starts.
  check();

  // Check once every minute while the app is open.
  const intervalId = window.setInterval(check, 60 * 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}