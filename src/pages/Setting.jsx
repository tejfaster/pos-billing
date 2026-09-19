import AccessibilityControls from "../components/common/AccessibilityControls";
import { useLanguage } from "../context/LanguageContext";

export default function Settings() {
  const { t } = useLanguage();

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("settings")}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("settingsDescription")}
          </p>
        </div>

        {/* Appearance */}
        <section
          className="
            rounded-xl border border-[var(--border)]
            bg-[var(--surface)] p-5
          "
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {t("appearance")}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("appearanceDescription")}
            </p>
          </div>

          <div
            className="
              flex flex-col gap-4
              rounded-lg border border-[var(--border)]
              p-4 sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div>
              <p className="font-medium">
                {t("themeAndTextSize")}
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("themeAndTextSizeDescription")}
              </p>
            </div>

            <AccessibilityControls />
          </div>
        </section>
      </div>
    </div>
  );
}