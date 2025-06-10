// This script exports the PWA components
// The actual service worker registration happens in the UpdateNotification component

// This file is imported by main.tsx to ensure we initialize the PWA components
export { default as OfflineNotification } from "./components/InstallAppPrompt";
