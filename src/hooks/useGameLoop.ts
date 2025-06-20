import { useEffect, useRef } from "react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";

export default function useGameLoop() {
  const increment = useStore(useShallow((state) => state.increase));
  const valuePerSecond = useStore(useShallow(state => state.currentVps));
  const lastUpdate = useRef(new Date().getTime());

  useEffect(() => {

    const incLoop = setInterval(() => {
      const deltaTime = new Date().getTime() - lastUpdate.current;

      increment((valuePerSecond * deltaTime) / 1000);

      lastUpdate.current = new Date().getTime();
    }, 200);
    return () => {
      clearInterval(incLoop);
    };
  }, [increment, valuePerSecond]);
}
