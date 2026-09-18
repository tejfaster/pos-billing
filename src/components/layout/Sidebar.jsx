const NAV_ITEMS = [
  {
    id: "billing",
    label: "Billing",
    icon: "▣",
  },
  {
    id: "products",
    label: "Products",
    icon: "▦",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "♙",
    disabled: true,
  },
  {
    id: "bills",
    label: "Bills",
    icon: "☷",
    disabled: true,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "▤",
    disabled: true,
  },
  {
    id: "reports",
    label: "Reports",
    icon: "◫",
    disabled: true,
  },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  collapsed = false,
  mobileOpen = false,
  onClose,
}) {
  const handleNavigate = (item) => {
    if (item.disabled) {
      return;
    }

    onNavigate(item.id);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          border-r
          border-[var(--border)]
          bg-[var(--surface)]
          transition-all
          duration-200
          lg:static
          lg:z-auto
          ${
            collapsed
              ? "w-20"
              : "w-64"
          }
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo / Brand */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            border-b
            border-[var(--border)]
            px-4
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[var(--foreground)]
              text-sm
              font-bold
              text-[var(--background)]
            "
          >
            P
          </div>

          {!collapsed && (
            <div className="ml-3 min-w-0">
              <div className="truncate text-sm font-semibold">
                POS Billing
              </div>

              <div className="truncate text-xs text-[var(--muted)]">
                Hardware & Materials
              </div>
            </div>
          )}

          {/* Mobile close */}

          {mobileOpen && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="
                ml-auto
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-lg
                text-[var(--muted)]
                hover:bg-[var(--muted)]/10
                lg:hidden
              "
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
          aria-label="Main navigation"
        >
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active =
                currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() =>
                    handleNavigate(item)
                  }
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    transition
                    ${
                      collapsed
                        ? "justify-center"
                        : "gap-3"
                    }
                    ${
                      active
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : item.disabled
                        ? "cursor-not-allowed text-[var(--muted)] opacity-45"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)]/10"
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      text-base
                    "
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="truncate text-sm font-medium">
                      {item.label}
                    </span>
                  )}

                  {!collapsed &&
                    item.disabled && (
                      <span className="ml-auto text-[10px] text-[var(--muted)]">
                        Soon
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}

        <div
          className="
            shrink-0
            border-t
            border-[var(--border)]
            p-3
          "
        >
          <button
            type="button"
            disabled
            title={
              collapsed
                ? "Settings"
                : undefined
            }
            className={`
              flex
              w-full
              items-center
              rounded-lg
              px-3
              py-2.5
              text-[var(--muted)]
              opacity-45
              ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }
            `}
          >
            <span className="flex h-5 w-5 items-center justify-center">
              ⚙
            </span>

            {!collapsed && (
              <span className="text-sm font-medium">
                Settings
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}