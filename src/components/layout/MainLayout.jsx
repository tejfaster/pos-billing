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

  const pageTitles = {
    billing: t("billing"),
    products: t("products"),
    settings: t("settings"),
    profile: t("profile"),
    "change-password": t("changePassword"),
  };

  const pageTitle =
    pageTitles[currentPage] || "";

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="
        flex h-dvh w-full overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header
          className="
            no-print
            flex h-16 shrink-0
            items-center justify-between
            border-b border-[var(--border)]
            bg-[var(--surface)]
            px-4 sm:px-6
          "
        >
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              aria-label={t("openNavigation")}
              title={t("openNavigation")}
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
                active:scale-95
                lg:hidden
              "
            >
              ☰
            </button>

            {/* Desktop sidebar toggle */}
            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed(
                  (collapsed) => !collapsed
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
                hidden h-10 w-10 shrink-0
                items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
                active:scale-95
                lg:flex
              "
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>

            {/* Page title */}
            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-lg font-semibold
                  text-[var(--foreground)]
                "
              >
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Language */}
            <div
              className="
                flex items-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                p-1
              "
              aria-label={t("language")}
            >
              <button
                type="button"
                onClick={() =>
                  setLanguage("en")
                }
                aria-pressed={
                  language === "en"
                }
                className={`
                  rounded-md
                  px-2.5 py-1.5
                  text-xs font-medium
                  transition
                  ${
                    language === "en"
                      ? `
                        bg-[var(--foreground)]
                        text-[var(--background)]
                      `
                      : `
                        text-[var(--muted)]
                        hover:bg-[var(--muted)]/10
                      `
                  }
                `}
              >
                EN
              </button>

              <button
                type="button"
                onClick={() =>
                  setLanguage("hi")
                }
                aria-pressed={
                  language === "hi"
                }
                className={`
                  rounded-md
                  px-2.5 py-1.5
                  text-xs font-medium
                  transition
                  ${
                    language === "hi"
                      ? `
                        bg-[var(--foreground)]
                        text-[var(--background)]
                      `
                      : `
                        text-[var(--muted)]
                        hover:bg-[var(--muted)]/10
                      `
                  }
                `}
              >
                हिंदी
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}