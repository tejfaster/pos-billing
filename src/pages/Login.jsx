import { useState } from "react";

import AuthLayout from "../features/authentication/components/AuthLayout";
import LoginForm from "../features/authentication/components/LoginForm";

import authService from "../features/authentication/services/authService";
import { getAuthErrorMessage } from "../features/authentication/utils/authErrors";

import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Login({
  onSignup,
  onForgotPassword,
}) {
  const { t } = useLanguage();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (formData) => {
    setServerError("");
    setIsLoading(true);

    try {
      const user = await authService.login(formData);

      login(user);
    } catch (error) {
      console.error("Login failed:", error);

      setServerError(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("login")}
      subtitle={t("loginSubtitle")}
    >
      {serverError && (
        <div
          role="alert"
          className="
            mb-5
            rounded-lg
            border
            border-[var(--danger)]/30
            bg-[var(--danger)]/10
            px-3
            py-2.5
            text-sm
            text-[var(--danger)]
          "
        >
          {serverError}
        </div>
      )}

      <LoginForm
        onSubmit={handleSubmit}
        onSignup={onSignup}
        onForgotPassword={onForgotPassword}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}