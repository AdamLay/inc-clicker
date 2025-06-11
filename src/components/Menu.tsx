import { ArrowUp01Icon, HelpCircleIcon, RefreshCwIcon } from "lucide-react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import InstallAppPrompt from "./InstallAppPrompt";
import TotalCountDisplay from "./TotalCountDisplay";
import { formatNumber } from "../util";
import LifetimeTotalDisplay from "./LifetimeTotalDisplay";

export default function Menu() {
  const [setHelpOpen, setResetConfirmOpen, setPrestigeConfirmOpen, clicks, prestigePoints] =
    useStore(
      useShallow((state) => [
        state.setHelpOpen,
        state.setResetConfirmOpen,
        state.setPrestigeConfirmOpen,
        state.clicks,
        state.prestigePoints,
      ])
    );
  return (
    <div className="drawer-side z-50">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu bg-base-200 text-base-content w-80 min-h-full pt-4 px-0">
        <ul className="gap-4 flex flex-col">
          <InstallAppPrompt />

          <li>
            <button
              className="btn btn-ghost text-primary justify-start"
              onClick={() => setPrestigeConfirmOpen(true)}
            >
              <ArrowUp01Icon /> Prestige
            </button>
          </li>
          <li>
            <button
              className="btn btn-ghost text-warning justify-start"
              onClick={() => setResetConfirmOpen(true)}
            >
              <RefreshCwIcon /> Reset Game
            </button>
          </li>
          <li>
            <button className="btn btn-ghost justify-start" onClick={() => setHelpOpen(true)}>
              <HelpCircleIcon /> Help
            </button>
          </li>
        </ul>
        <div className="p-4">
          <p className="font-bold mt-6">Stats</p>
          <p>
            Total: <TotalCountDisplay />
          </p>
          <p>
            Lifetime: <LifetimeTotalDisplay />
          </p>
          <p>
            Clicks: <span>{formatNumber(clicks)}</span>
          </p>
          <p>
            VIPP: <span>{formatNumber(prestigePoints)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
