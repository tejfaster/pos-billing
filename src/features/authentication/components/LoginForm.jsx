import { useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";

import {
  validateEmail,
} from "../validation/authValidation";

export default function LoginForm({
  onSubmit,
  onSignup,
  onForgotPassword,
  isLoading = false,
}) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = (fieldName) => `
    w-full rounded-lg border
    bg-[var(--surface)]
    px-3 py-2.5
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = {};

    const emailError = validateEmail(formData.email);

    if (emailError) {
      validationErrors.email = emailError;
    }

    /*
     * Login should NOT validate password
     * complexity requirements.
     *
     * Password rules such as:
     * - uppercase
     * - lowercase
     * - number
     * - special character
     *
     * apply when creating or changing
     * a password, not when logging in.
     */
    if (!formData.password) {
      validationErrors.password =
        t("passwordRequired") ||
        "Password is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {t("email")}
        </label>

        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
          className={inputClassName("email")}
          disabled={isLoading}
        />

        {errors.email && (
          <p
            className="
              mt-1
              text-xs
              text-[var(--danger)]
            "
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="
              block
              text-sm
              font-medium
              text-[var(--foreground)]
            "
          >
            {t("password")}
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="
              text-xs
              font-medium
              text-[var(--muted)]
              underline
              underline-offset-2
              transition
              hover:text-[var(--foreground)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {t("forgotPassword") || "Forgot password?"}
          </button>
        </div>

        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("passwordPlaceholder")}
            className={`
              ${inputClassName("password")}
              pr-20
            `}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            disabled={isLoading}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
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
        {isLoading
          ? t("signingIn") || "Signing in..."
          : t("login")}
      </button>

      {/* Signup */}
      <div
        className="
          text-center
          text-sm
          text-[var(--muted)]
        "
      >
        <span>
          {t("dontHaveAccount")}{" "}
        </span>

        <button
          type="button"
          onClick={onSignup}
          disabled={isLoading}
          className="
            text-sm
            font-semibold
            text-[var(--foreground)]
            underline
            underline-offset-2
            transition
            hover:opacity-70
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {t("signup")}
        </button>
      </div>
    </form>
  );
}