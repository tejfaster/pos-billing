export default function ProductList({
  products,
  selectedProductId,
  onSelect,
}) {
  if (products.length === 0) {
    return (
      <div
        className="
          rounded-xl
          border
          border-dashed
          border-[var(--border)]
          bg-[var(--surface)]
          px-5
          py-12
          text-center
        "
      >
        <p className="text-sm font-medium text-[var(--foreground)]">
          No products found
        </p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Try a different search or add a new product.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
      "
    >
      <div
        className="
          border-b
          border-[var(--border)]
          bg-[var(--muted)]/5
          px-4
          py-3
          text-xs
          font-medium
          text-[var(--muted)]
        "
      >
        Products
      </div>

      <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
        {products.map((product) => {
          const isSelected =
            product.id === selectedProductId;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product.id)}
              className={`
                block
                w-full
                border-b
                border-[var(--border)]
                px-4
                py-4
                text-left
                transition
                last:border-b-0
                ${
                  isSelected
                    ? "bg-[var(--muted)]/10"
                    : "hover:bg-[var(--muted)]/5"
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">
                    {product.name}
                  </div>

                  <div className="mt-1 truncate text-xs text-[var(--muted)]">
                    {product.brand
                      ? `${product.brand} · `
                      : ""}
                    {product.code || "No SKU"}
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[var(--accent-soft)]
                    px-2
                    py-1
                    text-[11px]
                    font-medium
                    text-[var(--foreground)]
                  "
                >
                  {product.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}