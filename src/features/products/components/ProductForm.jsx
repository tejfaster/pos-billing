import { useEffect, useState } from "react";

import { CATEGORIES } from "../../../data/categories";
import ProductUnitList from "./ProductUnitList";

const EMPTY_FORM = {
  name: "",
  code: "",
  brand: "",
  category: "",
  unitIds: [],
};

export default function ProductForm({
  product,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        code: product.code || "",
        brand: product.brand || "",
        category: product.category || "",
        unitIds: product.unitIds || [],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [product]);

  const isEditing = Boolean(product);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddUnit = (unitId) => {
    setForm((current) => {
      if (current.unitIds.includes(unitId)) {
        return current;
      }

      return {
        ...current,
        unitIds: [...current.unitIds, unitId],
      };
    });
  };

  const handleRemoveUnit = (unitId) => {
    setForm((current) => ({
      ...current,
      unitIds: current.unitIds.filter(
        (id) => id !== unitId
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const code = form.code.trim();
    const brand = form.brand.trim();

    if (!name || !form.category) {
      return;
    }

    const savedProduct = {
      ...(product || {}),
      name,
      code,
      brand,
      category: form.category,
      unitIds: form.unitIds,
    };

    onSave(savedProduct);
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
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-[var(--border)]
          px-5
          py-4
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Add product information and selling units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                py-2
                text-sm
                font-medium
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
              "
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="
              rounded-lg
              bg-[var(--foreground)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--background)]
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            {isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-5">
        {/* Basic Information */}

        <section>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Basic Information
          </h3>

          <div
            className="
              mt-4
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            {/* Product Name */}

            <div className="sm:col-span-2">
              <label
                htmlFor="product-name"
                className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
              >
                Product Name
                <span className="ml-1 text-[var(--danger)]">
                  *
                </span>
              </label>

              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Exterior Emulsion Paint"
                required
                className="
                  h-11
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
                "
              />
            </div>

            {/* Brand */}

            <div>
              <label
                htmlFor="product-brand"
                className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
              >
                Brand
              </label>

              <input
                id="product-brand"
                type="text"
                value={form.brand}
                onChange={(event) =>
                  handleChange(
                    "brand",
                    event.target.value
                  )
                }
                placeholder="e.g. Asian Paints"
                className="
                  h-11
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
                "
              />
            </div>

            {/* Product Code */}

            <div>
              <label
                htmlFor="product-code"
                className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
              >
                Product Code / SKU
              </label>

              <input
                id="product-code"
                type="text"
                value={form.code}
                onChange={(event) =>
                  handleChange(
                    "code",
                    event.target.value
                  )
                }
                placeholder="e.g. PNT-EXT-001"
                className="
                  h-11
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
                "
              />
            </div>

            {/* Category */}

            <div className="sm:col-span-2">
              <label
                htmlFor="product-category"
                className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
              >
                Category
                <span className="ml-1 text-[var(--danger)]">
                  *
                </span>
              </label>

              <select
                id="product-category"
                value={form.category}
                onChange={(event) =>
                  handleChange(
                    "category",
                    event.target.value
                  )
                }
                required
                className="
                  h-11
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
                  focus:border-[var(--foreground)]
                  focus:ring-2
                  focus:ring-[var(--foreground)]/10
                "
              >
                <option value="">
                  Select category
                </option>

                {CATEGORIES.map((category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Units */}

        <section
          className="
            border-t
            border-[var(--border)]
            pt-6
          "
        >
          <ProductUnitList
            selectedUnitIds={form.unitIds}
            onAddUnit={handleAddUnit}
            onRemoveUnit={handleRemoveUnit}
          />
        </section>
      </div>
    </form>
  );
}