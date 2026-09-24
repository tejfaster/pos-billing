import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { useProducts } from "../../../context/ProductContext";

export default function ItemSearch({
  onAdd,
  selectedItems = [],
}) {
  const { t, getLocalizedName } = useLanguage();

  const { products, loading } = useProducts();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const suppressFocusOpenRef = useRef(false);

  /*
   * Products already present in the bill.
   *
   * These products are hidden from the search results
   * so the cashier does not accidentally add the same
   * product again.
   */
  const selectedProductIds = useMemo(() => {
    return new Set(
      selectedItems
        .map((item) => item?.product?.id)
        .filter(
          (id) =>
            id !== null &&
            id !== undefined
        )
        .map((id) => String(id))
    );
  }, [selectedItems]);

  /*
   * Search products.
   */
  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    const availableProducts = products.filter(
      (product) =>
        !selectedProductIds.has(
          String(product.id)
        )
    );

    /*
     * Empty search:
     * Show the first 40 available products.
     */
    if (!search) {
      return availableProducts.slice(0, 40);
    }

    /*
     * Search across:
     * - English/transliteration name
     * - Hindi name
     * - Brand
     * - English category
     * - Hindi category
     */
    return availableProducts
      .filter((product) => {
        const nameEn =
          product.nameEn?.toLowerCase() || "";

        const nameHi =
          product.nameHi?.toLowerCase() || "";

        const brand =
          product.brand?.toLowerCase() || "";

        const categoryEn =
          product.categoryNameEn?.toLowerCase() ||
          "";

        const categoryHi =
          product.categoryNameHi?.toLowerCase() ||
          "";

        return (
          nameEn.includes(search) ||
          nameHi.includes(search) ||
          brand.includes(search) ||
          categoryEn.includes(search) ||
          categoryHi.includes(search)
        );
      })
      .slice(0, 40);
  }, [
    products,
    query,
    selectedProductIds,
  ]);

  /*
   * Reset keyboard selection whenever
   * the search results change.
   */
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open, selectedItems.length]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Keep active keyboard item visible.
   */
  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const activeElement =
      listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );

    if (activeElement) {
      activeElement.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /*
   * Highlight matching search text.
   */
  const highlightText = (text) => {
    if (!text) {
      return "";
    }

    const search = query.trim();

    if (!search) {
      return text;
    }

    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const parts = text.split(
      new RegExp(`(${escapedSearch})`, "gi")
    );

    return parts.map((part, index) => {
      const isMatch =
        part.toLowerCase() ===
        search.toLowerCase();

      if (isMatch) {
        return (
          <mark
            key={index}
            className="
              rounded
              bg-[var(--accent-soft)]
              px-0.5
              text-[var(--foreground)]
            "
          >
            {part}
          </mark>
        );
      }

      return (
        <span key={index}>
          {part}
        </span>
      );
    });
  };

  /*
   * Add selected product.
   */
  const selectItem = (product) => {
    if (!product) {
      return;
    }

    onAdd(product);

    setQuery("");
    setActiveIndex(0);
    setOpen(false);

    /*
     * Prevent the focus event from immediately
     * reopening the dropdown after selection.
     */
    suppressFocusOpenRef.current = true;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /*
   * Keyboard navigation.
   */
  const handleKeyDown = (event) => {
    /*
     * Open the dropdown with ArrowDown or Enter.
     */
    if (
      !open &&
      (event.key === "ArrowDown" ||
        event.key === "Enter")
    ) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    /*
     * No search results.
     */
    if (results.length === 0) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }

      return;
    }

    /*
     * Down.
     */
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.min(
          current + 1,
          results.length - 1
        )
      );

      return;
    }

    /*
     * Up.
     */
    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.max(current - 1, 0)
      );

      return;
    }

    /*
     * Select.
     */
    if (event.key === "Enter") {
      event.preventDefault();

      selectItem(results[activeIndex]);

      return;
    }

    /*
     * Close.
     */
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (
            suppressFocusOpenRef.current
          ) {
            suppressFocusOpenRef.current = false;
            return;
          }

          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={t("searchProduct")}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="item-search-list"
        aria-autocomplete="list"
        aria-activedescendant={
          open && results.length > 0
            ? `item-option-${results[activeIndex]?.id}`
            : undefined
        }
        className="
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-3.5
          text-base
          text-[var(--foreground)]
          outline-none
          transition
          placeholder:text-[var(--muted)]
          focus:border-[var(--foreground)]
          focus:ring-2
          focus:ring-[var(--foreground)]/10
        "
      />

      {/* Dropdown */}
      {open && (
        <div
          id="item-search-list"
          ref={listRef}
          role="listbox"
          className="
            absolute
            z-50
            mt-2
            max-h-80
            w-full
            overflow-y-auto
            rounded-lg
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-lg
          "
        >
          {/* Loading */}
          {loading ? (
            <div
              className="
                px-4
                py-8
                text-center
                text-sm
                text-[var(--muted)]
              "
            >
              {t("loading")}
            </div>
          ) : results.length === 0 ? (
            /* No Results */
            <div
              className="
                px-4
                py-8
                text-center
                text-sm
                text-[var(--muted)]
              "
            >
              <div className="font-medium">
                {t("noProductsFound")}
              </div>

              <div className="mt-1 text-xs">
                {t("tryDifferentSearch")}
              </div>
            </div>
          ) : (
            /* Results */
            results.map((product, index) => {
              const productName =
                getLocalizedName(product);

              const categoryName =
                getLocalizedName({
                  nameEn:
                    product.categoryNameEn,
                  nameHi:
                    product.categoryNameHi,
                });

              return (
                <button
                  key={product.id}
                  id={`item-option-${product.id}`}
                  type="button"
                  role="option"
                  aria-selected={
                    index === activeIndex
                  }
                  data-index={index}
                  onMouseEnter={() =>
                    setActiveIndex(index)
                  }
                  onClick={() =>
                    selectItem(product)
                  }
                  className={`
                    block
                    w-full
                    border-b
                    border-[var(--border)]
                    px-4
                    py-3.5
                    text-left
                    transition
                    last:border-b-0
                    ${
                      index === activeIndex
                        ? "bg-[var(--muted)]/10"
                        : "hover:bg-[var(--muted)]/5"
                    }
                  `}
                >
                  <div
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-[var(--foreground)]
                    "
                  >
                    {highlightText(productName)}
                  </div>

                  <div
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-[var(--muted)]
                    "
                  >
                    {categoryName}

                    {product.brand && (
                      <>
                        {" · "}
                        {product.brand}
                      </>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}