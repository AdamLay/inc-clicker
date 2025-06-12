import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";

export default function useDebugCheats() {
  const [setCount_Debug, setPrestige_Debug] = useStore(
    useShallow((state) => [state.setCount_Debug, state.setPrestige_Debug])
  );
  const cheats = {
    setCount: (amount: number) => {
      setCount_Debug(amount);
    },
    setPrestige: (amt: number) => {
      setPrestige_Debug(amt);
    },
  };

  (window as any).cheats = cheats;

  return cheats;
}
