import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CategoryContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

function normalizeCategory(category) {
  return {
    id: category.id,
    nameEn: category.nameEn ?? category.name_en ?? "",
    nameHi: category.nameHi ?? category.name_hi ?? "",
    status: category.status ?? "active",
    createdAt: category.createdAt ?? category.created_at ?? null,
    updatedAt: category.updatedAt ?? category.updated_at ?? null,
  };
}

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(
    async ({ status = "active" } = {}) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (status) {
          params.set("status", status);
        }

        const response = await fetch(
          `${API_URL}/categories?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch categories."
          );
        }

        const list = Array.isArray(data)
          ? data
          : data.categories || data.data || [];

        setCategories(list.map(normalizeCategory));
      } catch (err) {
        setError(err.message || "Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async ({
    nameEn,
    nameHi,
    status = "active",
  }) => {
    setError("");

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameEn,
        nameHi,
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to create category."
      );
    }

    const created = normalizeCategory(
      data.category || data.data || data
    );

    setCategories((prev) => [...prev, created]);

    return created;
  };

  const updateCategory = async (
    categoryId,
    { nameEn, nameHi, status }
  ) => {
    setError("");

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameEn,
          nameHi,
          status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to update category."
      );
    }

    const updated = normalizeCategory(
      data.category || data.data || data
    );

    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? updated : category
      )
    );

    return updated;
  };

  const removeCategory = async (categoryId) => {
    setError("");

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data =
      response.status === 204
        ? null
        : await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to delete category."
      );
    }

    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId)
    );
  };

  const getCategory = useCallback(
    (categoryId) =>
      categories.find(
        (category) => category.id === categoryId
      ) || null,
    [categories]
  );

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        getCategory,
        addCategory,
        updateCategory,
        removeCategory,
      }}
    >
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