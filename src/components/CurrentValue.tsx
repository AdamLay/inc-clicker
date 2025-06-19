import { useStore } from "../store/store";
import { formatNumber } from "../util";

export default function CurrentValue() {
  const value = useStore((state) => state.count);

  document.title = `Inc Clicker: ${formatNumber(value)}`;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-6xl font-bold">{formatNumber(value)}</div>
    </div>
  );
}
