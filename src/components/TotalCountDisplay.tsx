import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { formatNumber } from "../util";

export default function TotalCountDisplay() {
  const countTotal = useStore(useShallow((state) => state.countTotal));

  return <span>{formatNumber(countTotal)}</span>;
}
