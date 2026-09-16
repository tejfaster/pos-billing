export default function BillPrint({ items }) {
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

        {/* Date + Customer */}
        <div className="print-header">
          <div className="print-date">
            Date: {today}
          </div>

          <div className="print-customer">
            <span>Customer / Form:</span>
            <span className="customer-line"></span>
          </div>
        </div>

        {/* Bill Table */}
        <table className="print-table">
          <thead>
            <tr>
              <th className="serial-column">
                S.No
              </th>

              <th className="item-column">
                Item
              </th>

              <th className="quantity-column">
                Qty
              </th>

              <th className="rate-column">
                Rate
              </th>

              <th className="price-column">
                Price
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
                rate !== null
                  ? qty * rate
                  : null;

              return (
                <tr key={item.id}>
                  {/* S.No */}
                  <td className="text-center">
                    {index + 1}
                  </td>

                  {/* Item */}
                  <td>
                    {item.name}
                  </td>

                  {/* Quantity */}
                  <td className="text-center">
                    {item.qty}
                  </td>

                  {/* Rate */}
                  <td className="text-center">
                    {rate !== null
                      ? rate.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })
                      : ""}
                  </td>

                  {/* Price */}
                  <td className="text-center">
                    {price !== null
                      ? price.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })
                      : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div className="print-total">
          <span>Total:</span>

          <span className="print-total-value">
            {printTotal !== null
              ? printTotal.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })
              : ""}
          </span>
        </div>

      </div>
    </div>
  );
}