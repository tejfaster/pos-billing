import { useEffect, useState } from "react";

import ItemSearch from "../features/billing/components/ItemSearch";
import ItemList from "../features/billing/components/ItemList";
import BillPrint from "../features/billing/components/BillPrint";

import useBilling from "../features/billing/hooks/useBilling";

import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useUnits } from "../context/UnitContext";

import { saveBill } from "../offline/billStorage";
import { generateBillNumber } from "../offline/billNumber";

export default function Billing({
  editingBill = null,
  onClearEditingBill,
}) {
  const {
    items,
    addItem,
    updateQuantity,
    setQuantity,
    updateUnit,
    updateRate,
    removeItem,
    clearBill,
    loadBill,
    total,
  } = useBilling();

  const { t } = useLanguage();
  const { user } = useAuth();
  const { units } = useUnits();

  const [isPrinting, setIsPrinting] = useState(false);
  const [printBill, setPrintBill] = useState(null);
  const [isLoadingBill, setIsLoadingBill] = useState(false);

  // ---------------------------------
  // Load Existing Bill For Editing
  // ---------------------------------

  useEffect(() => {
    if (!editingBill) {
      return;
    }

    setIsLoadingBill(true);

    try {
      loadBill(editingBill);
    } catch (error) {
      console.error(
        "Failed to load bill for editing:",
        error
      );
    } finally {
      setIsLoadingBill(false);
    }
  }, [editingBill, loadBill]);

  // ---------------------------------
  // Print Listener
  // ---------------------------------

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setPrintBill(null);
      clearBill();

      if (onClearEditingBill) {
        onClearEditingBill();
      }
    };

    window.addEventListener(
      "afterprint",
      handleAfterPrint
    );

    return () => {
      window.removeEventListener(
        "afterprint",
        handleAfterPrint
      );
    };
  }, [clearBill, onClearEditingBill]);

  // ---------------------------------
  // New Bill / Cancel Current Bill
  // ---------------------------------

  const handleNewBill = () => {
    const confirmed = window.confirm(
      t("newBillConfirmation")
    );

    if (!confirmed) {
      return;
    }

    // Discard the current unsaved bill.
    // This does NOT create or save anything
    // in Bill History.
    clearBill();

    // Exit edit mode if we were editing
    // an existing bill.
    if (onClearEditingBill) {
      onClearEditingBill();
    }
  };

  // ---------------------------------
  // Unit Helpers
  // ---------------------------------

  const getSelectedUnit = (unitId) => {
    if (!unitId) {
      return null;
    }

    return (
      units.find(
        (unit) =>
          String(unit.id) ===
          String(unitId)
      ) || null
    );
  };

  const getUnitSnapshot = (unitId) => {
    const unit =
      getSelectedUnit(unitId);

    if (!unit) {
      return null;
    }

    return {
      id: unit.id,

      nameEn:
        unit.nameEn ||
        unit.name_en ||
        "",

      nameHi:
        unit.nameHi ||
        unit.name_hi ||
        "",

      shortName:
        unit.shortName ||
        unit.short_name ||
        "",

      type: unit.type || "",
    };
  };

  // ---------------------------------
  // Bill Snapshot
  // ---------------------------------

  const createBillSnapshot = () => {
    return items.map((item) => {
      const product =
        item?.product || {};

      const unit =
        getUnitSnapshot(
          item?.unit
        );

      const quantity =
        item?.qty ?? "";

      const rate =
        item?.rate ?? "";

      const numericQuantity =
        Number(quantity);

      const numericRate =
        Number(rate);

      const price =
        Number.isFinite(
          numericQuantity
        ) &&
        Number.isFinite(
          numericRate
        )
          ? numericQuantity *
            numericRate
          : null;

      return {
        productId:
          product.id ?? null,

        nameEn:
          product.nameEn ||
          product.name_en ||
          "",

        nameHi:
          product.nameHi ||
          product.name_hi ||
          "",

        brand:
          product.brand || "",

        quantity,

        unitId:
          unit?.id ??
          item?.unit ??
          null,

        unitNameEn:
          unit?.nameEn || "",

        unitNameHi:
          unit?.nameHi || "",

        unitShortName:
          unit?.shortName || "",

        unitType:
          unit?.type || "",

        rate,

        price,
      };
    });
  };

  // ---------------------------------
  // Print / Complete Bill
  // ---------------------------------

  const handlePrint = async () => {
    if (
      items.length === 0 ||
      isPrinting ||
      isLoadingBill
    ) {
      return;
    }

    if (!user?.id) {
      console.error(
        "Cannot create bill: authenticated user is missing."
      );
      return;
    }

    if (!user?.bill_prefix) {
      console.error(
        "Cannot create bill: user bill prefix is missing."
      );
      return;
    }

    if (total === null) {
      return;
    }

    setIsPrinting(true);

    try {
      /*
       * EDIT EXISTING BILL
       *
       * Keep the original:
       * - localId
       * - bill number
       * - sequence number
       * - created date
       *
       * We do NOT generate a new number.
       */

      if (editingBill) {
        const updatedBill = {
          ...editingBill,

          items:
            createBillSnapshot(),

          total,

          syncStatus:
            "pending",

          updatedAt:
            new Date().toISOString(),
        };

        await saveBill(
          updatedBill
        );

        setPrintBill(
          updatedBill
        );
      } else {
        /*
         * NEW BILL
         *
         * Generate a new bill number.
         */

        const billNumberData =
          await generateBillNumber({
            userId: user.id,
            prefix:
              user.bill_prefix,
          });

        const generatedByName =
          `${user.first_name || ""} ${
            user.last_name || ""
          }`.trim();

        const bill = {
          localId:
            crypto.randomUUID(),

          billNumber:
            billNumberData.billNumber,

          sequenceNumber:
            billNumberData.sequenceNumber,

          userId:
            user.id,

          generatedBy: {
            userId: user.id,
            name: generatedByName,
          },

          createdAt:
            new Date().toISOString(),

          customerName: "",

          items:
            createBillSnapshot(),

          total,

          syncStatus:
            "pending",
        };

        await saveBill(bill);

        setPrintBill(bill);
      }

      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error(
        "Failed to create/update bill:",
        error
      );

      setIsPrinting(false);
    }
  };

  // ---------------------------------
  // Render
  // ---------------------------------

  return (
    <>
      <div className="no-print h-full w-full overflow-hidden">
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
                {editingBill
                  ? "Edit Bill"
                  : t("createBill")}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {editingBill
                  ? `Editing ${editingBill.billNumber}`
                  : t(
                      "searchAndAddItems"
                    )}
              </p>
            </div>

            {editingBill && (
              <button
                type="button"
                onClick={
                  handleNewBill
                }
                className="
                  shrink-0
                  text-sm
                  text-[var(--danger)]
                  transition
                  hover:underline
                "
              >
                {t("newBill")}
              </button>
            )}
          </div>

          {/* Loading Existing Bill */}

          {isLoadingBill ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-[var(--muted)]">
                Loading bill...
              </p>
            </div>
          ) : (
            <>
              {/* Product Search */}

              <div className="shrink-0">
                <ItemSearch
                  onAdd={addItem}
                />
              </div>

              {/* Items */}

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
                      {t(
                        "selectedItems"
                      )}
                    </h3>

                    <span className="shrink-0 text-sm text-[var(--muted)]">
                      {items.length}{" "}
                      {items.length === 1
                        ? t("item")
                        : t("items")}
                    </span>
                  </div>

                  {items.length > 0 &&
                    !editingBill && (
                      <button
                        type="button"
                        onClick={
                          handleNewBill
                        }
                        className="
                          shrink-0
                          text-sm
                          text-[var(--danger)]
                          transition
                          hover:underline
                        "
                      >
                        {t("newBill")}
                      </button>
                    )}
                </div>

                {/* Item List */}

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
                    onChangeQuantity={
                      updateQuantity
                    }
                    onSetQuantity={
                      setQuantity
                    }
                    onChangeUnit={
                      updateUnit
                    }
                    onChangeRate={
                      updateRate
                    }
                    onRemove={
                      removeItem
                    }
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
                      {t("total")}
                    </span>

                    <span className="text-lg font-semibold">
                      {total !== null
                        ? `₹${total.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : ""}
                    </span>
                  </div>
                )}

                {/* Print / Update */}

                {items.length > 0 && (
                  <div className="mt-6 shrink-0">
                    <button
                      type="button"
                      onClick={
                        handlePrint
                      }
                      disabled={
                        isPrinting ||
                        total === null ||
                        isLoadingBill
                      }
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
                        ? t(
                            "preparingPrint"
                          )
                        : editingBill
                        ? "Update & Print"
                        : t(
                            "printItemList"
                          )}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Print-only bill */}

      <BillPrint
        bill={printBill}
      />
    </>
  );
}