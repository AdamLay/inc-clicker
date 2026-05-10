import { useStore } from "../store/store";
import { formatNumber, formatNumberSplit } from "../util";

export default function CurrentValue() {
  const value = useStore((state) => state.count);

  document.title = `Inc Clicker: ${formatNumber(value)}`;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-5xl font-bold">{formatNumberSplit(value)}</div>
    </div>
  );
}
