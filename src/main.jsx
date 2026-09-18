import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ProductProvider } from "./context/ProductContext";
import { LanguageProvider } from "./context/LanguageContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
);