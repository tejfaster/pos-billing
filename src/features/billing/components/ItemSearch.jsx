import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS } from "../../../data/products";

export default function ItemSearch({ onAdd }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Prevent the dropdown from reopening when
  // the input receives focus after selecting an item.
  const suppressFocusOpenRef = useRef(false);

  /*
   * Filter products based on:
   * - Item name
   * - Item code
   * - Category
   */
  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return PRODUCTS.slice(0, 40);
    }

    return PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.code.toLowerCase().includes(search) ||
        product.cat.toLowerCase().includes(search)
      );
    }).slice(0, 40);
  }, [query]);

  /*
   * Reset active result when
   * query or dropdown state changes.
   */
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Keep active keyboard result visible.
   */
  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const activeElement = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    );

    if (activeElement) {
      activeElement.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  /*
   * Highlight matching text.
   */
  const highlightText = (text) => {
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
        part.toLowerCase() === search.toLowerCase();

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
   * Select an item.
   */
  const selectItem = (product) => {
    if (!product) {
      return;
    }

    // Add item to billing list.
    onAdd(product);

    // Clear search.
    setQuery("");

    // Reset keyboard selection.
    setActiveIndex(0);

    // IMPORTANT:
    // Close dropdown after selecting.
    setOpen(false);

    /*
     * Keep cursor in search field so the user
     * can immediately search for the next item.
     *
     * But don't reopen the dropdown automatically.
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
     * Open dropdown if currently closed.
     */
    if (
      !open &&
      (event.key === "ArrowDown" || event.key === "Enter")
    ) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    /*
     * Nothing to navigate if there
     * are no search results.
     */
    if (results.length === 0) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }

      return;
    }

    /*
     * Move down.
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
     * Move up.
     */
    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.max(current - 1, 0)
      );

      return;
    }

    /*
     * Select highlighted item.
     */
    if (event.key === "Enter") {
      event.preventDefault();

      selectItem(results[activeIndex]);

      return;
    }

    /*
     * Close dropdown.
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
          /*
           * After selecting an item, the input is
           * automatically focused but the dropdown
           * should remain closed.
           */
          if (suppressFocusOpenRef.current) {
            suppressFocusOpenRef.current = false;
            return;
          }

          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search item name or code..."
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
          {/* Empty State */}
          {results.length === 0 ? (
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
                No items found
              </div>

              <div className="mt-1 text-xs">
                Try a different item name or code.
              </div>
            </div>
          ) : (
            results.map((product, index) => (
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
                {/* Item Name */}
                <div
                  className="
                    truncate
                    text-sm
                    font-medium
                    text-[var(--foreground)]
                  "
                >
                  {highlightText(product.name)}
                </div>

                {/* Item Details */}
                <div
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-[var(--muted)]
                  "
                >
                  {highlightText(product.code)}
                  {" · "}
                  {product.cat}
                  {" · "}
                  {product.unit}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}