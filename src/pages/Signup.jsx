import { useState } from "react";

import AuthLayout from "../features/authentication/components/AuthLayout";
import SignupForm from "../features/authentication/components/SignupForm";
import authService from "../features/authentication/services/authService";
import { getAuthErrorMessage } from "../features/authentication/utils/authErrors";
import { useLanguage } from "../context/LanguageContext";

export default function Signup({ onLogin }) {
  const { t } = useLanguage();

  const [isLoading, setIsLoading] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const handleSubmit = async (formData) => {
    setServerError("");
    setIsLoading(true);

    try {
      await authService.signup(formData);
    } catch (error) {
      console.error("Signup failed:", error);

      setServerError(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("createAccount")}
      subtitle={t("signup")}
    >
      {serverError && (
        <div
          role="alert"
          className="
            mb-5 rounded-lg
            border border-[var(--danger)]/30
            bg-[var(--danger)]/10
            px-3 py-2.5
            text-sm
            text-[var(--danger)]
          "
        >
          {serverError}
        </div>
      )}

      <SignupForm
        onSubmit={handleSubmit}
        onLogin={onLogin}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
}