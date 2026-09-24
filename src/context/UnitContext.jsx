import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const UnitContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

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

  const fetchUnits = useCallback(
    async ({ status = "active" } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (status) {
          params.set("status", status);
        }

        const queryString = params.toString();

        const response = await fetch(
          `${API_URL}/units${
            queryString
              ? `?${queryString}`
              : ""
          }`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch units."
          );
        }

        /*
         * Backend may return:
         *
         * []
         *
         * or
         *
         * { data: [] }
         *
         * or
         *
         * { units: [] }
         */
        const unitList = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.units)
          ? result.units
          : [];

        const normalizedUnits =
          unitList.map(normalizeUnit);

        setUnits(normalizedUnits);

        return normalizedUnits;
      } catch (err) {
        console.error(
          "Fetch units error:",
          err
        );

        setError(
          err?.message ||
            "Failed to fetch units."
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const getUnit = useCallback(
    (id) => {
      return (
        units.find(
          (unit) =>
            String(unit.id) === String(id)
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