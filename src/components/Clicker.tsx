import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { upgrades, UpgradeType } from "../data/upgrades";
import { formatNumber, getPrestigeMultiplier } from "../util";

const isLocal = window.location.host.startsWith("local");

export default function Clicker() {
  const [increment, myUpgrades, addClickEvent, bonusEvent, prestigePoints] = useStore(
    useShallow((state) => [
      state.increase,
      state.upgrades,
      state.addClickEvent,
      state.bonusEvent,
      state.prestigePoints,
    ])
  );

  const boughtUpgrades = upgrades.filter(
    (x) => x.type === UpgradeType.Clicker && myUpgrades.includes(x.name)
  );
  const prestigeMult = getPrestigeMultiplier(prestigePoints);

  const clickValue =
    boughtUpgrades.reduce((acc, upgrade) => acc * upgrade.multiplier, isLocal ? 10 : 1) *
    prestigeMult *
    (bonusEvent?.multiplier ?? 1);

  const handleClick = () => {
    increment(clickValue);
    addClickEvent({ value: clickValue, when: new Date().getTime() });
  };

  return (
    <button className="btn py-12" onClick={handleClick}>
      <p className="flex items-center gap-2">
        <span className="text-lg">Increment {formatNumber(clickValue)}</span>
        <span className="text-xs">(lvl {boughtUpgrades.length})</span>
      </p>
    </button>
  );
}
