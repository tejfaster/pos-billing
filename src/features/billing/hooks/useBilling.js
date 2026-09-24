import { useCallback, useMemo, useState } from "react";

export default function useBilling() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product?.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.product?.id === product.id
            ? {
                ...item,
                qty: Number(item.qty || 0) + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          qty: 1,
          unit: "",
          rate: "",
        },
      ];
    });
  }, []);

  /*
   * Increase / decrease quantity
   *
   * delta:
   * +1 = increase
   * -1 = decrease
   */
  const updateQuantity = useCallback(
    (productId, delta) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.product?.id !== productId) {
            return item;
          }

          const currentQty = Number(item.qty);

          if (!Number.isFinite(currentQty)) {
            return {
              ...item,
              qty: 1,
            };
          }

          const nextQty = currentQty + Number(delta);

          return {
            ...item,
            qty: Math.max(0, nextQty),
          };
        })
      );
    },
    []
  );

  /*
   * Direct quantity input
   *
   * Example:
   * 1
   * 1.5
   * 25
   * 0.5
   */
  const setQuantity = useCallback(
    (productId, value) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product?.id === productId
            ? {
                ...item,
                qty: value,
              }
            : item
        )
      );
    },
    []
  );

  const updateUnit = useCallback(
    (productId, unitId) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product?.id === productId
            ? {
                ...item,
                unit: unitId,
              }
            : item
        )
      );
    },
    []
  );

  const updateRate = useCallback(
    (productId, value) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product?.id === productId
            ? {
                ...item,
                rate: value,
              }
            : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId) => {
    setItems((prev) =>
      prev.filter(
        (item) => item.product?.id !== productId
      )
    );
  }, []);

  const clearBill = useCallback(() => {
    setItems([]);
  }, []);

  const getItemPrice = useCallback((item) => {
    const qty = Number(item.qty);
    const rate = Number(item.rate);

    if (!Number.isFinite(qty) || !Number.isFinite(rate)) {
      return null;
    }

    if (qty <= 0 || rate < 0) {
      return null;
    }

    return qty * rate;
  }, []);

  const total = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    const prices = items.map(getItemPrice);

    const allValid = prices.every(
      (price) => price !== null
    );

    if (!allValid) {
      return null;
    }

    return prices.reduce(
      (sum, price) => sum + price,
      0
    );
  }, [items, getItemPrice]);

  return {
    items,

    addItem,

    // +/- buttons
    updateQuantity,

    // Direct quantity input
    setQuantity,

    updateUnit,
    updateRate,
    removeItem,
    clearBill,

    getItemPrice,
    total,
  };
}