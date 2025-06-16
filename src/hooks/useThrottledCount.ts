import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";

export default function useThrottledCount() {
  const count = useStore(useShallow((state) => state.count));
}
