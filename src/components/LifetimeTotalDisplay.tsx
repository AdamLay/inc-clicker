import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { formatNumber } from "../util";

export default function LifetimeTotalDisplay() {
  const lifetimeTotal = useStore(useShallow((state) => state.lifetimeTotal));

  return <span>{formatNumber(lifetimeTotal)}</span>;
}
