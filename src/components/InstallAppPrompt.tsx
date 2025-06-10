import { useEffect, useState } from "react";

export default function InstallAppPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Capture the install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Hide the install button regardless of outcome
    setShowInstallPrompt(false);
    setDeferredPrompt(null);

    console.log(`User response to the install prompt: ${outcome}`);
  };

  if (!showInstallPrompt) return null;

  return (
    <button className="btn btn-ghost" onClick={handleInstallClick}>
      Install App
    </button>
  );
}
