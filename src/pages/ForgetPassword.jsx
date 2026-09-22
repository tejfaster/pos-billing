import { useState } from "react";
import AuthLayout from "../features/authentication/components/AuthLayout";
import authService from "../features/authentication/services/authService";
import { getAuthErrorMessage } from "../features/authentication/utils/authErrors";
import { validateEmail } from "../features/authentication/validation/authValidation";

export default function ForgotPassword({ onBackToLogin, onOtpRequested }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.requestPasswordReset({
        email: email.trim(),
      });

      setMessage(
        response?.message ||
          "If an account exists for this email address, a verification code has been sent."
      );

      if (onOtpRequested) {
        onOtpRequested(email.trim());
      }
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <button
            type="button"
            onClick={onBackToLogin}
            className="mb-6 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ← Back to login
          </button>

          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Enter your email address and we'll send you a verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="forgot-password-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="forgot-password-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2.5 text-sm text-green-600 dark:text-green-400"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send verification code"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}