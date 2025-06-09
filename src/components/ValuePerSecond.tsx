import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";
import { selectValuePerSecond, useStore } from "../store/store";

export default function ValuePerSecond() {
  const valuePerSecond = useStore(useShallow(selectValuePerSecond));

  return (
    <div className="text-xl text-center text-gray-700 dark:text-gray-200">
      {formatNumber(valuePerSecond)}/s
    </div>
  );
}
