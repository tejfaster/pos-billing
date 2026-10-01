import { useEffect, useState } from "react";

import AccessibilityControls from "../components/common/AccessibilityControls";
import { useLanguage } from "../context/LanguageContext";
import { syncNow, getSyncStatus } from "../offline/syncService";

export default function Settings() {
  const {
    t,
    language,
    setLanguage,
  } = useLanguage();

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  const [syncing, setSyncing] =
    useState(false);

  const [lastSync, setLastSync] =
    useState(null);

  const [syncMessage, setSyncMessage] =
    useState("");

  const [syncError, setSyncError] =
    useState("");

  const [installPrompt, setInstallPrompt] =
    useState(null);

  const [isInstalled, setIsInstalled] =
    useState(false);

  // ---------------------------------
  // Online / Offline Status
  // ---------------------------------

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  // ---------------------------------
  // PWA Install
  // ---------------------------------

  useEffect(() => {
    const handleBeforeInstallPrompt = (
      event
    ) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      window.navigator.standalone === true;

    setIsInstalled(standalone);

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  // ---------------------------------
  // Load Sync Status
  // ---------------------------------

  useEffect(() => {
    let mounted = true;

    const loadSyncStatus = async () => {
      try {
        const status =
          await getSyncStatus();

        if (!mounted) {
          return;
        }

        setLastSync(status.lastSync);
      } catch (error) {
        console.error(
          "Failed to load sync status:",
          error
        );
      }
    };

    loadSyncStatus();

    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------
  // Manual Sync
  // ---------------------------------

  const handleSync = async () => {
    if (syncing) {
      return;
    }

    if (!isOnline) {
      setSyncError(
        t("offline") || "Offline"
      );
      setSyncMessage("");
      return;
    }

    setSyncing(true);
    setSyncMessage("");
    setSyncError("");

    try {
      const result = await syncNow();

      setLastSync(result);

      setSyncMessage(
        t("syncSuccessful") ||
          "Sync completed successfully."
      );
    } catch (error) {
      console.error(
        "Manual sync failed:",
        error
      );

      setSyncError(
        error?.message ||
          t("syncFailed") ||
          "Sync failed."
      );
    } finally {
      setSyncing(false);
    }
  };

  // ---------------------------------
  // Install POS
  // ---------------------------------

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    try {
      await installPrompt.prompt();

      await installPrompt.userChoice;

      setInstallPrompt(null);
    } catch (error) {
      console.error(
        "PWA installation failed:",
        error
      );
    }
  };

  // ---------------------------------
  // Last Sync Display
  // ---------------------------------

  const formattedLastSync =
    lastSync?.syncedAt
      ? new Date(
          lastSync.syncedAt
        ).toLocaleString()
      : null;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Page Header */}

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("settings")}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("settingsDescription")}
          </p>
        </div>

        {/* ---------------------------------
            Appearance
        --------------------------------- */}

        <section
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            p-5
          "
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {t("appearance")}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("appearanceDescription")}
            </p>
          </div>

          <div
            className="
              flex flex-col gap-4
              rounded-lg
              border border-[var(--border)]
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="font-medium">
                {t("themeAndTextSize")}
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {t(
                  "themeAndTextSizeDescription"
                )}
              </p>
            </div>

            <AccessibilityControls />
          </div>
        </section>

        {/* ---------------------------------
            Language
        --------------------------------- */}

        <section
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            p-5
          "
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {t("language") || "Language"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("languageDescription") ||
                "Choose the application language."}
            </p>
          </div>

          <div
            className="
              flex
              w-fit
              overflow-hidden
              rounded-lg
              border border-[var(--border)]
            "
          >
            <button
              type="button"
              onClick={() =>
                setLanguage("en")
              }
              className={`
                px-5 py-2.5
                text-sm font-medium
                transition
                ${
                  language === "en"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:bg-[var(--background)]"
                }
              `}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() =>
                setLanguage("hi")
              }
              className={`
                px-5 py-2.5
                text-sm font-medium
                transition
                ${
                  language === "hi"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:bg-[var(--background)]"
                }
              `}
            >
              हिंदी
            </button>
          </div>
        </section>

        {/* ---------------------------------
            Connection & Sync
        --------------------------------- */}

        <section
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            p-5
          "
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {t("syncAndOffline") ||
                "Sync & Offline"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t(
                "syncAndOfflineDescription"
              ) ||
                "Manage catalogue synchronization and offline availability."}
            </p>
          </div>

          <div className="space-y-4">

            {/* Connection Status */}

            <div
              className="
                flex flex-col gap-3
                rounded-lg
                border border-[var(--border)]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p className="font-medium">
                  {t("connectionStatus") ||
                    "Connection Status"}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {isOnline
                    ? t("online") ||
                      "Online"
                    : t("offline") ||
                      "Offline"}
                </p>
              </div>

              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-lg
                  border border-[var(--border)]
                  px-3 py-2
                  text-sm
                "
              >
                <span
                  className={`
                    h-2.5 w-2.5 rounded-full
                    ${
                      isOnline
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  `}
                />

                {isOnline
                  ? t("online") ||
                    "Online"
                  : t("offline") ||
                    "Offline"}
              </div>
            </div>

            {/* Manual Sync */}

            <div
              className="
                flex flex-col gap-4
                rounded-lg
                border border-[var(--border)]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p className="font-medium">
                  {t("catalogueSync") ||
                    "Catalogue Sync"}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {lastSync?.syncedAt
                    ? `${
                        t("lastSynced") ||
                        "Last synced"
                      }: ${formattedLastSync}`
                    : t("neverSynced") ||
                      "Never synced"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSync}
                disabled={
                  syncing || !isOnline
                }
                className="
                  rounded-lg
                  border border-[var(--border)]
                  px-4 py-2.5
                  text-sm font-medium
                  transition
                  hover:bg-[var(--background)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {syncing
                  ? t("syncing") ||
                    "Syncing..."
                  : t("syncNow") ||
                    "Sync Now"}
              </button>
            </div>

            {/* Sync Result */}

            {syncMessage && (
              <p className="text-sm text-green-600">
                {syncMessage}
              </p>
            )}

            {syncError && (
              <p className="text-sm text-red-600">
                {syncError}
              </p>
            )}

            {/* Install POS */}

            {!isInstalled &&
              installPrompt && (
                <div
                  className="
                    flex flex-col gap-4
                    rounded-lg
                    border border-[var(--border)]
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <p className="font-medium">
                      {t("installPos") ||
                        "Install POS"}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Install POS on this device
                      for app-style and offline
                      use.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleInstall}
                    className="
                      rounded-lg
                      border border-[var(--border)]
                      px-4 py-2.5
                      text-sm font-medium
                      transition
                      hover:bg-[var(--background)]
                    "
                  >
                    {t("installPos") ||
                      "Install POS"}
                  </button>
                </div>
              )}

          </div>
        </section>
      </div>
    </div>
  );
}