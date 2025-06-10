import { HelpCircleIcon, RefreshCwIcon } from "lucide-react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import InstallAppPrompt from "./InstallAppPrompt";
import TotalCountDisplay from "./TotalCountDisplay";
import { formatNumber } from "../util";

export default function Menu() {
  const [setHelpOpen, setResetConfirmOpen, clicks] = useStore(
    useShallow((state) => [state.setHelpOpen, state.setResetConfirmOpen, state.clicks])
  );
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu bg-base-200 text-base-content w-80 min-h-full p-4">
        <ul>
          <InstallAppPrompt />
          <li>
            <button className="btn btn-ghost" onClick={() => setHelpOpen(true)}>
              <HelpCircleIcon /> Help
            </button>
          </li>{" "}
          <li>
            <button
              className="btn btn-ghost text-warning"
              onClick={() => setResetConfirmOpen(true)}
            >
              <RefreshCwIcon /> Reset Game
            </button>
          </li>
        </ul>
        <p className="font-bold">Stats</p>
        <p>
          Total: <TotalCountDisplay />
        </p>
        <p>
          Clicks: <span>{formatNumber(clicks)}</span>
        </p>
      </div>
    </div>
  );
}
