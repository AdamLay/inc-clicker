import { useEffect } from "react";

const onVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    // The tab is now in the background (inactive)
    console.log("Tab is in the background");
  } else if (document.visibilityState === "visible") {
    // The tab is now active
    console.log("Tab is active");
  }
};

export default function useBackgroundGeneration() {
  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  });
}
