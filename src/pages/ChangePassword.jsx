import { useState } from "react";

import { useLanguage } from "../context/LanguageContext";
import authService from "../features/authentication/services/authService";

import {
  validatePassword,
  validateConfirmPassword,
} from "../features/authentication/validation/authValidation";

import { getAuthErrorMessage } from "../features/authentication/utils/authErrors";

export default function ChangePassword({
  onBack,
}) {
  const { t } = useLanguage();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword =
        t("currentPasswordRequired");
    }

    const passwordError =
      validatePassword(newPassword);

    if (passwordError) {
      nextErrors.newPassword =
        passwordError;
    }

    const confirmPasswordError =
      validateConfirmPassword(
        newPassword,
        confirmPassword
      );

    if (confirmPasswordError) {
      nextErrors.confirmPassword =
        confirmPasswordError;
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      setSuccessMessage(
        t("passwordChangedSuccessfully")
      );
    } catch (error) {
      console.error(
        "Change password failed:",
        error
      );

      if (
        error?.code ===
        "INVALID_CURRENT_PASSWORD"
      ) {
        setServerError(
          t("invalidCurrentPassword")
        );
      } else if (
        error?.code === "SAME_PASSWORD"
      ) {
        setServerError(
          t("samePassword")
        );
      } else {
        setServerError(
          getAuthErrorMessage(error)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div
        className="
          mx-auto w-full max-w-2xl
          p-4
          sm:p-6
          lg:p-8
        "
      >
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="
              mb-4
              text-sm
              font-medium
              text-[var(--muted)]
              transition
              hover:text-[var(--foreground)]
            "
          >
            ← {t("backToProfile")}
          </button>

          <h1
            className="
              text-2xl
              font-semibold
              text-[var(--foreground)]
            "
          >
            {t("changePassword")}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--muted)]
            "
          >
            {t("changePasswordSubtitle")}
          </p>
        </div>

        {/* Form Card */}
        <section
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            p-5
            shadow-sm
            sm:p-6
          "
        >
          {/* Server Error */}
          {serverError && (
            <div
              role="alert"
              className="
                mb-5
                rounded-lg
                border
                border-[var(--danger)]/30
                bg-[var(--danger)]/10
                px-3 py-2.5
                text-sm
                text-[var(--danger)]
              "
            >
              {serverError}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div
              role="status"
              className="
                mb-5
                rounded-lg
                border
                border-[var(--success)]/30
                bg-[var(--success)]/10
                px-3 py-2.5
                text-sm
                text-[var(--success)]
              "
            >
              {successMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                "
              >
                {t("currentPassword")}
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                className="
                  w-full
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--background)]
                  px-3 py-2.5
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition
                  focus:border-[var(--foreground)]
                "
              />

              {errors.currentPassword && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    text-[var(--danger)]
                  "
                >
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                "
              >
                {t("newPassword")}
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                className="
                  w-full
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--background)]
                  px-3 py-2.5
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition
                  focus:border-[var(--foreground)]
                "
              />

              {errors.newPassword && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    text-[var(--danger)]
                  "
                >
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                "
              >
                {t("confirmPassword")}
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                className="
                  w-full
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--background)]
                  px-3 py-2.5
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition
                  focus:border-[var(--foreground)]
                "
              />

              {errors.confirmPassword && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    text-[var(--danger)]
                  "
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              className="
                flex
                flex-col-reverse
                gap-3
                pt-2
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="
                  rounded-lg
                  border border-[var(--border)]
                  px-4 py-2.5
                  text-sm font-medium
                  text-[var(--foreground)]
                  transition
                  hover:bg-[var(--muted)]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="
                  rounded-lg
                  bg-[var(--foreground)]
                  px-4 py-2.5
                  text-sm font-medium
                  text-[var(--background)]
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isLoading
                  ? t("changingPassword")
                  : t("changePassword")}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}