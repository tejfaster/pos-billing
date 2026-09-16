import { useCallback, useMemo, useState } from "react";

export default function useBilling() {
  const [items, setItems] = useState([]);

  /*
   * Add item
   */
  const addItem = useCallback((product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          qty: 1,
          rate: "",
        },
      ];
    });
  }, []);

  /*
   * Change quantity by +/- buttons
   */
  const changeQuantity = useCallback((id, delta) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + delta,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  /*
   * Set quantity directly from input.
   *
   * Quantity is stored as a string while editing
   * so values such as "0.5" can be entered naturally.
   */
  const setQuantity = useCallback((id, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: quantity,
            }
          : item
      )
    );
  }, []);

  /*
   * Change rate
   */
  const changeRate = useCallback((id, rate) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              rate,
            }
          : item
      )
    );
  }, []);

  /*
   * Remove item
   */
  const removeItem = useCallback((id) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }, []);

  /*
   * Clear current bill
   */
  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  /*
   * Calculate total only when every item
   * has a valid rate.
   */
  const total = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    const allRatesAvailable = items.every(
      (item) =>
        item.rate !== "" &&
        !Number.isNaN(Number(item.rate))
    );

    if (!allRatesAvailable) {
      return null;
    }

    return items.reduce((sum, item) => {
      return sum + Number(item.qty) * Number(item.rate);
    }, 0);
  }, [items]);

  return {
    items,
    addItem,
    changeQuantity,
    setQuantity,
    changeRate,
    removeItem,
    clearItems,
    total,
  };
}