import { ArrowUp01Icon, HelpCircleIcon, RefreshCwIcon, Download, Upload } from "lucide-react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import InstallAppPrompt from "./InstallAppPrompt";
import TotalCountDisplay from "./TotalCountDisplay";
import { formatNumber, getPrestigeMultiplier } from "../util";
import LifetimeTotalDisplay from "./LifetimeTotalDisplay";
import { useRef } from "react";

export default function Menu() {
  const [
    setHelpOpen,
    setResetConfirmOpen,
    setPrestigeConfirmOpen,
    clicks,
    prestigePoints,
    saveGameToFile,
  ] = useStore(
    useShallow((state) => [
      state.setHelpOpen,
      state.setResetConfirmOpen,
      state.setPrestigeConfirmOpen,
      state.clicks,
      state.prestigePoints,
      state.saveGameToFile,
    ])
  );

  const loadGameFromFile = useStore((state) => state.loadGameFromFile);

  // Reference to the file input element for game loading
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        loadGameFromFile(content);
      };

      reader.readAsText(file);

      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

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
            <button className="btn btn-ghost justify-start" onClick={saveGameToFile}>
              <Download /> Save Game
            </button>
          </li>

          <li>
            <button className="btn btn-ghost justify-start" onClick={handleLoadClick}>
              <Upload /> Load Game
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </li>

          <li>
            <button className="btn btn-ghost justify-start" onClick={() => setHelpOpen(true)}>
              <HelpCircleIcon /> Help
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
            VIPP: {getPrestigeMultiplier(prestigePoints).toFixed(1)}x (
            <span>{formatNumber(prestigePoints)})</span>
          </p>
        </div>
      </div>
    </div>
  );
}
