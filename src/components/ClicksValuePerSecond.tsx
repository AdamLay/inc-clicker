import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";

export default function ClicksValuePerSecond() {
  const clickEvents = useStore(useShallow((state) => state.clickEvents));
  const [vps, setVps] = useState(0);

  useEffect(() => {
    const updateVps = () => {
      const values = clickEvents
        .filter((x) => x.when >= new Date().getTime() - 1000)
        .map((x) => x.value);
      setVps(values.reduce((acc, value) => acc + value, 0));
    };
    updateVps();
    const interval = setInterval(updateVps, 250);
    return () => clearInterval(interval);
  }, [clickEvents]);

  return (
    <>
      <div className="text-xl text-center">
        <span className="text-sm opacity-75">Clicks</span> {formatNumber(vps)}/s
      </div>
    </>
  );
}
