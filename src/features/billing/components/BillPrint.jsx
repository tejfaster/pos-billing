import { useLanguage } from "../../../context/LanguageContext";
import { useUnits } from "../../../context/UnitContext";

export default function BillPrint({ items }) {
  const { t, getLocalizedName } = useLanguage();
  const { units } = useUnits();

  if (!items || items.length === 0) {
    return null;
  }

  const today = new Date().toLocaleDateString("en-IN");

  const getSelectedUnit = (unitId) => {
    if (!unitId) {
      return null;
    }

    return (
      units.find(
        (unit) => String(unit.id) === String(unitId)
      ) || null
    );
  };

  const getProductName = (product) => {
    if (!product) {
      return "";
    }

    const localizedName = getLocalizedName(product);

    return (
      localizedName ||
      product.nameEn ||
      product.nameHi ||
      product.name_en ||
      product.name_hi ||
      ""
    );
  };

  const getUnitName = (unit) => {
    if (!unit) {
      return "";
    }

    const localizedName = getLocalizedName(unit);

    const unitName =
      localizedName ||
      unit.nameEn ||
      unit.nameHi ||
      unit.name_en ||
      unit.name_hi ||
      "";

    if (!unitName) {
      return "";
    }

    return unit.shortName
      ? `${unitName} (${unit.shortName})`
      : unitName;
  };

  const allRatesAvailable = items.every(
    (item) =>
      item.rate !== "" &&
      item.rate !== null &&
      item.rate !== undefined &&
      !Number.isNaN(Number(item.rate))
  );

  const printTotal = allRatesAvailable
    ? items.reduce((sum, item) => {
        const qty = Number(item.qty) || 0;
        const rate = Number(item.rate) || 0;

        return sum + qty * rate;
      }, 0)
    : null;

  return (
    <div className="print-only print-page">
      <div className="print-container">

        {/* ================================
            HEADER
        ================================= */}

        <div className="print-header">
          <div className="print-date">
            {t("date")}: {today}
          </div>

          <div className="print-customer">
            <span>{t("customerForm")}:</span>

            <span className="customer-line"></span>
          </div>
        </div>

        {/* ================================
            ITEMS TABLE
        ================================= */}

        <table className="print-table">
          <thead>
            <tr>
              <th className="serial-column">
                {t("serialNumber")}
              </th>

              <th className="item-column">
                {t("item")}
              </th>

              <th className="quantity-column">
                {t("qty")}
              </th>

              <th className="unit-column">
                {t("unit")}
              </th>

              <th className="rate-column">
                {t("rate")}
              </th>

              <th className="price-column">
                {t("price")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              /*
               * Billing item structure:
               *
               * {
               *   product,
               *   qty,
               *   unit,
               *   rate
               * }
               */

              const product = item?.product;

              const productName =
                getProductName(product);

              const selectedUnit =
                getSelectedUnit(item?.unit);

              const unitName =
                getUnitName(selectedUnit) || "-";

              const qty =
                item?.qty !== undefined &&
                item?.qty !== null
                  ? item.qty
                  : "";

              const hasRate =
                item?.rate !== "" &&
                item?.rate !== null &&
                item?.rate !== undefined &&
                !Number.isNaN(Number(item.rate));

              const rate = hasRate
                ? Number(item.rate)
                : null;

              const numericQty =
                Number(item?.qty);

              const price =
                rate !== null &&
                Number.isFinite(numericQty)
                  ? numericQty * rate
                  : null;

              return (
                <tr
                  key={
                    product?.id ??
                    item?.id ??
                    index
                  }
                >
                  {/* Serial Number */}
                  <td className="text-center">
                    {index + 1}
                  </td>

                  {/* Product */}
                  <td>
                    {productName}

                    {product?.brand && (
                      <span className="print-brand">
                        {" "}
                        — {product.brand}
                      </span>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="text-center">
                    {qty}
                  </td>

                  {/* Unit */}
                  <td className="text-center">
                    {unitName}
                  </td>

                  {/* Rate */}
                  <td className="text-right">
                    {rate !== null
                      ? `₹${rate.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""}
                  </td>

                  {/* Final Price */}
                  <td className="text-right">
                    {price !== null
                      ? `₹${price.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ================================
            TOTAL
        ================================= */}

        <div className="print-total">
          <span>
            {t("total")}:
          </span>

          <span className="print-total-value">
            {printTotal !== null
              ? `₹${printTotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
              : ""}
          </span>
        </div>

      </div>
    </div>
  );
}