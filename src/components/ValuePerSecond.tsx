import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";
import { selectValuePerSecond, useStore } from "../store/store";

export default function ValuePerSecond() {
  const valuePerSecond = useStore(useShallow(selectValuePerSecond));

  return (
    <div className="text-xl text-center">
      <span className="text-sm opacity-75">Generators</span> {formatNumber(valuePerSecond)}/s
    </div>
  );
}
