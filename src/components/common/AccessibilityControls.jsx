import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function AccessibilityControls() {
  const {
    theme,
    toggleTheme,
    textSize,
    setTextSize,
  } = useTheme();

  const { language, t } = useLanguage();

  const sizes = [
    {
      value: "small",
      label: language === "hi" ? "अ−" : "A−",
      title: t("smallText"),
    },
    {
      value: "default",
      label: language === "hi" ? "अ" : "A",
      title: t("defaultText"),
    },
    {
      value: "large",
      label: language === "hi" ? "अ+" : "A+",
      title: t("largeText"),
    },
    {
      value: "extraLarge",
      label: language === "hi" ? "अ++" : "A++",
      title: t("extraLargeText"),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <div
        className="
          flex items-center rounded-lg border
          border-[var(--border)] bg-[var(--surface)] p-1
        "
        aria-label={t("textSize")}
      >
        {sizes.map((size) => (
          <button
            key={size.value}
            type="button"
            title={size.title}
            aria-label={size.title}
            aria-pressed={textSize === size.value}
            onClick={() => setTextSize(size.value)}
            className={`
              flex h-8 min-w-8 items-center justify-center
              rounded-md px-2 text-sm font-medium transition
              ${
                textSize === size.value
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:bg-[var(--muted)]/10"
              }
            `}
          >
            {size.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        title={
          theme === "light"
            ? t("switchToDarkMode")
            : t("switchToLightMode")
        }
        aria-label={
          theme === "light"
            ? t("switchToDarkMode")
            : t("switchToLightMode")
        }
        className="
          flex h-10 w-10 items-center justify-center rounded-lg
          border border-[var(--border)] bg-[var(--surface)]
          text-[var(--foreground)] transition
          hover:bg-[var(--muted)]/10 active:scale-95
        "
      >
        {theme === "light" ? "☾" : "☀"}
      </button>
    </div>
  );
}