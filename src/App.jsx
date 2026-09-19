import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Settings from "./pages/Setting";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState("billing");

  const renderPage = () => {
    switch (currentPage) {
      case "products":
        return <Products />;

      case "settings":
        return <Settings />;

      case "billing":
      default:
        return <Billing />;
    }
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </MainLayout>
  );
}