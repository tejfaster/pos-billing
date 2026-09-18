import { useEffect, useMemo, useRef, useState } from "react";

import { PRODUCTS } from "../../../data/products";
import { useLanguage } from "../../../context/LanguageContext";

export default function ItemSearch({ onAdd }) {
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const suppressFocusOpenRef = useRef(false);

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return PRODUCTS.slice(0, 40);
    }

    return PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.code.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }).slice(0, 40);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

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

      return <span key={index}>{part}</span>;
    });
  };

  const selectItem = (product) => {
    if (!product) {
      return;
    }

    onAdd(product);

    setQuery("");
    setActiveIndex(0);
    setOpen(false);

    suppressFocusOpenRef.current = true;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (
      !open &&
      (event.key === "ArrowDown" ||
        event.key === "Enter")
    ) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (results.length === 0) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }

      return;
    }

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

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.max(current - 1, 0)
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      selectItem(results[activeIndex]);

      return;
    }

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
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (suppressFocusOpenRef.current) {
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
                {t("noProductsFound")}
              </div>

              <div className="mt-1 text-xs">
                {t("tryDifferentSearch")}
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

                  {product.category}

                  {product.brand && (
                    <>
                      {" · "}
                      {product.brand}
                    </>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}