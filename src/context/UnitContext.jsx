import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getUnits,
  getLocalUnit,
  saveLocalUnit,
  savePendingOperation,
  getPendingOperations,
  updatePendingOperation,
} from "../offline/offlineStorage";

import { syncSoon } from "../offline/syncManager";

const UnitContext = createContext(null);

const normalizeUnit = (unit) => ({
  id: unit.id,
  nameEn: unit.name_en ?? unit.nameEn ?? "",
  nameHi: unit.name_hi ?? unit.nameHi ?? "",
  shortName: unit.short_name ?? unit.shortName ?? "",
  type: unit.type ?? "",
  status: unit.status ?? "active",
  createdAt: unit.created_at ?? unit.createdAt ?? null,
  updatedAt: unit.updated_at ?? unit.updatedAt ?? null,
});

function createLocalId() {
  if (globalThis.crypto?.randomUUID) {
    return `local-${globalThis.crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

async function queueUnitOperation({ action, recordId, payload }) {
  return savePendingOperation({
    localId: createLocalId(),
    storeName: "units",
    action,
    recordId,
    payload,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}

async function findPendingCreate(recordId) {
  const operations = await getPendingOperations();

  return operations.find(
    (operation) =>
      operation.storeName === "units" &&
      String(operation.recordId) === String(recordId) &&
      operation.action === "create" &&
      operation.status === "pending"
  );
}

export function UnitProvider({ children }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();

  const fetchUnits = useCallback(async ({ status = "active" } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const records = await getUnits();
      const normalized = records.map(normalizeUnit);

      const filtered = status
        ? normalized.filter((unit) => unit.status === status)
        : normalized;

      setUnits(filtered);
      return filtered;
    } catch (err) {
      console.error("Load local units error:", err);
      setError(err?.message || "Failed to load units.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from IndexedDB after login, and reload after every sync.
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return undefined;
    }

    fetchUnits();

    const reload = () => {
      fetchUnits();
    };

    window.addEventListener("catalogue:synced", reload);

    return () => {
      window.removeEventListener("catalogue:synced", reload);
    };
  }, [authLoading, isAuthenticated, fetchUnits]);

  const getUnit = useCallback(
    (id) =>
      units.find((unit) => String(unit.id) === String(id)) || null,
    [units]
  );

  const addUnit = useCallback(async (unitData) => {
    setError(null);

    const nameEn = String(
      unitData.nameEn ?? unitData.name_en ?? ""
    ).trim();

    const shortName = String(
      unitData.shortName ?? unitData.short_name ?? ""
    ).trim();

    const type = String(unitData.type ?? "").trim();

    if (!nameEn || !shortName || !type) {
      throw new Error(
        "Unit name, short name, and type are required."
      );
    }

    const now = new Date().toISOString();

    const unit = normalizeUnit({
      id: createLocalId(),
      nameEn,
      nameHi: unitData.nameHi ?? unitData.name_hi ?? "",
      shortName,
      type,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    await saveLocalUnit(unit);

    await queueUnitOperation({
      action: "create",
      recordId: unit.id,
      payload: {
        nameEn: unit.nameEn,
        nameHi: unit.nameHi || null,
        shortName: unit.shortName,
        type: unit.type,
      },
    });

    setUnits((current) => [...current, unit]);

    syncSoon();

    return unit;
  }, []);

  const updateUnit = useCallback(async (id, unitData) => {
    setError(null);

    const stored = await getLocalUnit(id);

    if (!stored) {
      throw new Error("Unit not found locally.");
    }

    const current = normalizeUnit(stored);

    const updated = normalizeUnit({
      ...current,
      ...unitData,
      id: current.id,
      updatedAt: new Date().toISOString(),
    });

    if (!updated.nameEn || !updated.shortName || !updated.type) {
      throw new Error(
        "Unit name, short name, and type are required."
      );
    }

    const payload = {};

    if (unitData.nameEn !== undefined) {
      payload.nameEn = updated.nameEn;
    }
    if (unitData.nameHi !== undefined) {
      payload.nameHi = updated.nameHi || null;
    }
    if (unitData.shortName !== undefined) {
      payload.shortName = updated.shortName;
    }
    if (unitData.type !== undefined) {
      payload.type = updated.type;
    }
    if (unitData.status !== undefined) {
      payload.status = updated.status;
    }

    await saveLocalUnit(updated);

    const pendingCreate = await findPendingCreate(id);

    if (pendingCreate) {
      await updatePendingOperation({
        ...pendingCreate,
        payload: {
          ...pendingCreate.payload,
          nameEn: updated.nameEn,
          nameHi: updated.nameHi || null,
          shortName: updated.shortName,
          type: updated.type,
        },
      });
    } else {
      await queueUnitOperation({
        action: "update",
        recordId: id,
        payload,
      });
    }

    setUnits((currentUnits) => {
      if (updated.status !== "active") {
        return currentUnits.filter(
          (unit) => String(unit.id) !== String(id)
        );
      }

      const exists = currentUnits.some(
        (unit) => String(unit.id) === String(id)
      );

      return exists
        ? currentUnits.map((unit) =>
            String(unit.id) === String(id) ? updated : unit
          )
        : [...currentUnits, updated];
    });

    syncSoon();

    return updated;
  }, []);

  const removeUnit = useCallback(async (id) => {
    setError(null);

    const stored = await getLocalUnit(id);

    if (!stored) {
      throw new Error("Unit not found locally.");
    }

    const current = normalizeUnit(stored);

    const inactive = {
      ...current,
      status: "inactive",
      updatedAt: new Date().toISOString(),
    };

    await saveLocalUnit(inactive);

    await queueUnitOperation({
      action: "deactivate",
      recordId: id,
      payload: {},
    });

    setUnits((currentUnits) =>
      currentUnits.filter(
        (unit) => String(unit.id) !== String(id)
      )
    );

    syncSoon();

    return inactive;
  }, []);

  const value = useMemo(
    () => ({
      units,
      loading,
      error,
      fetchUnits,
      getUnit,
      addUnit,
      updateUnit,
      removeUnit,
    }),
    [
      units,
      loading,
      error,
      fetchUnits,
      getUnit,
      addUnit,
      updateUnit,
      removeUnit,
    ]
  );

  return (
    <UnitContext.Provider value={value}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error(
      "useUnits must be used inside UnitProvider"
    );
  }

  return context;
}