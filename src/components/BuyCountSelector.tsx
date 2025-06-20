import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { cn } from "../util";

export default function BuyCountSelector() {
  const [buyCount, setBuyCount] = useStore(
    useShallow((state) => [state.buyCount, state.setBuyCount])
  );
  const btn = (count: number) => {
    return (
      <button
        className={cn(
          "flex-1 btn btn-sm join-item",
          buyCount === count ? "btn-primary" : "btn-outline"
        )}
        onClick={() => setBuyCount(count)}
      >
        {count < 0 ? "Max" : count}
      </button>
    );
  };
  return (
    <div className="join flex flex-row">
      {btn(1)}
      {btn(5)}
      {btn(10)}
      {btn(25)}
      {btn(-1)}
    </div>
  );
}
