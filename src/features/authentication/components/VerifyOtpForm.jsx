import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import authService from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function VerifyOtpForm({
  email,
  onVerified,
  onBack,
  onResend,
}) {
  const { t } = useLanguage();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  /*
   * Countdown for the resend button.
   */
  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendSeconds((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError(
        t("invalidOtp") ||
          "Enter the 6-digit verification code."
      );
      return;
    }

    setIsVerifying(true);

    try {
      const response =
        await authService.verifyPasswordResetOtp({
          email,
          otp,
        });

      if (onVerified) {
        onVerified({
          resetToken: response.resetToken,
          expiresAt: response.expiresAt,
        });
      }
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error
      );

      setError(getAuthErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendSeconds > 0) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      await authService.requestPasswordReset({
        email,
      });

      setOtp("");
      setResendSeconds(60);

      if (onResend) {
        onResend();
      }
    } catch (error) {
      console.error(
        "OTP resend failed:",
        error
      );

      if (error?.code === "OTP_COOLDOWN") {
        const retryAfter =
          Number(error.retryAfterSeconds) || 60;

        setResendSeconds(retryAfter);

        setError(
          t("otpCooldown") ||
            "Please wait before requesting another verification code."
        );
      } else {
        setError(getAuthErrorMessage(error));
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* Email information */}
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
        <p className="text-xs text-[var(--muted)]">
          {t("verificationCodeSentTo") ||
            "Verification code sent to"}
        </p>

        <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
          {email}
        </p>
      </div>

      {/* OTP */}
      <div>
        <label
          htmlFor="password-reset-otp"
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          {t("verificationCode") ||
            "Verification code"}
        </label>

        <input
          id="password-reset-otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={handleOtpChange}
          placeholder="000000"
          maxLength={6}
          disabled={isVerifying}
          autoFocus
          className={`
            w-full
            rounded-lg
            border
            bg-[var(--surface)]
            px-3
            py-3
            text-center
            text-lg
            font-semibold
            tracking-[0.4em]
            text-[var(--foreground)]
            outline-none
            transition
            placeholder:text-[var(--muted)]
            placeholder:tracking-[0.4em]
            focus:ring-2
            focus:ring-[var(--accent)]/20
            ${
              error
                ? "border-[var(--danger)]"
                : "border-[var(--border)]"
            }
          `}
        />
      </div>

      {/* Error */}
      {error && (
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
          {error}
        </div>
      )}

      {/* Verify */}
      <button
        type="submit"
        disabled={isVerifying || otp.length !== 6}
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
        {isVerifying
          ? t("verifying") || "Verifying..."
          : t("verifyCode") || "Verify code"}
      </button>

      {/* Resend */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={
            isResending ||
            resendSeconds > 0 ||
            isVerifying
          }
          className="
            text-sm
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
          {isResending
            ? t("sending") || "Sending..."
            : resendSeconds > 0
              ? `${t("resendCode") || "Resend code"} (${resendSeconds}s)`
              : t("resendCode") || "Resend code"}
        </button>
      </div>

      {/* Back */}
      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isVerifying || isResending}
          className="
            text-sm
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
          ← {t("back") || "Back"}
        </button>
      </div>
    </form>
  );
}