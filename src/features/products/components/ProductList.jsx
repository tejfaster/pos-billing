import { useLanguage } from "../../../context/LanguageContext";

export default function ProductList({
  products = [],
  selectedProductId = null,
  onSelect,
}) {
  const { getLocalizedName } = useLanguage();

  if (products.length === 0) {
    return (
      <div
        className="
          flex
          h-full
          items-center
          justify-center
          bg-[var(--surface)]
          px-6
          text-center
        "
      >
        <p className="text-sm text-[var(--muted)]">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full min-w-[900px] border-collapse">
        <thead className="sticky top-0 z-10 bg-[var(--surface)]">
          <tr className="border-b border-[var(--border)]">
            <th className="w-14 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              #
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Product
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Hindi Name
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Category
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Brand
            </th>

            <th className="w-28 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => {
            const isSelected =
              String(product.id) ===
              String(selectedProductId);

            return (
              <tr
                key={product.id}
                onClick={() => onSelect?.(product.id)}
                className={`
                  cursor-pointer
                  border-b
                  border-[var(--border)]
                  transition
                  last:border-b-0
                  ${
                    isSelected
                      ? "bg-[var(--background)]"
                      : "hover:bg-[var(--background)]"
                  }
                `}
              >
                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {index + 1}
                </td>

                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    {getLocalizedName(product) || "—"}
                  </div>

                  {product.nameEn &&
                    product.nameHi && (
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        {product.nameEn}
                      </div>
                    )}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {product.nameHi || "—"}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                  {product.categoryNameEn ||
                    product.categoryNameHi ||
                    "—"}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {product.brand || "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-[var(--muted)]">
                    {product.status || "active"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}