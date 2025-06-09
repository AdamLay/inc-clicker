import { useEffect, useState } from "react";
import { cn } from "../util";

export default function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for changes in online status
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Capture the install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
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

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {!isOnline && (
        <div className="p-3 bg-yellow-500 text-white rounded-lg shadow-lg">
          You're currently offline. Some features may be limited.
        </div>
      )}

      {showInstallPrompt && (
        <div
          className={cn(
            "p-3 bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-600"
          )}
          onClick={handleInstallClick}
        >
          Install Inc Clicker app
        </div>
      )}
    </div>
  );
}
