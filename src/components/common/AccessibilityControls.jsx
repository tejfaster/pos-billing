import { useTheme } from "../../context/ThemeContext";

export default function AccessibilityControls() {
  const {
    theme,
    toggleTheme,
    textSize,
    setTextSize,
  } = useTheme();

  const sizes = [
    {
      value: "small",
      label: "A−",
      title: "Small text",
    },
    {
      value: "default",
      label: "A",
      title: "Default text",
    },
    {
      value: "large",
      label: "A+",
      title: "Large text",
    },
    {
      value: "extraLarge",
      label: "A++",
      title: "Extra large text",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Text Size */}
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
        aria-label="Text size"
      >
        {sizes.map((size) => (
          <button
            key={size.value}
            type="button"
            title={size.title}
            aria-label={size.title}
            aria-pressed={textSize === size.value}
            onClick={() =>
              setTextSize(size.value)
            }
            className={`
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-md
              px-2
              text-sm
              font-medium
              transition

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

      {/* Theme */}
      <button
        type="button"
        onClick={toggleTheme}
        title={
          theme === "light"
            ? "Switch to dark mode"
            : "Switch to light mode"
        }
        aria-label={
          theme === "light"
            ? "Switch to dark mode"
            : "Switch to light mode"
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          text-[var(--foreground)]
          transition
          hover:bg-[var(--muted)]/10
          active:scale-95
        "
      >
        {theme === "light" ? "☾" : "☀"}
      </button>
    </div>
  );
}