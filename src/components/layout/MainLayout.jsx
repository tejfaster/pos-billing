import { useState } from "react";

import Sidebar from "./Sidebar";
import { useLanguage } from "../../context/LanguageContext";

export default function MainLayout({
  currentPage,
  onNavigate,
  children,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { language, setLanguage, t } =
    useLanguage();

  return (
    <div
      className="
        flex
        h-dvh
        w-full
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="
            no-print
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-[var(--border)]
            bg-[var(--surface)]
            px-4
            sm:px-6
          "
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("openNavigation")}
              title={t("openNavigation")}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border)]
                text-lg
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
                lg:hidden
              "
            >
              ☰
            </button>

            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed(
                  (current) => !current
                )
              }
              aria-label={
                sidebarCollapsed
                  ? t("expandSidebar")
                  : t("collapseSidebar")
              }
              title={
                sidebarCollapsed
                  ? t("expandSidebar")
                  : t("collapseSidebar")
              }
              className="
                hidden
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border)]
                text-base
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
                lg:flex
              "
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>

            <div className="hidden sm:block">
              <div className="text-sm font-semibold">
                {currentPage === "billing"
                  ? t("billing")
                  : currentPage === "products"
                  ? t("products")
                  : currentPage}
              </div>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-1
            "
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`
                rounded-md
                px-3
                py-1.5
                text-xs
                font-medium
                transition
                ${
                  language === "en"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:bg-[var(--muted)]/10"
                }
              `}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("hi")}
              aria-pressed={language === "hi"}
              className={`
                rounded-md
                px-3
                py-1.5
                text-xs
                font-medium
                transition
                ${
                  language === "hi"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:bg-[var(--muted)]/10"
                }
              `}
            >
              हिंदी
            </button>
          </div>
        </header>

        <main
          className="
            min-h-0
            flex-1
            overflow-hidden
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}