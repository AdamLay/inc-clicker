import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { cn } from "../util";

export default function UpdateNotification() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Register the service worker
    const swUpdater = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    setUpdateSW(() => swUpdater);

    return () => {
      // Clean up if needed
    };
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = async () => {
    if (!updateSW) return;

    try {
      await updateSW();
      close();
      // Force reload the page
      window.location.reload();
    } catch (error) {
      console.error("Failed to update service worker:", error);
    }
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-base-200 rounded-lg shadow-lg w-80">
      <div className="space-y-3">
        {offlineReady && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4">
            <p className="font-medium">App ready to work offline!</p>
          </div>
        )}

        {needRefresh && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
            <p className="font-medium">New content available!</p>
            <div className="mt-3 flex gap-2">
              <button
                className={cn("px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600")}
                onClick={handleUpdate}
              >
                Update now
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={close}
              >
                Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
