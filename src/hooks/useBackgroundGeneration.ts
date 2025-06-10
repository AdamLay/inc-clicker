import { useEffect } from "react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";

export default function useBackgroundGeneration() {
  const [setBackgroundMode] = useStore(useShallow((state) => [state.setBackgroundMode]));

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      // The tab is now in the background (inactive)
      console.log("Tab is in the background");
      setBackgroundMode(true); // Enable background generation
    } else if (document.visibilityState === "visible") {
      // The tab is now active
      console.log("Tab is active");
      setBackgroundMode(false); // Disable background generation
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  });
}
