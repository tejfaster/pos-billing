import { useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";

import {
  validateName,
  validatePhone,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../validation/authValidation";

export default function SignupForm({
  onSubmit,
  onLogin,
  isLoading = false,
}) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (
      name === "password" &&
      errors.confirmPassword
    ) {
      setErrors((previous) => ({
        ...previous,
        confirmPassword: "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    const firstNameError = validateName(
      formData.firstName,
      t("firstName")
    );

    const lastNameError = validateName(
      formData.lastName,
      t("lastName")
    );

    const phoneError = validatePhone(
      formData.phone
    );

    const emailError = validateEmail(
      formData.email
    );

    const passwordError = validatePassword(
      formData.password
    );

    const confirmPasswordError =
      validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );

    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    if (phoneError) {
      newErrors.phone = phoneError;
    }

    if (emailError) {
      newErrors.email = emailError;
    }

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (confirmPasswordError) {
      newErrors.confirmPassword =
        confirmPasswordError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  const password = formData.password;

  const passwordRequirements = [
    {
      label: t("passwordMinLength"),
      valid: password.length >= 8,
    },
    {
      label: t("passwordUppercase"),
      valid: /[A-Z]/.test(password),
    },
    {
      label: t("passwordLowercase"),
      valid: /[a-z]/.test(password),
    },
    {
      label: t("passwordNumber"),
      valid: /[0-9]/.test(password),
    },
    {
      label: t("passwordSpecial"),
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const inputClass = (fieldName) => `
    w-full rounded-lg
    border
    ${
      errors[fieldName]
        ? "border-[var(--danger)]"
        : "border-[var(--border)]"
    }
    bg-[var(--background)]
    px-3 py-2.5
    text-sm
    text-[var(--foreground)]
    outline-none
    transition
    placeholder:text-[var(--muted)]
    focus:border-[var(--foreground)]
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* First + Last Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-1.5 block text-sm font-medium"
          >
            {t("firstName")}
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder={t(
              "firstNamePlaceholder"
            )}
            autoComplete="given-name"
            disabled={isLoading}
            className={inputClass("firstName")}
          />

          {errors.firstName && (
            <p
              className="
                mt-1.5
                text-xs
                text-[var(--danger)]
              "
            >
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-1.5 block text-sm font-medium"
          >
            {t("lastName")}
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder={t(
              "lastNamePlaceholder"
            )}
            autoComplete="family-name"
            disabled={isLoading}
            className={inputClass("lastName")}
          />

          {errors.lastName && (
            <p
              className="
                mt-1.5
                text-xs
                text-[var(--danger)]
              "
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium"
        >
          {t("phoneNumber")}
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t(
            "phoneNumberPlaceholder"
          )}
          autoComplete="tel"
          disabled={isLoading}
          className={inputClass("phone")}
        />

        {errors.phone && (
          <p
            className="
              mt-1.5
              text-xs
              text-[var(--danger)]
            "
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium"
        >
          {t("email")}
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t(
            "emailPlaceholder"
          )}
          autoComplete="email"
          disabled={isLoading}
          className={inputClass("email")}
        />

        {errors.email && (
          <p
            className="
              mt-1.5
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
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium"
        >
          {t("password")}
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            placeholder={t(
              "passwordPlaceholder"
            )}
            autoComplete="new-password"
            disabled={isLoading}
            className={`${inputClass(
              "password"
            )} pr-12`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            disabled={isLoading}
            className="
              absolute right-2.5
              top-1/2
              -translate-y-1/2
              flex h-8 w-8
              items-center justify-center
              rounded-md
              text-[var(--muted)]
              transition
              hover:bg-[var(--muted)]/10
              hover:text-[var(--foreground)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={
              showPassword
                ? t("hidePassword")
                : t("showPassword")
            }
          >
            {showPassword ? (
              /* Eye off */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.9 4.3A10.7 10.7 0 0 1 12 4c5.2 0 9 4 10 8-.4 1.5-1.3 3-2.6 4.2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.1 6.1C4.5 7.3 3.4 9 2 12c1 4 4.8 8 10 8 1.2 0 2.3-.2 3.3-.6"
                />
              </svg>
            ) : (
              /* Eye */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                />
              </svg>
            )}
          </button>
        </div>

        {errors.password && (
          <p
            className="
              mt-1.5
              text-xs
              text-[var(--danger)]
            "
          >
            {errors.password}
          </p>
        )}

        {/* Password Requirements */}
        <div className="mt-3">
          <p
            className="
              mb-2
              text-xs
              font-medium
              text-[var(--muted)]
            "
          >
            {t("passwordRequirements")}
          </p>

          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {passwordRequirements.map(
              (requirement) => (
                <div
                  key={requirement.label}
                  className="
                    flex items-center
                    gap-2
                    text-xs
                  "
                >
                  <span
                    className={`
                      flex h-4 w-4
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      text-[10px]
                      ${
                        requirement.valid
                          ? `
                            border-[var(--success)]
                            bg-[var(--success)]/10
                            text-[var(--success)]
                          `
                          : `
                            border-[var(--border)]
                            text-[var(--muted)]
                          `
                      }
                    `}
                  >
                    {requirement.valid
                      ? "✓"
                      : "•"}
                  </span>

                  <span
                    className={
                      requirement.valid
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted)]"
                    }
                  >
                    {requirement.label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium"
        >
          {t("confirmPassword")}
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t(
              "confirmPasswordPlaceholder"
            )}
            autoComplete="new-password"
            disabled={isLoading}
            className={`${inputClass(
              "confirmPassword"
            )} pr-12`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            disabled={isLoading}
            className="
              absolute right-2.5
              top-1/2
              -translate-y-1/2
              flex h-8 w-8
              items-center justify-center
              rounded-md
              text-[var(--muted)]
              transition
              hover:bg-[var(--muted)]/10
              hover:text-[var(--foreground)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={
              showConfirmPassword
                ? t("hidePassword")
                : t("showPassword")
            }
          >
            {showConfirmPassword ? (
              /* Eye off */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.9 4.3A10.7 10.7 0 0 1 12 4c5.2 0 9 4 10 8-.4 1.5-1.3 3-2.6 4.2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.1 6.1C4.5 7.3 3.4 9 2 12c1 4 4.8 8 10 8 1.2 0 2.3-.2 3.3-.6"
                />
              </svg>
            ) : (
              /* Eye */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                />
              </svg>
            )}
          </button>
        </div>

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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full
          rounded-lg
          bg-[var(--foreground)]
          px-4 py-2.5
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
          ? t("creatingAccount")
          : t("createAccount")}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <span className="text-sm text-[var(--muted)]">
          {t("alreadyHaveAccount")}{" "}
        </span>

        <button
  type="button"
  onClick={onLogin}
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
  {t("login")}
</button>
      </div>
    </form>
  );
}