import { useMemo, useState } from "react";

import { useProducts } from "../context/ProductContext";
import ProductForm from "../features/products/components/ProductForm";
import ProductList from "../features/products/components/ProductList";
import { useLanguage } from "../context/LanguageContext";

export default function Products() {
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
  } = useProducts();

  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] =
    useState(null);
  const [isCreating, setIsCreating] =
    useState(false);

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(value) ||
        product.code
          ?.toLowerCase()
          .includes(value) ||
        product.brand
          ?.toLowerCase()
          .includes(value) ||
        product.category
          .toLowerCase()
          .includes(value)
      );
    });
  }, [products, search]);

  const selectedProduct = products.find(
    (product) =>
      product.id === selectedProductId
  );

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsCreating(true);
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setIsCreating(false);
  };

  const handleSaveProduct = (product) => {
    if (product.id) {
      updateProduct(product.id, product);
    } else {
      const newProduct = {
        ...product,
        id: Date.now(),
      };

      addProduct(newProduct);
      setSelectedProductId(newProduct.id);
    }

    setIsCreating(false);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) {
      return;
    }

    const confirmed = window.confirm(
      `${t("deleteProductConfirmationStart")} "${selectedProduct.name}"? ${t(
        "deleteProductConfirmationEnd"
      )}`
    );

    if (!confirmed) {
      return;
    }

    removeProduct(selectedProduct.id);

    setSelectedProductId(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedProductId(null);
  };

  return (
    <div
      className="
        h-full
        w-full
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-7xl
          flex-col
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
        "
      >
        <header
          className="
            flex
            shrink-0
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("products")}
            </h1>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("manageProducts")}
            </p>
          </div>

          <div
            className="
              flex
              w-full
              flex-col
              gap-2
              sm:flex-row
              lg:w-auto
            "
          >
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={t("searchProducts")}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3
                text-sm
                text-[var(--foreground)]
                outline-none
                transition
                placeholder:text-[var(--muted)]
                focus:border-[var(--foreground)]
                focus:ring-2
                focus:ring-[var(--foreground)]/10
                sm:w-72
              "
            />

            <button
              type="button"
              onClick={handleAddProduct}
              className="
                h-10
                rounded-lg
                bg-[var(--foreground)]
                px-4
                text-sm
                font-medium
                text-[var(--background)]
                transition
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              + {t("addProduct")}
            </button>
          </div>
        </header>

        <main
          className="
            mt-6
            min-h-0
            flex-1
          "
        >
          <div
            className="
              grid
              h-full
              min-h-0
              gap-5
              lg:grid-cols-[360px_minmax(0,1fr)]
            "
          >
            <div className="min-h-0 overflow-y-auto">
              <ProductList
                products={filteredProducts}
                selectedProductId={
                  selectedProductId
                }
                onSelect={handleSelectProduct}
              />
            </div>

            <div className="min-h-0 overflow-y-auto">
              {isCreating || selectedProduct ? (
                <div className="space-y-4">
                  <ProductForm
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancel}
                  />

                  {selectedProduct && (
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        border
                        border-[var(--danger)]/30
                        bg-[var(--surface)]
                        px-5
                        py-4
                      "
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {t("deleteProduct")}
                        </div>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {t(
                            "deleteProductDescription"
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDeleteProduct}
                        className="
                          shrink-0
                          rounded-lg
                          border
                          border-[var(--danger)]
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-[var(--danger)]
                          transition
                          hover:bg-[var(--danger)]/10
                          active:scale-[0.98]
                        "
                      >
                        {t("deleteProduct")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="
                    flex
                    min-h-[400px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-6
                    text-center
                  "
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      {t("selectProduct")}
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
                      {t(
                        "selectProductDescription"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}