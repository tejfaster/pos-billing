import ItemRow from "./ItemRow";

export default function ItemList({
  items,
  onChangeQuantity,
  onSetQuantity,
  onChangeRate,
  onRemove,
}) {
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
        Search and select an item to add it to the list.
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
      <div className="min-w-[720px]">

        {/* Header */}
        <div
          className="
            grid
            grid-cols-[36px_minmax(220px,1fr)_130px_120px_110px_40px]
            items-center
            gap-3
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
          <div>#</div>

          <div>Item</div>

          <div>Qty</div>

          <div>Rate</div>

          <div>Price</div>

          <div></div>
        </div>

        {/* Items */}
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            onChangeQuantity={onChangeQuantity}
            onSetQuantity={onSetQuantity}
            onChangeRate={onChangeRate}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}