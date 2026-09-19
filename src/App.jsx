import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";

import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState("billing");

  const [authPage, setAuthPage] =
    useState("login");

  const { isAuthenticated } = useAuth();

  /*
   * Authentication screens
   */
  if (!isAuthenticated) {
    if (authPage === "signup") {
      return (
        <Signup
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onSignup={() => setAuthPage("signup")}
      />
    );
  }

  /*
   * Main application
   */
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