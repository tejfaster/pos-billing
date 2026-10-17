
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
  getCategories,
  getLocalCategory,
  saveLocalCategory,
  savePendingOperation,
  getPendingOperations,
  updatePendingOperation,
} from "../offline/offlineStorage";

const CategoryContext = createContext(null);

const normalizeCategory = (category) => ({
  id: category.id,
  nameEn: category.name_en ?? category.nameEn ?? "",
  nameHi: category.name_hi ?? category.nameHi ?? "",
  status: category.status ?? "active",
  createdAt: category.created_at ?? category.createdAt ?? null,
  updatedAt: category.updated_at ?? category.updatedAt ?? null,
});

function createLocalId() {
  if (globalThis.crypto?.randomUUID) {
    return `local-${globalThis.crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createOperationId() {
  return createLocalId();
}

async function queueCategoryOperation({
  action,
  recordId,
  payload,
}) {
  return savePendingOperation({
    localId: createOperationId(),
    storeName: "categories",
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
      operation.storeName === "categories" &&
      String(operation.recordId) === String(recordId) &&
      operation.action === "create" &&
      operation.status === "pending"
  );
}

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();

  const loadLocalCategories = useCallback(
    async ({ status = "active" } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const localCategories = await getCategories();

        const normalizedCategories =
          localCategories.map(normalizeCategory);

        const filteredCategories = status
          ? normalizedCategories.filter(
              (category) => category.status === status
            )
          : normalizedCategories;

        setCategories(filteredCategories);

        return filteredCategories;
      } catch (err) {
        console.error("Load local categories error:", err);

        setError(
          err?.message || "Failed to load categories."
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(
    async ({ status = "active" } = {}) => {
      return loadLocalCategories({ status });
    },
    [loadLocalCategories]
  );

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    loadLocalCategories();
  }, [
    authLoading,
    isAuthenticated,
    loadLocalCategories,
  ]);

  const getCategory = useCallback(
    (id) =>
      categories.find(
        (category) => String(category.id) === String(id)
      ) || null,
    [categories]
  );

  // Create locally first and queue it for synchronization.
  const addCategory = useCallback(
    async (categoryData) => {
      const nameEn = String(
        categoryData.nameEn ?? categoryData.name_en ?? ""
      ).trim();

      const nameHi = String(
        categoryData.nameHi ?? categoryData.name_hi ?? ""
      ).trim();

      if (!nameEn) {
        throw new Error("Category name is required.");
      }

      const now = new Date().toISOString();

      const category = {
        id: createLocalId(),
        nameEn,
        nameHi,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };

      // Save the local record before queuing its creation.
      await saveLocalCategory(category);

      try {
        await queueCategoryOperation({
          action: "create",
          recordId: category.id,
          payload: {
            nameEn: category.nameEn,
            nameHi: category.nameHi || null,
          },
        });
      } catch (err) {
        // Avoid leaving an unqueued category behind.
        // If deletion fails, the next local refresh may show it.
        console.error(
          "Failed to queue category creation:",
          err
        );
        throw err;
      }

      setCategories((current) => [
        ...current.filter(
          (item) => String(item.id) !== String(category.id)
        ),
        category,
      ]);

      return category;
    },
    []
  );

  // Update the local record and queue the change.
  const updateCategory = useCallback(
    async (id, categoryData) => {
      const existing = await getLocalCategory(id);

      if (!existing) {
        throw new Error("Category not found locally.");
      }

      const current = normalizeCategory(existing);

      const next = normalizeCategory({
        ...current,
        ...categoryData,
        id: current.id,
        updatedAt: new Date().toISOString(),
      });

      if (!next.nameEn.trim()) {
        throw new Error("Category name is required.");
      }

      await saveLocalCategory(next);

      const payload = {
        nameEn: next.nameEn,
        nameHi: next.nameHi || null,
      };

      const pendingCreate = await findPendingCreate(id);

      if (pendingCreate) {
        // A category not yet on the server only needs its
        // queued creation payload updated.
        await updatePendingOperation({
          ...pendingCreate,
          payload,
        });
      } else {
        await queueCategoryOperation({
          action: "update",
          recordId: id,
          payload,
        });
      }

      setCategories((currentCategories) => {
        if (next.status !== "active") {
          return currentCategories.filter(
            (item) => String(item.id) !== String(id)
          );
        }

        const exists = currentCategories.some(
          (item) => String(item.id) === String(id)
        );

        return exists
          ? currentCategories.map((item) =>
              String(item.id) === String(id) ? next : item
            )
          : [...currentCategories, next];
      });

      return next;
    },
    []
  );

  // Deactivation is local-first; the sync manager will send DELETE.
  const removeCategory = useCallback(
    async (id) => {
      const existing = await getLocalCategory(id);

      if (!existing) {
        throw new Error("Category not found locally.");
      }

      const current = normalizeCategory(existing);

      const inactiveCategory = {
        ...current,
        status: "inactive",
        updatedAt: new Date().toISOString(),
      };

      await saveLocalCategory(inactiveCategory);

      const pendingCreate = await findPendingCreate(id);

      if (pendingCreate) {
        // It has never reached the backend. Keep the create queued
        // so its temporary ID can be mapped, then deactivate it.
        await queueCategoryOperation({
          action: "deactivate",
          recordId: id,
          payload: {},
        });
      } else {
        await queueCategoryOperation({
          action: "deactivate",
          recordId: id,
          payload: {},
        });
      }

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => String(category.id) !== String(id)
        )
      );

      return inactiveCategory;
    },
    []
  );

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      fetchCategories,
      getCategory,
      addCategory,
      updateCategory,
      removeCategory,
    }),
    [
      categories,
      loading,
      error,
      fetchCategories,
      getCategory,
      addCategory,
      updateCategory,
      removeCategory,
    ]
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategories must be used inside CategoryProvider"
    );
  }

  return context;
}
