import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { upgrades, UpgradeType } from "../data/upgrades";

export default function Clicker() {
  const [increment, myUpgrades] = useStore(useShallow((state) => [state.increase, state.upgrades]));

  const boughtUpgrades = upgrades.filter(
    (x) => x.type === UpgradeType.Clicker && myUpgrades.includes(x.name)
  );

  const clickValue = boughtUpgrades.reduce((acc, upgrade) => acc * upgrade.multiplier, 1);

  const handleClick = () => {
    increment(clickValue);
  };

  return (
    <button className="btn" onClick={handleClick}>
      Increment! <span className="text-xs">({clickValue})</span>
    </button>
  );
}
