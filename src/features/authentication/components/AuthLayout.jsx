import AccessibilityControls from "../../../components/common/AccessibilityControls";
import { useLanguage } from "../../../context/LanguageContext";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  const { language, setLanguage } =
    useLanguage();

  return (
    <div
      className="
        min-h-dvh
        overflow-y-auto
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {/* Public header */}
      <header
        className="
          flex min-h-16
          items-center justify-between
          border-b border-[var(--border)]
          bg-[var(--surface)]
          px-4 py-3
          sm:px-6
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
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

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">
              POS Billing
            </p>

            <p className="text-xs text-[var(--muted)]">
              Billing System
            </p>
          </div>
        </div>

        {/* Public controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div
            className="
              flex items-center
              rounded-lg
              border border-[var(--border)]
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
              onClick={() => setLanguage("hi")}
              aria-pressed={language === "hi"}
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

          {/* Appearance */}
          <AccessibilityControls />
        </div>
      </header>

      {/* Authentication content */}
      <main
        className="
          flex
          min-h-[calc(100dvh-4rem)]
          items-start
          justify-center
          px-4 py-8
          sm:items-center
          sm:py-10
        "
      >
        <div className="w-full max-w-md">
          {/* Authentication heading */}
          <div className="mb-6 text-center">
            <div
              className="
                mx-auto mb-4
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                bg-[var(--foreground)]
                text-lg font-bold
                text-[var(--background)]
              "
            >
              P
            </div>

            <h1 className="text-2xl font-semibold">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm text-[var(--muted)]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form card */}
          <div
            className="
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]
              p-5 shadow-sm
              sm:p-6
            "
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}