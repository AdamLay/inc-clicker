import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";

export default function useDebugCheats() {
  const [setCount_Debug] = useStore(useShallow((state) => [state.setCount_Debug]));
  const cheats = {
    setCount: (amount: number) => {
      setCount_Debug(amount);
    },
    resetGame: () => {
      console.log("Resetting game");
      // Implement the logic to reset the game state
    },
    toggleDebugMode: () => {
      console.log("Toggling debug mode");
      // Implement the logic to toggle debug mode
    },
  };

  (window as any).cheats = cheats;

  return cheats;
}
