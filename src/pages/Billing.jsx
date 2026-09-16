import { useEffect, useState } from "react";

import ItemSearch from "../features/billing/components/ItemSearch";
import ItemList from "../features/billing/components/ItemList";
import BillPrint from "../features/billing/components/BillPrint";
import AccessibilityControls from "../components/common/AccessibilityControls";
import useBilling from "../features/billing/hooks/useBilling";

export default function Billing() {
  const {
    items,
    addItem,
    changeQuantity,
    setQuantity,
    changeRate,
    removeItem,
    clearItems,
    total,
  } = useBilling();

  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handleNewBill = () => {
    const confirmed = window.confirm(
      "Start a new bill? All selected items will be removed."
    );

    if (confirmed) {
      clearItems();
    }
  };

  const handlePrint = () => {
    if (items.length === 0 || isPrinting) {
      return;
    }

    setIsPrinting(true);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div className="no-print h-dvh w-full overflow-hidden">
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-4xl
            flex-col
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
          "
        >
          {/* Header */}
          <div
            className="
              mb-6
              flex
              shrink-0
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Create Bill
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Search and add items to your list.
              </p>
            </div>

            <AccessibilityControls />
          </div>

          {/* Search */}
          <div className="shrink-0">
            <ItemSearch onAdd={addItem} />
          </div>

          {/* Selected Items */}
          <section
            className="
              mt-8
              flex
              min-h-0
              flex-1
              flex-col
            "
          >
            {/* Section Header */}
            <div
              className="
                mb-3
                flex
                shrink-0
                items-center
                justify-between
                gap-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <h3 className="text-lg font-semibold">
                  Selected Items
                </h3>

                <span className="shrink-0 text-sm text-[var(--muted)]">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleNewBill}
                  className="
                    shrink-0
                    text-sm
                    text-[var(--danger)]
                    transition
                    hover:underline
                  "
                >
                  New Bill
                </button>
              )}
            </div>

            {/* Scrollable Items Area */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                pr-1
              "
            >
              <ItemList
                items={items}
                onChangeQuantity={changeQuantity}
                onSetQuantity={setQuantity}
                onChangeRate={changeRate}
                onRemove={removeItem}
              />
            </div>

            {/* Total */}
            {items.length > 0 && (
              <div
                className="
                  mt-4
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-t
                  border-[var(--border)]
                  pt-4
                "
              >
                <span className="text-base font-semibold">
                  Total
                </span>

                <span className="text-lg font-semibold">
                  {total !== null
                    ? `₹${total.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}`
                    : ""}
                </span>
              </div>
            )}

            {/* Print */}
            {items.length > 0 && (
              <div className="mt-6 shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="
                    w-full
                    rounded-lg
                    bg-[var(--foreground)]
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-[var(--background)]
                    transition
                    hover:opacity-90
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isPrinting
                    ? "Preparing Print..."
                    : "Print Item List"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Printable Bill */}
      <BillPrint items={items} total={total} />
    </>
  );
}