
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
import { useProducts } from "./context/ProductContext";
import { useCategories } from "./context/CategoryContext";
import { useUnits } from "./context/UnitContext";

import { syncCatalogue } from "./offline/syncManager";
import { startAutomaticSyncScheduler } from "./offline/syncScheduler";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  const { fetchProducts } = useProducts();
  const { fetchCategories } = useCategories();
  const { fetchUnits } = useUnits();

  const [currentPage, setCurrentPage] = useState("billing");
  const [editingBill, setEditingBill] = useState(null);

  const [authPage, setAuthPage] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Download the backend catalogue after authentication.
  // Save it to IndexedDB through syncCatalogue(), then refresh
  // the React contexts so the latest data appears in the UI.
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return undefined;
    }

    let cancelled = false;

    const loadCatalogue = async () => {
      if (!navigator.onLine) {
        // Offline: existing contexts continue using IndexedDB.
        return;
      }

      try {
        await syncCatalogue();

        if (cancelled) {
          return;
        }

        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchUnits(),
        ]);
      } catch (error) {
        console.error("Initial catalogue sync failed:", error);
        // Keep the locally cached catalogue available.
      }
    };

    void loadCatalogue();

    const stopScheduler = startAutomaticSyncScheduler();

    return () => {
      cancelled = true;
      stopScheduler?.();
    };
  }, [
    isLoading,
    isAuthenticated,
    fetchProducts,
    fetchCategories,
    fetchUnits,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-sm text-[var(--muted)]">
          {t("loading") || "Loading..."}
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === "login") {
      return (
        <Login
          onSignup={() => setAuthPage("signup")}
          onForgotPassword={() =>
            setAuthPage("forgot-password")
          }
        />
      );
    }

    if (authPage === "signup") {
      return (
        <Signup
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    if (authPage === "forgot-password") {
      return (
        <ForgotPassword
          onBack={() => setAuthPage("login")}
          onOtpSent={(email) => {
            setResetEmail(email);
            setAuthPage("verify-otp");
          }}
        />
      );
    }

    if (authPage === "verify-otp") {
      return (
        <AuthLayout>
          <VerifyOtpForm
            email={resetEmail}
            onBack={() =>
              setAuthPage("forgot-password")
            }
            onVerified={({ resetToken: token }) => {
              setResetToken(token);
              setAuthPage("reset-password");
            }}
          />
        </AuthLayout>
      );
    }

    if (authPage === "reset-password") {
      return (
        <AuthLayout>
          <ResetPasswordForm
            resetToken={resetToken}
            onSuccess={() => {
              setResetToken("");
              setResetEmail("");
              setAuthPage("login");
            }}
          />
        </AuthLayout>
      );
    }

    return (
      <Login
        onSignup={() => setAuthPage("signup")}
        onForgotPassword={() =>
          setAuthPage("forgot-password")
        }
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "billing":
        return (
          <Billing
            editingBill={editingBill}
            onClearEditingBill={() =>
              setEditingBill(null)
            }
          />
        );

      case "bill-history":
        return (
          <BillHistory
            onEditBill={(bill) => {
              setEditingBill(bill);
              setCurrentPage("billing");
            }}
          />
        );

      case "profile":
        return (
          <Profile
            onChangePassword={() =>
              setCurrentPage("change-password")
            }
          />
        );

      case "change-password":
        return (
          <ChangePassword
            onBack={() => setCurrentPage("profile")}
          />
        );

      case "products":
        return <Products />;

      case "settings":
        return <Settings />;

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

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={(page) => {
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
