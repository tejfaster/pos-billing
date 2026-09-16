import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const TEXT_SIZES = {
  small: "87.5%",
  default: "100%",
  large: "112.5%",
  extraLarge: "125%",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("pos-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "light";
  });

  const [textSize, setTextSize] = useState(() => {
    const savedTextSize = localStorage.getItem(
      "pos-text-size"
    );

    if (
      savedTextSize === "small" ||
      savedTextSize === "default" ||
      savedTextSize === "large" ||
      savedTextSize === "extraLarge"
    ) {
      return savedTextSize;
    }

    return "default";
  });

  /*
   * Apply theme.
   */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    localStorage.setItem("pos-theme", theme);
  }, [theme]);

  /*
   * Apply text size.
   */
  useEffect(() => {
    const root = document.documentElement;

    root.style.fontSize = TEXT_SIZES[textSize];

    localStorage.setItem(
      "pos-text-size",
      textSize
    );
  }, [textSize]);

  /*
   * Toggle light/dark mode.
   */
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        textSize,
        setTextSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}