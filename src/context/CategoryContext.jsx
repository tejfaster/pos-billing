import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { getCategories } from "../offline/offlineStorage";

const CategoryContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const normalizeCategory = (category) => ({
  id: category.id,

  nameEn:
    category.name_en ??
    category.nameEn ??
    "",

  nameHi:
    category.name_hi ??
    category.nameHi ??
    "",

  status:
    category.status ??
    "active",

  createdAt:
    category.created_at ??
    category.createdAt ??
    null,

  updatedAt:
    category.updated_at ??
    category.updatedAt ??
    null,
});

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

        const localCategories =
          await getCategories();

        const normalizedCategories =
          localCategories.map(normalizeCategory);

        const filteredCategories = status
          ? normalizedCategories.filter(
              (category) =>
                category.status === status
            )
          : normalizedCategories;

        setCategories(filteredCategories);

        return filteredCategories;
      } catch (err) {
        console.error(
          "Load local categories error:",
          err
        );

        setError(
          err?.message ||
            "Failed to load categories."
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
      return loadLocalCategories({
        status,
      });
    },
    [loadLocalCategories]
  );

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated
    ) {
      return;
    }

    loadLocalCategories();
  }, [
    authLoading,
    isAuthenticated,
    loadLocalCategories,
  ]);

  const getCategory = useCallback(
    (id) => {
      return (
        categories.find(
          (category) =>
            String(category.id) ===
            String(id)
        ) || null
      );
    },
    [categories]
  );

  const addCategory = useCallback(
    async (categoryData) => {
      if (!navigator.onLine) {
        throw new Error(
          "You are offline. Adding categories offline is not available yet."
        );
      }

      const response = await fetch(
        `${API_URL}/categories`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify(categoryData),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to add category."
        );
      }

      const category =
        normalizeCategory(
          result?.data ?? result
        );

      setCategories((current) => [
        ...current,
        category,
      ]);

      return category;
    },
    []
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (!navigator.onLine) {
        throw new Error(
          "You are offline. Updating categories offline is not available yet."
        );
      }

      const response = await fetch(
        `${API_URL}/categories/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify(categoryData),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update category."
        );
      }

      const category =
        normalizeCategory(
          result?.data ?? result
        );

      setCategories((current) =>
        current.map((item) =>
          String(item.id) ===
          String(id)
            ? category
            : item
        )
      );

      return category;
    },
    []
  );

  const removeCategory = useCallback(
    async (id) => {
      if (!navigator.onLine) {
        throw new Error(
          "You are offline. Removing categories offline is not available yet."
        );
      }

      const response =
        await fetch(
          `${API_URL}/categories/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to remove category."
        );
      }

      setCategories((current) =>
        current.filter(
          (category) =>
            String(category.id) !==
            String(id)
        )
      );

      return result;
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
    <CategoryContext.Provider
      value={value}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context =
    useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategories must be used inside CategoryProvider"
    );
  }

  return context;
}