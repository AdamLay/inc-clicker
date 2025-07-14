import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";
import { useStore } from "../store/store";

export default function ValuePerSecond() {
  const valuePerSecond = useStore(useShallow((state) => state.currentVps));

  return (
    <div className="text-xl text-center">
      <span className="text-sm opacity-75">Gen.</span> {formatNumber(valuePerSecond, 1)}/s
    </div>
  );
}
