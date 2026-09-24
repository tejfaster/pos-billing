import { useMemo, useState } from "react";

import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
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

  const {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
  } = useCategories();

  const { t, language, getLocalizedName } = useLanguage();

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] =
    useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [categoryNameEn, setCategoryNameEn] = useState("");
  const [categoryNameHi, setCategoryNameHi] = useState("");
  const [editingCategoryId, setEditingCategoryId] =
    useState(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      const nameEn = product.nameEn?.toLowerCase() || "";
      const nameHi = product.nameHi?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const categoryNameEn =
        product.categoryNameEn?.toLowerCase() || "";
      const categoryNameHi =
        product.categoryNameHi?.toLowerCase() || "";

      return (
        nameEn.includes(value) ||
        nameHi.includes(value) ||
        brand.includes(value) ||
        categoryNameEn.includes(value) ||
        categoryNameHi.includes(value)
      );
    });
  }, [products, search]);

  const selectedProduct = products.find(
    (product) =>
      String(product.id) === String(selectedProductId)
  );

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsCreating(true);
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setIsCreating(false);
  };

  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await updateProduct(product.id, product);
      } else {
        const createdProduct = await addProduct(product);

        if (createdProduct?.id) {
          setSelectedProductId(createdProduct.id);
        }
      }

      setIsCreating(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) {
      return;
    }

    const productName =
      language === "hi"
        ? selectedProduct.nameHi ||
          selectedProduct.nameEn
        : selectedProduct.nameEn ||
          selectedProduct.nameHi;

    const confirmed = window.confirm(
      `${t("deleteProductConfirmationStart")} "${productName}"? ${t(
        "deleteProductConfirmationEnd"
      )}`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeProduct(selectedProduct.id);

      setSelectedProductId(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedProductId(null);
  };

  const resetCategoryForm = () => {
    setCategoryNameEn("");
    setCategoryNameHi("");
    setEditingCategoryId(null);
    setCategoryError("");
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryNameEn(category.nameEn || "");
    setCategoryNameHi(category.nameHi || "");
    setCategoryError("");
  };

  const handleSaveCategory = async (event) => {
    event.preventDefault();

    const nameEn = categoryNameEn.trim();
    const nameHi = categoryNameHi.trim();

    if (!nameEn || !nameHi) {
      setCategoryError(
        "English Name and Hindi Name are required."
      );
      return;
    }

    setCategorySaving(true);
    setCategoryError("");

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, {
          nameEn,
          nameHi,
          status: "active",
        });
      } else {
        await addCategory({
          nameEn,
          nameHi,
          status: "active",
        });
      }

      resetCategoryForm();
    } catch (error) {
      setCategoryError(
        error.message || "Failed to save category."
      );
    } finally {
      setCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const categoryName = getLocalizedName(category);

    const confirmed = window.confirm(
      `Delete "${categoryName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeCategory(category.id);

      if (editingCategoryId === category.id) {
        resetCategoryForm();
      }
    } catch (error) {
      setCategoryError(
        error.message || "Failed to delete category."
      );
    }
  };

  return (
    <div
      className="
        flex
        min-h-full
        w-full
        flex-col
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      <div
        className="
          mx-auto
          flex
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
        {/* Header */}
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

          <div className="flex w-full gap-2 sm:w-auto">
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
                shrink-0
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                text-sm
                font-medium
                text-[var(--foreground)]
                transition
                hover:bg-[var(--background)]
                active:scale-[0.98]
              "
            >
              + {t("addProduct")}
            </button>
          </div>
        </header>

        {/* Main page content */}
        <main className="mt-6">
          <div className="space-y-6">
            {/* Product Section */}
            <section
              className="
                overflow-hidden
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
              "
            >
              {!isCreating && !selectedProduct ? (
                <div className="h-[520px] min-h-0">
                  <ProductList
                    products={filteredProducts}
                    selectedProductId={selectedProductId}
                    onSelect={handleSelectProduct}
                  />
                </div>
              ) : (
                <div className="p-5">
                  <ProductForm
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancel}
                  />

                  {selectedProduct && (
                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-[var(--danger)]/30
                        bg-[var(--background)]
                        px-5
                        py-4
                      "
                    >
                      <div>
                        <div className="text-sm font-medium">
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
                        "
                      >
                        {t("deleteProduct")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Category Management */}
            <section
              className="
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
              "
            >
              <div className="border-b border-[var(--border)] px-5 py-4">
                <h2 className="text-lg font-semibold">
                  Category Management
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Add, edit, or remove product categories.
                </p>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                {/* Category Form */}
                <form
                  onSubmit={handleSaveCategory}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      English Name
                    </label>

                    <input
                      type="text"
                      value={categoryNameEn}
                      onChange={(event) =>
                        setCategoryNameEn(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Cement"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        placeholder:text-[var(--muted)]
                        focus:border-[var(--foreground)]
                        focus:ring-2
                        focus:ring-[var(--foreground)]/10
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Hindi Name
                    </label>

                    <input
                      type="text"
                      value={categoryNameHi}
                      onChange={(event) =>
                        setCategoryNameHi(
                          event.target.value
                        )
                      }
                      placeholder="जैसे: सीमेंट"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        placeholder:text-[var(--muted)]
                        focus:border-[var(--foreground)]
                        focus:ring-2
                        focus:ring-[var(--foreground)]/10
                      "
                    />
                  </div>

                  {categoryError && (
                    <div
                      className="
                        rounded-lg
                        border
                        border-[var(--danger)]/30
                        bg-[var(--background)]
                        px-3
                        py-2.5
                        text-sm
                        text-[var(--danger)]
                      "
                    >
                      {categoryError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={categorySaving}
                      className="
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--foreground)]
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-[var(--background)]
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {categorySaving
                        ? "Saving..."
                        : editingCategoryId
                        ? "Update Category"
                        : "Add Category"}
                    </button>

                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="
                          rounded-lg
                          border
                          border-[var(--border)]
                          bg-[var(--surface)]
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          text-[var(--foreground)]
                          transition
                          hover:bg-[var(--background)]
                        "
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Category List */}
                <div className="min-w-0 overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          #
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Name
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Hindi Name
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {categories.map((category, index) => (
                        <tr
                          key={category.id}
                          className="border-b border-[var(--border)] last:border-b-0"
                        >
                          <td className="px-3 py-3 text-sm text-[var(--muted)]">
                            {index + 1}
                          </td>

                          <td className="px-3 py-3 text-sm font-medium">
                            {getLocalizedName(category) || "—"}
                          </td>

                          <td className="px-3 py-3 text-sm text-[var(--muted)]">
                            {category.nameHi || "—"}
                          </td>

                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditCategory(category)
                                }
                                className="
                                  rounded-md
                                  px-3
                                  py-1.5
                                  text-sm
                                  font-medium
                                  text-[var(--foreground)]
                                  hover:bg-[var(--background)]
                                "
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCategory(category)
                                }
                                className="
                                  rounded-md
                                  px-3
                                  py-1.5
                                  text-sm
                                  font-medium
                                  text-[var(--danger)]
                                  hover:bg-[var(--danger)]/10
                                "
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}