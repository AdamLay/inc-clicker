import CurrentValue from "./components/CurrentValue";
import Generators from "./components/Generators";
import Upgrades from "./components/Upgrades";
import Clicker from "./components/Clicker";
import useGameLoop from "./hooks/useGameLoop";
import ValuePerSecond from "./components/ValuePerSecond";
import useBackgroundGeneration from "./hooks/useBackgroundGeneration";
import useDebugCheats from "./hooks/useDebugCheats";
import { useState } from "react";
import { cn } from "./util";
import NavBar from "./components/NavBar";
import HelpDialog from "./components/HelpDialog";
import Menu from "./components/Menu";
import ResetConfirmationModal from "./components/ResetConfirmationModal";
import ClicksValuePerSecond from "./components/ClicksValuePerSecond";

export default function App() {
  const [tab, setTab] = useState(0);
  useGameLoop();
  useBackgroundGeneration();
  useDebugCheats();

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <NavBar />
          <div className="max-w-2xl mx-auto px-2">
            <div className="card">
              <CurrentValue />
              <div className="grid grid-cols-2 my-2">
                <ValuePerSecond />
                <ClicksValuePerSecond />
              </div>
              <Clicker />
              <div role="tablist" className="tabs tabs-lift mt-2 md:hidden">
                <a
                  role="tab"
                  className={cn("tab flex-1", { "tab-active": tab === 0 })}
                  onClick={() => setTab(0)}
                >
                  Generators
                </a>
                <a
                  role="tab"
                  className={cn("tab flex-1", { "tab-active": tab === 1 })}
                  onClick={() => setTab(1)}
                >
                  Upgrades
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className={cn("hidden md:block", { block: tab === 0 })}>
                  <Generators />
                </div>
                <div className={cn("hidden md:block", { block: tab === 1 })}>
                  <Upgrades />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Menu />
      </div>
      <HelpDialog />
      <ResetConfirmationModal />
    </>
  );
}
