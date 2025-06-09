import CurrentValue from "./components/CurrentValue";
import Generators from "./components/Generators";
import Upgrades from "./components/Upgrades";
import Clicker from "./components/Clicker";
import useGameLoop from "./hooks/useGameLoop";
import ValuePerSecond from "./components/ValuePerSecond";
import useBackgroundGeneration from "./hooks/useBackgroundGeneration";
import useDebugCheats from "./hooks/useDebugCheats";
import { OfflineNotification } from "./registerSW";

export default function App() {
  useGameLoop();
  useBackgroundGeneration();
  useDebugCheats();

  return (
    <div className="max-w-lg mx-auto px-2 mt-4">
      <div className="card">
        <CurrentValue />
        <ValuePerSecond />
        <Clicker />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Generators />
          <Upgrades />
        </div>
      </div>
      <OfflineNotification />
    </div>
  );
}
