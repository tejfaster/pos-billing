import { useEffect, useState } from "react";

import { useCategories } from "../../../context/CategoryContext";
import { useLanguage } from "../../../context/LanguageContext";

const EMPTY_FORM = {
  nameEn: "",
  nameHi: "",
  brand: "",
  categoryId: "",
};

export default function ProductForm({
  product,
  onSave,
  onCancel,
}) {
  const { categories } = useCategories();
  const { t, getLocalizedName } = useLanguage();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        nameEn: product.nameEn || "",
        nameHi: product.nameHi || "",
        brand: product.brand || "",
        categoryId: product.categoryId
          ? String(product.categoryId)
          : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [product]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nameEn.trim()) {
      return;
    }

    if (!form.nameHi.trim()) {
      return;
    }

    if (!form.categoryId) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ...(product || {}),
        nameEn: form.nameEn.trim(),
        nameHi: form.nameHi.trim(),
        brand: form.brand.trim(),
        categoryId: form.categoryId,
        status: product?.status || "active",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
      "
    >
      {/* Header */}
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-lg font-semibold">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {product
            ? "Update product information."
            : "Add a new product to your catalogue."}
        </p>
      </div>

      {/* Fields */}
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t("productNameEnglish")}
          </label>

          <input
            type="text"
            value={form.nameEn}
            onChange={(event) =>
              handleChange(
                "nameEn",
                event.target.value
              )
            }
            placeholder={t(
              "productNameEnglishPlaceholder"
            )}
            className="
              w-full
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-3
              py-2.5
              text-sm
              text-[var(--foreground)]
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
            {t("productNameHindi")}
          </label>

          <input
            type="text"
            value={form.nameHi}
            onChange={(event) =>
              handleChange(
                "nameHi",
                event.target.value
              )
            }
            placeholder={t(
              "productNameHindiPlaceholder"
            )}
            className="
              w-full
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-3
              py-2.5
              text-sm
              text-[var(--foreground)]
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
            Brand
          </label>

          <input
            type="text"
            value={form.brand}
            onChange={(event) =>
              handleChange(
                "brand",
                event.target.value
              )
            }
            placeholder="e.g. Tata"
            className="
              w-full
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-3
              py-2.5
              text-sm
              text-[var(--foreground)]
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
            Category
          </label>

          <select
            value={form.categoryId}
            onChange={(event) =>
              handleChange(
                "categoryId",
                event.target.value
              )
            }
            className="
              w-full
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-3
              py-2.5
              text-sm
              text-[var(--foreground)]
              outline-none
              focus:border-[var(--foreground)]
              focus:ring-2
              focus:ring-[var(--foreground)]/10
            "
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {getLocalizedName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex
          justify-end
          gap-2
          border-t
          border-[var(--border)]
          px-5
          py-4
        "
      >
        <button
          type="button"
          onClick={onCancel}
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

        <button
          type="submit"
          disabled={saving}
          className="
            rounded-lg
            border
            border-[var(--foreground)]
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
          {saving
            ? t("saving")
            : product
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}