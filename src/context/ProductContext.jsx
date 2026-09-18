import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { PRODUCTS as INITIAL_PRODUCTS } from "../data/products";

const ProductContext = createContext(null);

const normalizeProduct = (product) => ({
  ...product,
  brand: product.brand || "",
  unitIds: product.unitIds || [],
});

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() =>
    INITIAL_PRODUCTS.map(normalizeProduct)
  );

  const addProduct = useCallback((product) => {
    setProducts((currentProducts) => [
      ...currentProducts,
      normalizeProduct(product),
    ]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? normalizeProduct({
              ...product,
              ...updates,
            })
          : product
      )
    );
  }, []);

  const removeProduct = useCallback((id) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );
  }, []);

  const getProduct = useCallback(
    (id) => {
      return products.find(
        (product) => product.id === id
      );
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      removeProduct,
      getProduct,
    }),
    [
      products,
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