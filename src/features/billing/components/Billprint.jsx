import { useLanguage } from "../../../context/LanguageContext";

export default function BillPrint({ items }) {
  const { t } = useLanguage();

  if (!items || items.length === 0) {
    return null;
  }

  const today = new Date().toLocaleDateString("en-IN");

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
        <div className="print-header">
          <div className="print-date">
            {t("date")}: {today}
          </div>

          <div className="print-customer">
            <span>{t("customerForm")}:</span>
            <span className="customer-line"></span>
          </div>
        </div>

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
              const qty = Number(item.qty) || 0;

              const hasRate =
                item.rate !== "" &&
                item.rate !== null &&
                item.rate !== undefined &&
                !Number.isNaN(Number(item.rate));

              const rate = hasRate
                ? Number(item.rate)
                : null;

              const price =
                rate !== null ? qty * rate : null;

              return (
                <tr key={item.id}>
                  <td className="text-center">
                    {index + 1}
                  </td>

                  <td>{item.name}</td>

                  <td className="text-center">
                    {item.qty}
                  </td>

                  <td className="text-center">
                    {rate !== null
                      ? `₹${rate.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>

                  <td className="text-center">
                    {price !== null
                      ? `₹${price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="print-total">
          <span>{t("total")}:</span>

          <span className="print-total-value">
            {printTotal !== null
              ? `₹${printTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}