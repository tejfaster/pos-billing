import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ProductProvider } from "./context/ProductContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </ThemeProvider>
  </StrictMode>
);