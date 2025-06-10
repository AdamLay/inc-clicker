import { useEffect, useRef } from "react";
import { selectValuePerSecond, useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";

export default function useGameLoop() {
  const increment = useStore(useShallow((state) => state.increase));
  const valuePerSecond = useStore(useShallow(selectValuePerSecond));
  const lastUpdate = useRef(new Date().getTime());

  useEffect(() => {
    console.log("VPS", formatNumber(valuePerSecond));

    const incLoop = setInterval(() => {
      const deltaTime = new Date().getTime() - lastUpdate.current;

      increment((valuePerSecond * deltaTime) / 1000);

      lastUpdate.current = new Date().getTime();
    }, 200);
    return () => {
      clearInterval(incLoop);
    };
  }, [valuePerSecond]);
}
