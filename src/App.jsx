import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";

import Billing from "./pages/Billing";
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


export default function App() {
  const [currentPage, setCurrentPage] =
    useState("billing");

  const [authPage, setAuthPage] = useState("login");
  
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const { t } = useLanguage();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  /*
   * Restore authentication from the
   * backend session before deciding
   * whether to show login or the POS.
   */
  if (isLoading) {
    return (
      <div
        className="
          flex min-h-dvh
          items-center justify-center
          bg-[var(--background)]
          text-[var(--foreground)]
        "
      >
        <p className="text-sm text-[var(--muted)]">
          Loading...
        </p>
      </div>
    );
  }

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

  if (authPage === "forgot-password") {
    return (
      <ForgotPassword
        onBackToLogin={() => {
          setAuthPage("login");
          setResetEmail("");
        }}
        onOtpRequested={(email) => {
          setResetEmail(email);
          setAuthPage("verify-otp");
        }}
      />
    );
  }

  if (authPage === "reset-password") {
  return (
    <AuthLayout
      title={
        t("resetPassword") ||
        "Reset password"
      }
      subtitle={
        t("resetPasswordSubtitle") ||
        "Create a new password for your account."
      }
    >
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

  if (authPage === "verify-otp") {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle="Enter the verification code we sent to your email address."
      >
        <VerifyOtpForm
          email={resetEmail}
          onBack={() => {
            setAuthPage("forgot-password");
          }}
          onVerified={({ resetToken: token }) => {
            setResetToken(token);

            // Reset password screen will be connected next.
            setAuthPage("reset-password");
          }}
          onResend={() => {
            // The resend request is handled inside VerifyOtpForm.
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

  /*
   * Authenticated application pages
   */
  const renderPage = () => {
    switch (currentPage) {
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

      case "change-password":
        return (
          <ChangePassword
            onBack={() =>
              setCurrentPage("profile")
            }
          />
        );

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