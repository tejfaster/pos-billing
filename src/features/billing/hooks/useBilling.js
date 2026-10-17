
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

  const updateQuantity = useCallback((productId, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product?.id !== productId) {
          return item;
        }

        const currentQty = Number(item.qty);

        if (!Number.isFinite(currentQty)) {
          return { ...item, qty: 1 };
        }

        const nextQty = currentQty + Number(delta);

        return {
          ...item,
          qty: Math.max(0, nextQty),
        };
      })
    );
  }, []);

  const setQuantity = useCallback((productId, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product?.id === productId
          ? { ...item, qty: value }
          : item
      )
    );
  }, []);

  const updateUnit = useCallback((productId, unitId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product?.id === productId
          ? { ...item, unit: unitId }
          : item
      )
    );
  }, []);

  const updateRate = useCallback((productId, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product?.id === productId
          ? { ...item, rate: value }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) =>
      prev.filter((item) => item.product?.id !== productId)
    );
  }, []);

  const clearBill = useCallback(() => {
    setItems([]);
  }, []);

  const loadBill = useCallback((bill) => {
    if (!bill) {
      return;
    }

    const loadedItems = (bill.items || []).map((item) => ({
      product: {
        id: item.productId,
        nameEn: item.nameEn || "",
        nameHi: item.nameHi || "",
        brand: item.brand || "",
        unitId: item.unitId ?? null,
        unitNameEn: item.unitNameEn || "",
        unitNameHi: item.unitNameHi || "",
        unitShortName: item.unitShortName || "",
        unitType: item.unitType || "",
      },
      qty: item.quantity ?? "",
      unit: item.unitId ?? "",
      rate: item.rate ?? "",
    }));

    setItems(loadedItems);
  }, []);

  const getItemPrice = useCallback((item) => {
    const hasQuantity =
      item.qty !== "" &&
      item.qty !== null &&
      item.qty !== undefined &&
      Number.isFinite(Number(item.qty));

    const hasRate =
      item.rate !== "" &&
      item.rate !== null &&
      item.rate !== undefined &&
      Number.isFinite(Number(item.rate));

    if (!hasQuantity || !hasRate) {
      return null;
    }

    const qty = Number(item.qty);
    const rate = Number(item.rate);

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
    updateQuantity,
    setQuantity,
    updateUnit,
    updateRate,
    removeItem,
    clearBill,
    loadBill,
    getItemPrice,
    total,
  };
}
