import { useEffect, useState } from "react";

import MainLayout from "./components/layout/MainLayout";

import Billing from "./pages/Billing";
import BillHistory from "./pages/BillHistory";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgetPassword";

import VerifyOtpForm from "./features/authentication/components/VerifyOtpForm";
import ResetPasswordForm from "./features/authentication/components/ResetPasswordForm";
import AuthLayout from "./features/authentication/components/AuthLayout";

import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import { startAutomaticSyncScheduler } from "./offline/syncScheduler";


export default function App() {
  const [currentPage, setCurrentPage] =
    useState("billing");

  const [editingBill, setEditingBill] =
    useState(null);

  const [authPage, setAuthPage] =
    useState("login");

  const [resetEmail, setResetEmail] =
    useState("");

  const [resetToken, setResetToken] =
    useState("");

  const { t } = useLanguage();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  // ---------------------------------
  // Automatic Offline Catalogue Sync
  // ---------------------------------

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return undefined;
    }

    return startAutomaticSyncScheduler();
  }, [isLoading, isAuthenticated]);

  // ---------------------------------
  // Authentication Loading
  // ---------------------------------

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[var(--background)]
          text-[var(--foreground)]
        "
      >
        <p className="text-sm text-[var(--muted)]">
          {t("loading") || "Loading..."}
        </p>
      </div>
    );
  }

  // ---------------------------------
  // Authentication Pages
  // ---------------------------------

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        {authPage === "login" && (
          <Login
            onSignup={() =>
              setAuthPage("signup")
            }
            onForgotPassword={() =>
              setAuthPage(
                "forgot-password"
              )
            }
          />
        )}

        {authPage === "signup" && (
          <Signup
            onLogin={() =>
              setAuthPage("login")
            }
          />
        )}

        {authPage ===
          "forgot-password" && (
          <ForgotPassword
            onBack={() =>
              setAuthPage("login")
            }
            onOtpSent={(email) => {
              setResetEmail(email);
              setAuthPage(
                "verify-otp"
              );
            }}
          />
        )}

        {authPage ===
          "verify-otp" && (
          <VerifyOtpForm
            email={resetEmail}
            onBack={() =>
              setAuthPage(
                "forgot-password"
              )
            }
            onVerified={(token) => {
              setResetToken(token);
              setAuthPage(
                "reset-password"
              );
            }}
          />
        )}

        {authPage ===
          "reset-password" && (
          <ResetPasswordForm
            email={resetEmail}
            resetToken={resetToken}
            onBack={() =>
              setAuthPage("login")
            }
            onReset={() =>
              setAuthPage("login")
            }
          />
        )}
      </AuthLayout>
    );
  }

  // ---------------------------------
  // Application Pages
  // ---------------------------------

  const renderPage = () => {
    switch (currentPage) {
      // ---------------------------------
      // Billing
      // ---------------------------------

      case "billing":
        return (
          <Billing
            editingBill={editingBill}
            onClearEditingBill={() =>
              setEditingBill(null)
            }
          />
        );

      // ---------------------------------
      // Bill History
      // ---------------------------------

      case "bill-history":
        return (
          <BillHistory
            onEditBill={(bill) => {
              setEditingBill(bill);
              setCurrentPage("billing");
            }}
          />
        );

      // ---------------------------------
      // Profile
      // ---------------------------------

      case "profile":
        return (
          <Profile
            onChangePassword={() =>
              setCurrentPage(
                "change-password"
              )
            }
          />
        );

      // ---------------------------------
      // Change Password
      // ---------------------------------

      case "change-password":
        return (
          <ChangePassword
            onBack={() =>
              setCurrentPage("profile")
            }
          />
        );

      // ---------------------------------
      // Products
      // ---------------------------------

      case "products":
        return <Products />;

      // ---------------------------------
      // Settings
      // ---------------------------------

      case "settings":
        return <Settings />;

      // ---------------------------------
      // Default
      // ---------------------------------

      default:
        return (
          <Billing
            editingBill={editingBill}
            onClearEditingBill={() =>
              setEditingBill(null)
            }
          />
        );
    }
  };

  // ---------------------------------
  // Layout
  // ---------------------------------

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={(page) => {
        /*
         * If the user manually navigates
         * away from an edit session, clear
         * the selected bill.
         */
        if (
          page !== "billing" &&
          page !== "bill-history"
        ) {
          setEditingBill(null);
        }

        setCurrentPage(page);
      }}
    >
      {renderPage()}
    </MainLayout>
  );
}