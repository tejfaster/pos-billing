let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  window.dispatchEvent(new Event("pos-install-available"));
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  window.dispatchEvent(new Event("pos-app-installed"));
});

export async function installPWA() {
  if (!deferredPrompt) {
    return { outcome: "unavailable" };
  }

  const promptEvent = deferredPrompt;
  deferredPrompt = null;

  await promptEvent.prompt();
  return await promptEvent.userChoice;
}