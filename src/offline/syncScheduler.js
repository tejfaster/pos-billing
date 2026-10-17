import { dbPromise } from "./db";
import { syncCatalogue } from "./syncManager";

const AUTOMATIC_SYNC_TIMES = [
  "10:00",
  "14:00",
  "19:00",
];

const AUTOMATIC_SYNC_KEY = "automaticSync";

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

  return (
    now.getHours() * 60 +
    now.getMinutes()
  );
}

function timeToMinutes(time) {
  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;
}

async function getAutomaticSyncState() {
  const db = await dbPromise;

  const record = await db.get(
    "syncMetadata",
    AUTOMATIC_SYNC_KEY
  );

  const today = getToday();

  if (
    !record?.value ||
    record.value.date !== today
  ) {
    return {
      date: today,
      attemptedSlots: [],
    };
  }

  return {
    date: today,
    attemptedSlots:
      record.value.attemptedSlots || [],
  };
}

async function saveAutomaticSyncState(
  state
) {
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

  const state =
    await getAutomaticSyncState();

  const currentMinutes =
    getCurrentMinutes();

  const dueSlots =
    AUTOMATIC_SYNC_TIMES.filter(
      (time) =>
        timeToMinutes(time) <=
          currentMinutes &&
        !state.attemptedSlots.includes(time)
    );

  if (dueSlots.length === 0) {
    return {
      synced: false,
      reason: "no-sync-due",
    };
  }

  /*
   * If the app was closed during one or more
   * scheduled times, only process the latest
   * missed slot.
   *
   * The earlier missed slots are also marked
   * as attempted so they cannot create extra
   * backend requests later.
   */
  const slot =
    dueSlots[dueSlots.length - 1];

  const attemptedSlots = [
    ...new Set([
      ...state.attemptedSlots,
      ...dueSlots,
    ]),
  ];

  await saveAutomaticSyncState({
    date: getToday(),
    attemptedSlots,
  });

  try {
    const result =
      await syncCatalogue();

    return {
      synced: true,
      slot,
      result,
    };
  } catch (error) {
    console.error(
      "Automatic sync failed:",
      error
    );

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

  // Check once every minute while the app
  // is open.
  const intervalId = window.setInterval(
    check,
    60 * 1000
  );

  return () => {
    window.clearInterval(intervalId);
  };
}