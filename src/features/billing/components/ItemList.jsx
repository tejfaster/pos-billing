import ItemRow from "./ItemRow";
import { useLanguage } from "../../../context/LanguageContext";

export default function ItemList({
  items,
  onChangeQuantity,
  onSetQuantity,
  onChangeUnit,
  onChangeRate,
  onRemove,
}) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-dashed
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-10
          text-center
          text-sm
          text-[var(--muted)]
        "
      >
        {t("searchAndSelectItem")}
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        overflow-x-auto
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
      "
    >
      <table
        className="
          w-full
          table-fixed
          border-collapse
        "
      >
        <colgroup>
          {/* # */}
          <col style={{ width: "4%" }} />

          {/* Product */}
          <col style={{ width: "31%" }} />

          {/* Quantity */}
          <col style={{ width: "20%" }} />

          {/* Unit */}
          <col style={{ width: "15%" }} />

          {/* Rate */}
          <col style={{ width: "14%" }} />

          {/* Final Price */}
          <col style={{ width: "12%" }} />

          {/* Remove */}
          <col style={{ width: "4%" }} />
        </colgroup>

        <thead>
          <tr
            className="
              border-b
              border-[var(--border)]
              bg-[var(--muted)]/5
              text-xs
              font-medium
              text-[var(--muted)]
            "
          >
            {/* Number */}
            <th className="px-2 py-3 text-center">
              #
            </th>

            {/* Product */}
            <th className="px-3 py-3 text-left">
              {t("item")}
            </th>

            {/* Quantity */}
            <th className="px-2 py-3 text-center">
              {t("qty")}
            </th>

            {/* Unit */}
            <th className="px-2 py-3 text-left">
              {t("unit")}
            </th>

            {/* Rate */}
            <th className="px-2 py-3 text-left">
              {t("rate")}
            </th>

            {/* Final Price */}
            <th className="px-2 py-3 text-right">
              {t("price") || "Price"}
            </th>

            {/* Remove */}
            <th className="px-1 py-3" />
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <ItemRow
              key={item.product?.id ?? index}
              item={item}
              index={index}
              onChangeQuantity={onChangeQuantity}
              onSetQuantity={onSetQuantity}
              onChangeUnit={onChangeUnit}
              onChangeRate={onChangeRate}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}