import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Sidebar({
  currentPage,
  onNavigate,
  collapsed = false,
  mobileOpen = false,
  onClose,
}) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navigationItems = [
    {
      id: "billing",
      label: t("billing"),
      enabled: true,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h8M8 11h8M8 15h5"
          />
        </svg>
      ),
    },

    {
      id: "products",
      label: t("products"),
      enabled: true,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 7.5 7.5 4 7.5-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12v9"
          />
        </svg>
      ),
    },

    {
      id: "customers",
      label: t("customers"),
      enabled: false,
    },

    {
      id: "bills",
      label: t("bills"),
      enabled: false,
    },

    {
      id: "inventory",
      label: t("inventory"),
      enabled: false,
    },

    {
      id: "reports",
      label: t("reports"),
      enabled: false,
    },

    {
      id: "settings",
      label: t("settings"),
      enabled: true,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.73 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10c.24.58.8.97 1.43.97h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z"
          />
        </svg>
      ),
    },
  ];

  const visibleItems =
    navigationItems.filter(
      (item) => item.enabled
    );

  const firstName =
    user?.first_name || "";

  const lastName =
    user?.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  const roleLabel =
    user?.role === "admin"
      ? t("administrator") || "Administrator"
      : t("user") || "User";

  const handleNavigation = (page) => {
    onNavigate(page);

    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    if (onClose) {
      onClose();
    }

    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={
            t("closeNavigation") ||
            "Close navigation"
          }
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          no-print
          fixed inset-y-0 left-0 z-50
          flex h-dvh flex-col
          border-r border-[var(--border)]
          bg-[var(--surface)]
          text-[var(--foreground)]

          transition-all
          duration-200
          ease-in-out

          lg:static
          lg:z-auto
          lg:translate-x-0

          ${
            collapsed
              ? "lg:w-20"
              : "lg:w-64"
          }

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          w-64
        `}
      >
        {/* Brand */}
        <div
          className={`
            flex h-16 shrink-0
            items-center
            border-b border-[var(--border)]

            ${
              collapsed
                ? "justify-center px-2"
                : "px-4"
            }
          `}
        >
          <div
            className={`
              flex items-center

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }
            `}
          >
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

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  POS Billing
                </p>

                <p className="text-xs text-[var(--muted)]">
                  Billing System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="
            flex-1
            overflow-y-auto
            p-3
          "
          aria-label="Main navigation"
        >
          <div className="space-y-1">
            {visibleItems.map((item) => {
              const isActive =
                currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.id
                    )
                  }
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className={`
                    flex w-full
                    items-center
                    rounded-lg
                    py-2.5
                    text-sm font-medium
                    transition

                    ${
                      collapsed
                        ? "justify-center px-2"
                        : "gap-3 px-3"
                    }

                    ${
                      isActive
                        ? `
                          bg-[var(--foreground)]
                          text-[var(--background)]
                        `
                        : `
                          text-[var(--muted)]
                          hover:bg-[var(--muted)]/10
                          hover:text-[var(--foreground)]
                        `
                    }
                  `}
                >
                  {item.icon}

                  {!collapsed && (
                    <span>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Account */}
        <div
          className="
            shrink-0
            border-t border-[var(--border)]
            p-3
          "
        >
          {/* Profile */}
          <button
            type="button"
            onClick={() =>
              handleNavigation("profile")
            }
            title={
              collapsed
                ? `${fullName} — ${roleLabel}`
                : undefined
            }
            className={`
              mb-2
              flex w-full
              items-center
              rounded-lg
              py-2
              text-left
              transition
              hover:bg-[var(--muted)]/10

              ${
                collapsed
                  ? "justify-center px-2"
                  : "gap-3 px-3"
              }
            `}
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                bg-[var(--foreground)]
                text-xs font-semibold
                text-[var(--background)]
              "
              aria-hidden="true"
            >
              {initials || "U"}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm font-medium
                    text-[var(--foreground)]
                  "
                >
                  {fullName || t("user")}
                </p>

                <p
                  className="
                    truncate
                    text-xs
                    text-[var(--muted)]
                  "
                >
                  {roleLabel}
                </p>
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title={
              collapsed
                ? t("logout") || "Logout"
                : undefined
            }
            className={`
              flex w-full
              items-center
              rounded-lg
              py-2.5
              text-sm font-medium
              text-[var(--muted)]
              transition
              hover:bg-[var(--muted)]/10
              hover:text-[var(--foreground)]

              ${
                collapsed
                  ? "justify-center px-2"
                  : "gap-3 px-3"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11 8-4 4 4 4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"
              />
            </svg>

            {!collapsed && (
              <span>
                {t("logout") || "Logout"}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}