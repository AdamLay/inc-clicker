import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import BuyCountSelector from "./components/BuyCountSelector";
import Clicker from "./components/Clicker";
import ClicksValuePerSecond from "./components/ClicksValuePerSecond";
import CurrentValue from "./components/CurrentValue";
import Generators from "./components/Generators";
import HelpDialog from "./components/HelpDialog";
import Interest from "./components/Interest";
import Menu from "./components/Menu";
import NavBar from "./components/NavBar";
import PrestigeConfirmationModal from "./components/PrestigeConfirmationModal";
import RandomEventButton from "./components/RandomEventButton";
import ResetConfirmationModal from "./components/ResetConfirmationModal";
import Upgrades from "./components/Upgrades";
import ValuePerSecond from "./components/ValuePerSecond";
import useBackgroundGeneration from "./hooks/useBackgroundGeneration";
import useDebugCheats from "./hooks/useDebugCheats";
import useGameLoop from "./hooks/useGameLoop";
import { useStore } from "./store/store";
import { cn } from "./util";
//import StatsGraphs from "./components/graphs/StatsGraphs";

export default function App() {
  const [tab, setTab] = useState(0);
  const [prestigeConfirmOpen] = useStore(useShallow((state) => [state.prestigeConfirmOpen]));
  useGameLoop();
  useBackgroundGeneration();
  useDebugCheats();

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <NavBar />
          {/* <StatsGraphs /> */}
          <div className="max-w-2xl mx-auto px-2">
            <div className="card">
              <div className="sticky top-0 card z-10 bg-base-100 pb-1 shadow-xs">
                <CurrentValue />
                <div className="grid grid-cols-2 my-2">
                  <ValuePerSecond />
                  <ClicksValuePerSecond />
                  <Interest />
                </div>

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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className={cn("hidden md:block", { block: tab === 0 })}>
                  <Generators />
                </div>
                <div className={cn("hidden md:block", { block: tab === 1 })}>
                  <Upgrades />
                </div>
              </div>
              <div className="fixed left-0 right-0 bottom-0 p-2 bg-base-100">
                <BuyCountSelector />
                <div className="flex flex-row items-center gap-2 mt-2">
                  <Clicker />
                  <RandomEventButton />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Menu />
      </div>
      <HelpDialog />
      <ResetConfirmationModal />
      {prestigeConfirmOpen && <PrestigeConfirmationModal />}
    </>
  );
}
