import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ProductContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

const normalizeProduct = (product) => ({
  id: product.id,

  nameEn: product.name_en ?? product.nameEn ?? "",
  nameHi: product.name_hi ?? product.nameHi ?? "",

  categoryId:
    product.category_id ??
    product.categoryId ??
    null,

  categoryNameEn:
    product.category_name_en ??
    product.categoryNameEn ??
    "",

  categoryNameHi:
    product.category_name_hi ??
    product.categoryNameHi ??
    "",

  brand: product.brand ?? "",

  status: product.status ?? "active",

  createdAt:
    product.created_at ??
    product.createdAt ??
    null,

  updatedAt:
    product.updated_at ??
    product.updatedAt ??
    null,
});

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async ({
      search = "",
      categoryId = "",
      status = "active",
    } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (categoryId) {
          params.set("categoryId", categoryId);
        }

        if (status) {
          params.set("status", status);
        }

        const queryString = params.toString();

        const response = await fetch(
          `${API_URL}/products${
            queryString ? `?${queryString}` : ""
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
              "Failed to fetch products."
          );
        }

        const productList = Array.isArray(result?.data)
          ? result.data
          : [];

        const normalizedProducts =
          productList.map(normalizeProduct);

        setProducts(normalizedProducts);

        return normalizedProducts;
      } catch (err) {
        console.error("Fetch products error:", err);

        setError(
          err?.message ||
            "Failed to fetch products."
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch products automatically when ProductProvider loads
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product) => {
    try {
      setError(null);

      const response = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameEn: product.nameEn,
            nameHi: product.nameHi || null,
            categoryId: product.categoryId,
            brand: product.brand || null,
            status: product.status || "active",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to add product."
        );
      }

      const createdProduct = normalizeProduct(
        result?.data
      );

      setProducts((current) => [
        createdProduct,
        ...current,
      ]);

      return createdProduct;
    } catch (err) {
      console.error("Add product error:", err);

      setError(
        err?.message ||
          "Failed to add product."
      );

      throw err;
    }
  }, []);

  const updateProduct = useCallback(
    async (id, product) => {
      try {
        setError(null);

        const body = {};

        if (product.nameEn !== undefined) {
          body.nameEn = product.nameEn;
        }

        if (product.nameHi !== undefined) {
          body.nameHi = product.nameHi;
        }

        if (product.categoryId !== undefined) {
          body.categoryId = product.categoryId;
        }

        if (product.brand !== undefined) {
          body.brand = product.brand || null;
        }

        if (product.status !== undefined) {
          body.status = product.status;
        }

        const response = await fetch(
          `${API_URL}/products/${id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to update product."
          );
        }

        const updatedProduct = normalizeProduct(
          result?.data
        );

        setProducts((current) =>
          current.map((productItem) =>
            String(productItem.id) === String(id)
              ? updatedProduct
              : productItem
          )
        );

        return updatedProduct;
      } catch (err) {
        console.error(
          "Update product error:",
          err
        );

        setError(
          err?.message ||
            "Failed to update product."
        );

        throw err;
      }
    },
    []
  );

  const removeProduct = useCallback(
    async (id) => {
      try {
        setError(null);

        const response = await fetch(
          `${API_URL}/products/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const result =
          response.status === 204
            ? null
            : await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to delete product."
          );
        }

        setProducts((current) =>
          current.filter(
            (product) =>
              String(product.id) !== String(id)
          )
        );

        return result;
      } catch (err) {
        console.error(
          "Delete product error:",
          err
        );

        setError(
          err?.message ||
            "Failed to delete product."
        );

        throw err;
      }
    },
    []
  );

  const getProduct = useCallback(
    (id) =>
      products.find(
        (product) =>
          String(product.id) === String(id)
      ) || null,
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      fetchProducts,
      addProduct,
      updateProduct,
      removeProduct,
      getProduct,
    }),
    [
      products,
      loading,
      error,
      fetchProducts,
      addProduct,
      updateProduct,
      removeProduct,
      getProduct,
    ]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}