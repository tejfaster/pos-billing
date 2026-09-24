import { useLanguage } from "../../../context/LanguageContext";

export default function CategoryList({
  categories = [],
  onEdit,
  onDelete,
}) {
  const { getLocalizedName } = useLanguage();

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          No categories found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                #
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Name
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Hindi Name
              </th>

              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Status
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
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
                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {index + 1}
                </td>

                <td className="px-4 py-3 text-sm font-medium">
                  {getLocalizedName(category) || "—"}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--muted)]">
                  {category.nameHi || "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={
                      category.status === "active"
                        ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }
                  >
                    {category.status || "active"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(category)}
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(category)}
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
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
  );
}