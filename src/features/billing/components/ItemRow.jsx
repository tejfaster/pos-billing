export default function ItemRow({
  item,
  index,
  onChangeQuantity,
  onSetQuantity,
  onChangeRate,
  onRemove,
}) {
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
      {/* S.No */}
      <div className="text-sm text-[var(--muted)]">
        {index + 1}
      </div>

      {/* Item */}
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-[var(--foreground)]">
          {item.name}
        </div>

        <div className="mt-0.5 truncate text-xs text-[var(--muted)]">
          {item.code} · {item.unit}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-1">
        {/* Decrease */}
        <button
          type="button"
          onClick={() => onChangeQuantity(item.id, -1)}
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
          aria-label={`Decrease quantity of ${item.name}`}
        >
          −
        </button>

        {/* Editable Quantity */}
        <input
          type="text"
          inputMode="decimal"
          value={item.qty}
          onChange={(event) => {
            const value = event.target.value;

            /*
             * Allow:
             * 1
             * 0.5
             * 1.25
             * 10.5
             */
            if (/^\d*\.?\d*$/.test(value)) {
              onSetQuantity(item.id, value);
            }
          }}
          aria-label={`Quantity for ${item.name}`}
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

        {/* Increase */}
        <button
          type="button"
          onClick={() => onChangeQuantity(item.id, 1)}
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
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
      </div>

      {/* Rate */}
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
        placeholder="Rate"
        aria-label={`Rate for ${item.name}`}
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

      {/* Price */}
      <div className="truncate text-sm font-medium text-[var(--foreground)]">
        {formattedPrice}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        title={`Remove ${item.name}`}
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