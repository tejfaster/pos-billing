import { useEffect, useState } from "react";

import {
  getBills,
  deleteBill,
} from "../offline/billStorage";

import BillPrint from "../features/billing/components/BillPrint";

import { useLanguage } from "../context/LanguageContext";

export default function BillHistory({
  onEditBill,
}) {
  const { t, language } = useLanguage();

  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBill, setSelectedBill] =
    useState(null);

  const [isViewing, setIsViewing] =
    useState(false);

  const [isPrinting, setIsPrinting] =
    useState(false);

  // ---------------------------------
  // Load Bill History
  // ---------------------------------

  useEffect(() => {
    let isMounted = true;

    async function loadBills() {
      try {
        const storedBills =
          await getBills();

        const sortedBills = [
          ...storedBills,
        ].sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        );

        if (isMounted) {
          setBills(sortedBills);
        }
      } catch (error) {
        console.error(
          "Failed to load bill history:",
          error
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBills();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------
  // Print Listener
  // ---------------------------------

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setSelectedBill(null);
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
  }, []);

  // ---------------------------------
  // Formatting
  // ---------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const formatTotal = (total) => {
    if (
      total === null ||
      total === undefined ||
      total === ""
    ) {
      return "-";
    }

    return `₹${Number(
      total
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const getProductName = (item) => {
    if (!item) {
      return "";
    }

    if (language === "hi") {
      return (
        item.nameHi ||
        item.nameEn ||
        ""
      );
    }

    return (
      item.nameEn ||
      item.nameHi ||
      ""
    );
  };

  const getUnitName = (item) => {
    if (!item) {
      return "";
    }

    return (
      item.unitShortName ||
      ""
    );
  };

  // ---------------------------------
  // View
  // ---------------------------------

  const handleView = (bill) => {
    setSelectedBill(bill);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    setIsViewing(false);
    setSelectedBill(null);
  };

  // ---------------------------------
  // Edit
  // ---------------------------------

  const handleEdit = (bill) => {
    if (!bill) {
      return;
    }

    if (onEditBill) {
      onEditBill(bill);
    }
  };

  // ---------------------------------
  // Reprint
  // ---------------------------------

  const handlePrint = (bill) => {
    if (!bill) {
      return;
    }

    setSelectedBill(bill);
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  // ---------------------------------
  // Delete One Bill
  // ---------------------------------

  const handleDelete = async (bill) => {
    if (!bill?.localId) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete bill ${bill.billNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBill(
        bill.localId
      );

      setBills((prev) =>
        prev.filter(
          (item) =>
            item.localId !==
            bill.localId
        )
      );

      if (
        selectedBill?.localId ===
        bill.localId
      ) {
        setSelectedBill(null);
        setIsViewing(false);
      }
    } catch (error) {
      console.error(
        "Failed to delete bill:",
        error
      );
    }
  };

  // ---------------------------------
  // Delete All Bills
  // ---------------------------------

  const handleDeleteAll = async () => {
    if (bills.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete all ${bills.length} bills from history? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      for (const bill of bills) {
        await deleteBill(
          bill.localId
        );
      }

      setBills([]);
      setSelectedBill(null);
      setIsViewing(false);
    } catch (error) {
      console.error(
        "Failed to delete all bills:",
        error
      );
    }
  };

  return (
    <>
      {/* =================================
          BILL HISTORY PAGE
      ================================= */}

      <div className="no-print h-full w-full overflow-hidden">
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-6xl
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
              flex
              shrink-0
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("billHistory") ||
                  "Bill History"}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {t(
                  "billHistorySubtitle"
                ) ||
                  "View and reprint previous bills."}
              </p>
            </div>

            {bills.length > 0 && (
              <button
                type="button"
                onClick={
                  handleDeleteAll
                }
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-[var(--danger)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[var(--danger)]
                  transition
                  hover:bg-[var(--danger)]
                  hover:text-white
                "
              >
                Delete All
              </button>
            )}
          </div>

          {/* Content */}

          <div
            className="
              mt-8
              min-h-0
              flex-1
              overflow-y-auto
            "
          >
            {isLoading ? (
              <div className="py-10 text-center text-sm text-[var(--muted)]">
                Loading...
              </div>
            ) : bills.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-6
                  py-12
                  text-center
                "
              >
                <p className="text-base font-medium">
                  No bills found
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Bills you complete and
                  print will appear here.
                </p>
              </div>
            ) : (
              /*
               * REAL TABLE
               *
               * The table itself controls the
               * column alignment.
               *
               * On smaller screens it scrolls
               * horizontally instead of
               * squeezing the columns.
               */

              <div
                className="
                  overflow-x-auto
                  rounded-xl
                  border
                  border-[var(--border)]
                "
              >
                <table
                  className="
                    w-full
                    min-w-[1050px]
                    border-collapse
                    text-sm
                  "
                >
                  <colgroup>
                    <col className="w-[180px]" />
                    <col className="w-[150px]" />
                    <col className="w-[200px]" />
                    <col className="w-[130px]" />
                    <col className="w-[400px]" />
                  </colgroup>

                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          font-semibold
                        "
                      >
                        {t("billNumber") ||
                          "Bill Number"}
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          font-semibold
                        "
                      >
                        {t("date") ||
                          "Date"}
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          font-semibold
                        "
                      >
                        {t("generatedBy") ||
                          "Generated By"}
                      </th>

                      <th
                        className="
                          whitespace-nowrap
                          px-6
                          py-4
                          text-right
                          font-semibold
                        "
                      >
                        {t("total") ||
                          "Total"}
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          font-semibold
                        "
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bills.map(
                      (bill) => (
                        <tr
                          key={
                            bill.localId
                          }
                          className="
                            border-b
                            border-[var(--border)]
                            last:border-b-0
                          "
                        >
                          {/* Bill Number */}

                          <td
                            className="
                              whitespace-nowrap
                              px-6
                              py-5
                              font-medium
                            "
                          >
                            {bill.billNumber ||
                              "-"}
                          </td>

                          {/* Date */}

                          <td
                            className="
                              whitespace-nowrap
                              px-6
                              py-5
                              text-[var(--muted)]
                            "
                          >
                            {formatDate(
                              bill.createdAt
                            )}
                          </td>

                          {/* Generated By */}

                          <td
                            className="
                              px-6
                              py-5
                              text-[var(--muted)]
                            "
                          >
                            <span className="block truncate">
                              {bill
                                .generatedBy
                                ?.name ||
                                "-"}
                            </span>
                          </td>

                          {/* Total */}

                          <td
                            className="
                              whitespace-nowrap
                              px-6
                              py-5
                              text-right
                              font-medium
                            "
                          >
                            {formatTotal(
                              bill.total
                            )}
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">
                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >
                              {/* View */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleView(
                                    bill
                                  )
                                }
                                className="
                                  rounded-md
                                  border
                                  border-[var(--border)]
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-medium
                                  transition
                                  hover:bg-[var(--surface)]
                                "
                              >
                                View
                              </button>

                              {/* Edit */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    bill
                                  )
                                }
                                className="
                                  rounded-md
                                  border
                                  border-[var(--border)]
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-medium
                                  transition
                                  hover:bg-[var(--surface)]
                                "
                              >
                                Edit
                              </button>

                              {/* Reprint */}

                              <button
                                type="button"
                                onClick={() =>
                                  handlePrint(
                                    bill
                                  )
                                }
                                className="
                                  rounded-md
                                  bg-[var(--foreground)]
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-medium
                                  text-[var(--background)]
                                  transition
                                  hover:opacity-90
                                "
                              >
                                Reprint
                              </button>

                              {/* Delete */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    bill
                                  )
                                }
                                className="
                                  rounded-md
                                  border
                                  border-[var(--danger)]
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-medium
                                  text-[var(--danger)]
                                  transition
                                  hover:bg-[var(--danger)]
                                  hover:text-white
                                "
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================
          VIEW BILL MODAL
      ================================= */}

      {isViewing &&
        selectedBill && (
          <div
            className="
              no-print
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/60
              p-4
            "
          >
            <div
              className="
                flex
                max-h-[90vh]
                w-full
                max-w-3xl
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                shadow-2xl
              "
            >
              {/* Modal Header */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-[var(--border)]
                  px-5
                  py-4
                "
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedBill.billNumber}
                  </h3>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatDate(
                      selectedBill.createdAt
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseView
                  }
                  className="
                    rounded-md
                    px-3
                    py-1.5
                    text-sm
                    text-[var(--muted)]
                    transition
                    hover:bg-[var(--surface)]
                  "
                >
                  Close
                </button>
              </div>

              {/* Modal Content */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  p-5
                "
              >
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    border-b
                    border-[var(--border)]
                    pb-4
                  "
                >
                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      {t(
                        "generatedBy"
                      ) ||
                        "Generated By"}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedBill
                        .generatedBy
                        ?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      {t("total") ||
                        "Total"}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatTotal(
                        selectedBill.total
                      )}
                    </p>
                  </div>
                </div>

                {/* Items */}

                <div className="mt-5">
                  <div
                    className="
                      grid
                      grid-cols-[auto_1fr_auto_auto_auto]
                      gap-3
                      border-b
                      border-[var(--border)]
                      pb-3
                      text-xs
                      font-semibold
                    "
                  >
                    <div>#</div>

                    <div>
                      {t("item") ||
                        "Item"}
                    </div>

                    <div className="text-right">
                      {t("qty") ||
                        "Qty"}
                    </div>

                    <div className="text-right">
                      {t("rate") ||
                        "Rate"}
                    </div>

                    <div className="text-right">
                      {t("price") ||
                        "Price"}
                    </div>
                  </div>

                  <div>
                    {(
                      selectedBill.items ||
                      []
                    ).map(
                      (
                        item,
                        index
                      ) => {
                        const quantity =
                          Number(
                            item.quantity
                          );

                        const rate =
                          Number(
                            item.rate
                          );

                        const price =
                          Number.isFinite(
                            quantity
                          ) &&
                          Number.isFinite(
                            rate
                          )
                            ? quantity *
                              rate
                            : null;

                        return (
                          <div
                            key={
                              item.productId ??
                              index
                            }
                            className="
                              grid
                              grid-cols-[auto_1fr_auto_auto_auto]
                              gap-3
                              border-b
                              border-[var(--border)]
                              py-3
                              text-sm
                            "
                          >
                            <div className="text-[var(--muted)]">
                              {index +
                                1}
                            </div>

                            <div>
                              <div className="font-medium">
                                {getProductName(
                                  item
                                )}
                              </div>

                              {getUnitName(
                                item
                              ) && (
                                <div className="mt-0.5 text-xs text-[var(--muted)]">
                                  {getUnitName(
                                    item
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              {item.quantity ??
                                ""}
                            </div>

                            <div className="text-right">
                              {item.rate !==
                                "" &&
                              item.rate !==
                                null &&
                              item.rate !==
                                undefined
                                ? `₹${Number(
                                    item.rate
                                  ).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}`
                                : "-"}
                            </div>

                            <div className="text-right font-medium">
                              {price !==
                              null
                                ? `₹${price.toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}`
                                : "-"}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Total */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    text-base
                    font-semibold
                  "
                >
                  <span>
                    {t("total") ||
                      "Total"}
                  </span>

                  <span>
                    {formatTotal(
                      selectedBill.total
                    )}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}

              <div
                className="
                  flex
                  shrink-0
                  justify-end
                  gap-3
                  border-t
                  border-[var(--border)]
                  px-5
                  py-4
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedBill
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-[var(--danger)]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-[var(--danger)]
                    transition
                    hover:bg-[var(--danger)]
                    hover:text-white
                  "
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePrint(
                      selectedBill
                    )
                  }
                  className="
                    rounded-lg
                    bg-[var(--foreground)]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-[var(--background)]
                    transition
                    hover:opacity-90
                  "
                >
                  Reprint
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =================================
          PRINT-ONLY OLD BILL
      ================================= */}

      {isPrinting &&
        selectedBill && (
          <BillPrint
            bill={selectedBill}
          />
        )}
    </>
  );
}