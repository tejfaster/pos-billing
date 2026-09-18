import { useState } from "react";

import Sidebar from "./Sidebar";

export default function MainLayout({
  currentPage,
  onNavigate,
  children,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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
            {/* Mobile menu button */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
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

            {/* Desktop sidebar toggle */}

            <button
              type="button"
              onClick={() =>
                setSidebarCollapsed(
                  (current) => !current
                )
              }
              aria-label={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
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
                  ? "Billing"
                  : currentPage === "products"
                  ? "Products"
                  : currentPage}
              </div>
            </div>
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