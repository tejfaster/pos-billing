import { useLanguage } from "../../context/LanguageContext";

const NAV_ITEMS = [
  {
    id: "billing",
    labelKey: "billing",
    enabled: true,
  },
  {
    id: "products",
    labelKey: "products",
    enabled: true,
  },
  {
    id: "customers",
    labelKey: "customers",
    enabled: false,
  },
  {
    id: "bills",
    labelKey: "bills",
    enabled: false,
  },
  {
    id: "inventory",
    labelKey: "inventory",
    enabled: false,
  },
  {
    id: "reports",
    labelKey: "reports",
    enabled: false,
  },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  mobileOpen,
  onClose,
}) {
  const { t } = useLanguage();

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => item.enabled
  );

  const handleNavigation = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("closeNavigation")}
          onClick={onClose}
          className="
            no-print fixed inset-0 z-40
            bg-black/40 lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          no-print fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-[var(--border)]
          bg-[var(--surface)]
          transition-all duration-200

          lg:static lg:z-auto lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo / Brand */}
        <div
          className="
            flex h-16 shrink-0 items-center
            border-b border-[var(--border)]
            px-4
          "
        >
          <div
            className={`
              flex min-w-0 items-center
              ${
                collapsed
                  ? "w-full justify-center"
                  : "gap-3"
              }
            `}
          >
            {/* Logo */}
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                bg-[var(--foreground)]
                text-sm font-bold
                text-[var(--background)]
              "
            >
              P
            </div>

            {/* Brand name */}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  POS Billing
                </p>

                <p className="truncate text-xs text-[var(--muted)]">
                  Billing System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main navigation */}
        <nav
          className="flex-1 overflow-y-auto p-3"
          aria-label={t("mainNavigation")}
        >
          <div className="space-y-1">
            {visibleNavItems.map((item) => {
              const isActive =
                currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(item.id)
                  }
                  className={`
                    group relative flex w-full
                    items-center rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    transition

                    ${
                      collapsed
                        ? "justify-center"
                        : "gap-3"
                    }

                    ${
                      isActive
                        ? `
                          bg-[var(--accent-soft)]
                          text-[var(--foreground)]
                        `
                        : `
                          text-[var(--muted)]
                          hover:bg-[var(--muted)]/10
                          hover:text-[var(--foreground)]
                        `
                    }
                  `}
                >
                  {/* Navigation icon */}
                  <span
                    className="
                      flex h-5 w-5 shrink-0
                      items-center justify-center
                      text-sm
                    "
                    aria-hidden="true"
                  >
                    {item.id === "billing" && "▣"}
                    {item.id === "products" && "▤"}
                    {item.id === "customers" && "♙"}
                    {item.id === "bills" && "▤"}
                    {item.id === "inventory" && "▥"}
                    {item.id === "reports" && "▥"}
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span className="min-w-0 truncate text-left">
                      {t(item.labelKey)}
                    </span>
                  )}

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <span
                      className="
                        pointer-events-none
                        absolute left-full z-50 ml-3
                        hidden whitespace-nowrap
                        rounded-md
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        px-3 py-1.5
                        text-xs
                        text-[var(--foreground)]
                        shadow-lg
                        group-hover:block
                      "
                    >
                      {t(item.labelKey)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Settings */}
        <div
          className="
            shrink-0
            border-t border-[var(--border)]
            p-3
          "
        >
          <button
            type="button"
            onClick={() =>
              handleNavigation("settings")
            }
            className={`
              group relative flex w-full
              items-center rounded-lg
              px-3 py-2.5
              text-sm font-medium
              transition

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }

              ${
                currentPage === "settings"
                  ? `
                    bg-[var(--accent-soft)]
                    text-[var(--foreground)]
                  `
                  : `
                    text-[var(--muted)]
                    hover:bg-[var(--muted)]/10
                    hover:text-[var(--foreground)]
                  `
              }
            `}
          >
            {/* Settings icon */}
            <span
              className="
                flex h-5 w-5 shrink-0
                items-center justify-center
                text-base
              "
              aria-hidden="true"
            >
              ⚙
            </span>

            {/* Settings label */}
            {!collapsed && (
              <span className="truncate">
                {t("settings")}
              </span>
            )}

            {/* Collapsed tooltip */}
            {collapsed && (
              <span
                className="
                  pointer-events-none
                  absolute left-full z-50 ml-3
                  hidden whitespace-nowrap
                  rounded-md
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  px-3 py-1.5
                  text-xs
                  text-[var(--foreground)]
                  shadow-lg
                  group-hover:block
                "
              >
                {t("settings")}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}