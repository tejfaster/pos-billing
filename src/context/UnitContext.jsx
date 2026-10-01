import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import { getUnits } from "../offline/offlineStorage";

const UnitContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const normalizeUnit = (unit) => ({
  id: unit.id,

  nameEn:
    unit.name_en ??
    unit.nameEn ??
    "",

  nameHi:
    unit.name_hi ??
    unit.nameHi ??
    "",

  shortName:
    unit.short_name ??
    unit.shortName ??
    "",

  type:
    unit.type ??
    "",

  status:
    unit.status ??
    "active",
});

export function UnitProvider({ children }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();

  const loadLocalUnits = useCallback(
    async ({ status = "active" } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const localUnits =
          await getUnits();

        const normalizedUnits =
          localUnits.map(normalizeUnit);

        const filteredUnits = status
          ? normalizedUnits.filter(
              (unit) =>
                unit.status === status
            )
          : normalizedUnits;

        setUnits(filteredUnits);

        return filteredUnits;
      } catch (err) {
        console.error(
          "Load local units error:",
          err
        );

        setError(
          err?.message ||
            "Failed to load units."
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUnits = useCallback(
    async ({ status = "active" } = {}) => {
      return loadLocalUnits({
        status,
      });
    },
    [loadLocalUnits]
  );

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated
    ) {
      return;
    }

    loadLocalUnits();
  }, [
    authLoading,
    isAuthenticated,
    loadLocalUnits,
  ]);

  const getUnit = useCallback(
    (id) => {
      return (
        units.find(
          (unit) =>
            String(unit.id) ===
            String(id)
        ) || null
      );
    },
    [units]
  );

  const value = useMemo(
    () => ({
      units,
      loading,
      error,
      fetchUnits,
      getUnit,
    }),
    [
      units,
      loading,
      error,
      fetchUnits,
      getUnit,
    ]
  );

  return (
    <UnitContext.Provider
      value={value}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context =
    useContext(UnitContext);

  if (!context) {
    throw new Error(
      "useUnits must be used inside UnitProvider"
    );
  }

  return context;
}