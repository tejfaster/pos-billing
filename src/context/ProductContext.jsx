import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { getProducts } from "../offline/offlineStorage";

const ProductContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

const normalizeProduct = (product) => ({
  id: product.id,

  nameEn:
    product.name_en ??
    product.nameEn ??
    "",

  nameHi:
    product.name_hi ??
    product.nameHi ??
    "",

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

  unitId:
    product.unit_id ??
    product.unitId ??
    null,

  unitNameEn:
    product.unit_name_en ??
    product.unitNameEn ??
    "",

  unitNameHi:
    product.unit_name_hi ??
    product.unitNameHi ??
    "",

  unitShortName:
    product.unit_short_name ??
    product.unitShortName ??
    "",

  unitType:
    product.unit_type ??
    product.unitType ??
    "",

  brand:
    product.brand ??
    "",

  status:
    product.status ??
    "active",

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

  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();

  /*
   * Load products from IndexedDB.
   *
   * IndexedDB is now the local catalogue
   * source for the POS.
   *
   * Backend catalogue data is populated by
   * the Sync Manager.
   */
  const loadLocalProducts = useCallback(
    async ({
      search = "",
      categoryId = "",
      status = "active",
    } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const localProducts =
          await getProducts();

        let normalizedProducts =
          localProducts.map(normalizeProduct);

        if (status) {
          normalizedProducts =
            normalizedProducts.filter(
              (product) =>
                product.status === status
            );
        }

        if (categoryId) {
          normalizedProducts =
            normalizedProducts.filter(
              (product) =>
                String(product.categoryId) ===
                String(categoryId)
            );
        }

        if (search.trim()) {
          const searchTerm =
            search.trim().toLowerCase();

          normalizedProducts =
            normalizedProducts.filter(
              (product) =>
                product.nameEn
                  .toLowerCase()
                  .includes(searchTerm) ||
                product.nameHi
                  .toLowerCase()
                  .includes(searchTerm) ||
                product.categoryNameEn
                  .toLowerCase()
                  .includes(searchTerm) ||
                product.categoryNameHi
                  .toLowerCase()
                  .includes(searchTerm) ||
                product.brand
                  .toLowerCase()
                  .includes(searchTerm)
            );
        }

        setProducts(normalizedProducts);

        return normalizedProducts;
      } catch (err) {
        console.error(
          "Load local products error:",
          err
        );

        setError(
          err?.message ||
            "Failed to load products."
        );

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * Catalogue reads are local-only.
   *
   * The Sync Manager is responsible for
   * fetching catalogue data from the backend.
   */
  const fetchProducts = useCallback(
    async ({
      search = "",
      categoryId = "",
      status = "active",
    } = {}) => {
      return loadLocalProducts({
        search,
        categoryId,
        status,
      });
    },
    [loadLocalProducts]
  );

  /*
   * Fetch products automatically when
   * ProductProvider loads.
   *
   * This now reads IndexedDB instead of
   * calling the backend.
   */
  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated
    ) {
      return;
    }

    fetchProducts();
  }, [
    authLoading,
    isAuthenticated,
    fetchProducts,
  ]);

  /*
   * Add product
   *
   * Admin CRUD remains online-only.
   */
  const addProduct = useCallback(
    async (product) => {
      try {
        setError(null);

        const response = await fetch(
          `${API_URL}/products`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              nameEn:
                product.nameEn,

              nameHi:
                product.nameHi ||
                null,

              categoryId:
                product.categoryId,

              unitId:
                product.unitId ||
                null,

              brand:
                product.brand ||
                null,

              status:
                product.status ||
                "active",
            }),
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to add product."
          );
        }

        const createdProduct =
          normalizeProduct(
            result?.data
          );

        setProducts((current) => [
          createdProduct,
          ...current,
        ]);

        return createdProduct;
      } catch (err) {
        console.error(
          "Add product error:",
          err
        );

        setError(
          err?.message ||
            "Failed to add product."
        );

        throw err;
      }
    },
    []
  );

  /*
   * Update product
   */
  const updateProduct = useCallback(
    async (id, product) => {
      try {
        setError(null);

        const body = {};

        if (
          product.nameEn !==
          undefined
        ) {
          body.nameEn =
            product.nameEn;
        }

        if (
          product.nameHi !==
          undefined
        ) {
          body.nameHi =
            product.nameHi;
        }

        if (
          product.categoryId !==
          undefined
        ) {
          body.categoryId =
            product.categoryId;
        }

        if (
          product.unitId !==
          undefined
        ) {
          body.unitId =
            product.unitId ||
            null;
        }

        if (
          product.brand !==
          undefined
        ) {
          body.brand =
            product.brand ||
            null;
        }

        if (
          product.status !==
          undefined
        ) {
          body.status =
            product.status;
        }

        const response =
          await fetch(
            `${API_URL}/products/${id}`,
            {
              method: "PATCH",
              credentials:
                "include",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(body),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to update product."
          );
        }

        const updatedProduct =
          normalizeProduct(
            result?.data
          );

        setProducts((current) =>
          current.map(
            (productItem) =>
              String(
                productItem.id
              ) === String(id)
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

  /*
   * Remove product
   */
  const removeProduct = useCallback(
    async (id) => {
      try {
        setError(null);

        const response =
          await fetch(
            `${API_URL}/products/${id}`,
            {
              method: "DELETE",
              credentials:
                "include",
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
              String(product.id) !==
              String(id)
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
          String(product.id) ===
          String(id)
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
    <ProductContext.Provider
      value={value}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}