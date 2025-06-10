import { HelpCircleIcon, RefreshCwIcon } from "lucide-react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import InstallAppPrompt from "./InstallAppPrompt";

export default function Menu() {
  const [setHelpOpen, setResetConfirmOpen] = useStore(
    useShallow((state) => [state.setHelpOpen, state.setResetConfirmOpen])
  );
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <li>
          <InstallAppPrompt />
        </li>
        <li>
          <button className="btn btn-ghost" onClick={() => setHelpOpen(true)}>
            <HelpCircleIcon /> Help
          </button>
        </li>{" "}
        <li>
          <button className="btn btn-ghost text-warning" onClick={() => setResetConfirmOpen(true)}>
            <RefreshCwIcon /> Reset Game
          </button>
        </li>
      </ul>
    </div>
  );
}
