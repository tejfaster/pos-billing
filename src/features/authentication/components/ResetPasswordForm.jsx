import { useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";

import {
  validatePassword,
  validateConfirmPassword,
} from "../validation/authValidation";

import authService from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function ResetPasswordForm({
  resetToken,
  onSuccess,
}) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const inputClassName = (fieldName) => `
    w-full
    rounded-lg
    border
    bg-[var(--surface)]
    px-3
    py-2.5
    text-sm
    text-[var(--foreground)]
    outline-none
    transition
    placeholder:text-[var(--muted)]
    focus:ring-2
    focus:ring-[var(--accent)]/20
    ${
      errors[fieldName]
        ? "border-[var(--danger)]"
        : "border-[var(--border)]"
    }
  `;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const updated = {
        ...current,
      };

      delete updated[name];

      return updated;
    });

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    setServerError("");

    const validationErrors = {};

    const passwordError = validatePassword(
      formData.password
    );

    if (passwordError) {
      validationErrors.password = passwordError;
    }

    const confirmPasswordError =
      validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );

    if (confirmPasswordError) {
      validationErrors.confirmPassword =
        confirmPasswordError;
    }

    if (!resetToken) {
      setServerError(
        "Your password reset session is invalid. Please request a new reset code."
      );
      return;
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.confirmPasswordReset({
        resetToken,
        newPassword: formData.password,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        "Password reset failed:",
        error
      );

      setServerError(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* New password */}
      <div>
        <label
          htmlFor="reset-password"
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {t("newPassword") || "New password"}
        </label>

        <div className="relative">
          <input
            id="reset-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder={
              t("newPasswordPlaceholder") ||
              "Enter your new password"
            }
            disabled={isSubmitting}
            className={`
              ${inputClassName("password")}
              pr-20
            `}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            disabled={isSubmitting}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-md
              px-2
              py-1
              text-xs
              font-medium
              text-[var(--muted)]
              transition
              hover:bg-[var(--muted)]/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {showPassword
              ? t("hidePassword")
              : t("showPassword")}
          </button>
        </div>

        {errors.password && (
          <p
            className="
              mt-1
              text-xs
              text-[var(--danger)]
            "
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="reset-confirm-password"
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {t("confirmPassword") ||
            "Confirm password"}
        </label>

        <div className="relative">
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={
              t("confirmPasswordPlaceholder") ||
              "Confirm your new password"
            }
            disabled={isSubmitting}
            className={`
              ${inputClassName(
                "confirmPassword"
              )}
              pr-20
            `}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            disabled={isSubmitting}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-md
              px-2
              py-1
              text-xs
              font-medium
              text-[var(--muted)]
              transition
              hover:bg-[var(--muted)]/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {showConfirmPassword
              ? t("hidePassword")
              : t("showPassword")}
          </button>
        </div>

        {errors.confirmPassword && (
          <p
            className="
              mt-1
              text-xs
              text-[var(--danger)]
            "
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Password requirements */}
      <div
        className="
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-3
        "
      >
        <p className="mb-2 text-xs font-medium text-[var(--foreground)]">
          {t("passwordRequirements") ||
            "Password requirements"}
        </p>

        <ul
          className="
            space-y-1
            text-xs
            text-[var(--muted)]
          "
        >
          <li>• At least 8 characters</li>
          <li>• One uppercase letter</li>
          <li>• One lowercase letter</li>
          <li>• One number</li>
          <li>• One special character</li>
        </ul>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full
          rounded-lg
          bg-[var(--foreground)]
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[var(--background)]
          transition
          hover:opacity-90
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isSubmitting
          ? t("resettingPassword") ||
            "Resetting password..."
          : t("resetPassword") ||
            "Reset password"}
      </button>
    </form>
  );
}