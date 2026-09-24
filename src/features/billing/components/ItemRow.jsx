import { useLanguage } from "../../../context/LanguageContext";
import { useUnits } from "../../../context/UnitContext";

export default function ItemRow({
  item,
  index,
  onChangeQuantity,
  onSetQuantity,
  onChangeUnit,
  onChangeRate,
  onRemove,
}) {
  const { t, getLocalizedName } = useLanguage();
  const { units, loading: unitsLoading } = useUnits();

  const product = item.product;
  const productName = getLocalizedName(product);

  const hasRate =
    item.rate !== "" &&
    !Number.isNaN(Number(item.rate));

  const price = hasRate
    ? Number(item.qty) * Number(item.rate)
    : null;

  const formattedPrice =
    price !== null
      ? `₹${price.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}`
      : "—";

  return (
    <tr
      className="
        border-b
        border-[var(--border)]
        last:border-b-0
      "
    >
      {/* Number */}
      <td className="px-3 py-3 align-middle">
        <span className="text-sm text-[var(--muted)]">
          {index + 1}
        </span>
      </td>

      {/* Product */}
      <td className="px-3 py-3 align-middle">
        <div className="min-w-0">
          <div
            className="
              truncate
              text-sm
              font-medium
              text-[var(--foreground)]
            "
          >
            {productName}
          </div>

          {product?.brand && (
            <div
              className="
                mt-0.5
                truncate
                text-xs
                text-[var(--muted)]
              "
            >
              {product.brand}
            </div>
          )}
        </div>
      </td>

      {/* Quantity */}
      <td className="px-3 py-3 align-middle">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() =>
              onChangeQuantity(product.id, -1)
            }
            aria-label={`${t("decreaseQuantity")} ${productName}`}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-base
              text-[var(--foreground)]
              transition
              hover:bg-[var(--muted)]/10
              active:scale-95
            "
          >
            −
          </button>

          <input
            type="text"
            inputMode="decimal"
            value={item.qty}
            onChange={(event) => {
              const value = event.target.value;

              if (/^\d*\.?\d*$/.test(value)) {
                onSetQuantity(product.id, value);
              }
            }}
            aria-label={`${t("quantityFor")} ${productName}`}
            className="
              h-8
              w-11
              shrink-0
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-1
              text-center
              text-sm
              font-medium
              text-[var(--foreground)]
              outline-none
              transition
              focus:border-[var(--foreground)]
              focus:ring-2
              focus:ring-[var(--foreground)]/10
            "
          />

          <button
            type="button"
            onClick={() =>
              onChangeQuantity(product.id, 1)
            }
            aria-label={`${t("increaseQuantity")} ${productName}`}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-base
              text-[var(--foreground)]
              transition
              hover:bg-[var(--muted)]/10
              active:scale-95
            "
          >
            +
          </button>
        </div>
      </td>

      {/* Unit */}
      <td className="px-3 py-3 align-middle">
        <select
          value={item.unit || ""}
          onChange={(event) =>
            onChangeUnit(
              product.id,
              event.target.value
            )
          }
          disabled={unitsLoading}
          aria-label={`${t("unit")} ${productName}`}
          className="
            block
            h-9
            w-full
            min-w-0
            rounded-md
            border
            border-[var(--border)]
            bg-[var(--surface)]
            px-2
            text-sm
            text-[var(--foreground)]
            outline-none
            transition
            focus:border-[var(--foreground)]
            focus:ring-2
            focus:ring-[var(--foreground)]/10
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <option value="">
            {unitsLoading ? "..." : t("unit")}
          </option>

          {units.map((unit) => (
            <option
              key={unit.id}
              value={unit.id}
            >
              {getLocalizedName(unit)}
              {unit.shortName
                ? ` (${unit.shortName})`
                : ""}
            </option>
          ))}
        </select>
      </td>

      {/* Rate */}
      <td className="px-3 py-3 align-middle">
        <input
          type="text"
          inputMode="decimal"
          value={item.rate}
          onChange={(event) => {
            const value = event.target.value;

            if (/^\d*\.?\d*$/.test(value)) {
              onChangeRate(product.id, value);
            }
          }}
          placeholder={t("rate")}
          aria-label={`${t("rateFor")} ${productName}`}
          className="
            block
            h-9
            w-full
            min-w-0
            rounded-md
            border
            border-[var(--border)]
            bg-[var(--surface)]
            px-2.5
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
      </td>

      {/* Final Price */}
      <td className="px-3 py-3 text-right align-middle">
        <span
          className="
            whitespace-nowrap
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {formattedPrice}
        </span>
      </td>

      {/* Remove */}
      <td className="px-2 py-3 text-center align-middle">
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`${t("remove")} ${productName}`}
          title={`${t("remove")} ${productName}`}
          className="
            mx-auto
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            text-lg
            font-medium
            text-[var(--danger)]
            transition
            hover:bg-[var(--danger)]/10
            active:scale-95
          "
        >
          ×
        </button>
      </td>
    </tr>
  );
}