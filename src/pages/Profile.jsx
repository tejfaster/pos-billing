import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Profile({
  onChangePassword,
}) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || t("user");

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "U";

  const roleLabel =
    user?.role === "admin"
      ? t("administrator")
      : t("user");

  const statusLabel =
    user?.status === "active"
      ? t("active")
      : t("disabled");

  const memberSince = user?.created_at
    ? new Date(
        user.created_at
      ).toLocaleDateString()
    : "—";

  return (
    <div className="h-full overflow-y-auto">
      <div
        className="
          mx-auto w-full max-w-5xl
          p-4
          sm:p-6
          lg:p-8
        "
      >
        {/* Page Header */}
        <div className="mb-6">
          <h1
            className="
              text-2xl
              font-semibold
              text-[var(--foreground)]
            "
          >
            {t("profile")}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--muted)]
            "
          >
            {t("profileSubtitle")}
          </p>
        </div>

        {/* Profile Header */}
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
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="
                flex h-16 w-16 shrink-0
                items-center justify-center
                rounded-full
                bg-[var(--foreground)]
                text-lg font-semibold
                text-[var(--background)]
              "
              aria-hidden="true"
            >
              {initials}
            </div>

            {/* User Details */}
            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-lg font-semibold
                  text-[var(--foreground)]
                "
              >
                {fullName}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[var(--muted)]
                "
              >
                {roleLabel}
              </p>

              <div className="mt-2">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border border-[var(--border)]
                    px-2.5 py-1
                    text-xs font-medium
                    text-[var(--muted)]
                  "
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section
          className="
            mt-6
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            shadow-sm
          "
        >
          <div
            className="
              border-b border-[var(--border)]
              px-5 py-4
              sm:px-6
            "
          >
            <h2
              className="
                text-base
                font-semibold
                text-[var(--foreground)]
              "
            >
              {t("personalInformation")}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
            >
              {t("personalInformationSubtitle")}
            </p>
          </div>

          <div
            className="
              grid gap-5
              p-5
              sm:grid-cols-2
              sm:p-6
            "
          >
            {/* First Name */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("firstName")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {firstName || "—"}
              </p>
            </div>

            {/* Last Name */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("lastName")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {lastName || "—"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("phoneNumber")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {user?.phone || "—"}
              </p>
            </div>

            {/* Email */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("email")}
              </p>

              <p
                className="
                  mt-1
                  break-all
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section
          className="
            mt-6
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            shadow-sm
          "
        >
          <div
            className="
              border-b border-[var(--border)]
              px-5 py-4
              sm:px-6
            "
          >
            <h2
              className="
                text-base
                font-semibold
                text-[var(--foreground)]
              "
            >
              {t("accountInformation")}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
            >
              {t("accountInformationSubtitle")}
            </p>
          </div>

          <div
            className="
              grid gap-5
              p-5
              sm:grid-cols-2
              sm:p-6
            "
          >
            {/* Role */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("role")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {roleLabel}
              </p>
            </div>

            {/* Status */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("accountStatus")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {statusLabel}
              </p>
            </div>

            {/* Member Since */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("memberSince")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {memberSince}
              </p>
            </div>

            {/* User ID */}
            <div>
              <p
                className="
                  text-xs font-medium
                  text-[var(--muted)]
                "
              >
                {t("userId")}
              </p>

              <p
                className="
                  mt-1
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {user?.id ?? "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          className="
            mt-6
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            shadow-sm
          "
        >
          <div
            className="
              border-b border-[var(--border)]
              px-5 py-4
              sm:px-6
            "
          >
            <h2
              className="
                text-base
                font-semibold
                text-[var(--foreground)]
              "
            >
              {t("security")}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
            >
              {t("securitySubtitle")}
            </p>
          </div>

          <div
            className="
              flex flex-col gap-4
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-6
            "
          >
            <div>
              <p
                className="
                  text-sm font-medium
                  text-[var(--foreground)]
                "
              >
                {t("password")}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-[var(--muted)]
                "
              >
                {t("passwordDescription")}
              </p>
            </div>

            <button
              type="button"
              onClick={onChangePassword}
              className="
                rounded-lg
                border border-[var(--border)]
                px-4 py-2
                text-sm font-medium
                text-[var(--foreground)]
                transition
                hover:bg-[var(--muted)]/10
              "
            >
              {t("changePassword")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}