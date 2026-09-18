import { useLanguage } from "../../../context/LanguageContext";

export default function ItemRow({
  item,
  index,
  onChangeQuantity,
  onSetQuantity,
  onChangeRate,
  onRemove,
}) {
  const { t } = useLanguage();

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
      : "";

  return (
    <div
      className="
        grid
        min-w-[720px]
        grid-cols-[36px_minmax(220px,1fr)_130px_120px_110px_40px]
        items-center
        gap-3
        border-b
        border-[var(--border)]
        px-4
        py-3
        last:border-b-0
      "
    >
      <div className="text-sm text-[var(--muted)]">
        {index + 1}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-[var(--foreground)]">
          {item.name}
        </div>

        <div className="mt-0.5 truncate text-xs text-[var(--muted)]">
          {item.code} · {item.unit}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            onChangeQuantity(item.id, -1)
          }
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
          aria-label={`${t("decreaseQuantity")} ${item.name}`}
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
              onSetQuantity(item.id, value);
            }
          }}
          aria-label={`${t("quantityFor")} ${item.name}`}
          className="
            h-8
            w-12
            min-w-0
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
            onChangeQuantity(item.id, 1)
          }
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
          aria-label={`${t("increaseQuantity")} ${item.name}`}
        >
          +
        </button>
      </div>

      <input
        type="text"
        inputMode="decimal"
        value={item.rate}
        onChange={(event) => {
          const value = event.target.value;

          if (/^\d*\.?\d*$/.test(value)) {
            onChangeRate(item.id, value);
          }
        }}
        placeholder={t("rate")}
        aria-label={`${t("rateFor")} ${item.name}`}
        className="
          h-9
          w-full
          min-w-0
          rounded-md
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

      <div className="truncate text-sm font-medium text-[var(--foreground)]">
        {formattedPrice}
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`${t("remove")} ${item.name}`}
        title={`${t("remove")} ${item.name}`}
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-md
          text-lg
          font-medium
          text-[var(--danger)]
          transition
          hover:bg-[var(--danger)]/10
          hover:text-[var(--danger)]
          active:scale-95
        "
      >
        ×
      </button>
    </div>
  );
}