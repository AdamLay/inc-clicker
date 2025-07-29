import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { upgrades, UpgradeType } from "../data/upgrades";
import { formatNumber } from "../util";

//const isLocal = window.location.host.startsWith("local");

export default function Clicker() {
  const [increment, myUpgrades, addClickEvent, bonusEvent] = useStore(
    useShallow((state) => [state.increase, state.upgrades, state.addClickEvent, state.bonusEvent])
  );
  const vps = useStore(useShallow((state) => state.currentVps));

  const powerUpgrades = upgrades.filter((x) => x.type === UpgradeType.Clicker && myUpgrades.includes(x.name));
  const percentUpgrades = upgrades.filter(
    (x) => x.type === UpgradeType.ClickerPrc && myUpgrades.includes(x.name)
  );

  const clickBase = 2 + vps * 0.1;
  const clickFlatValue = powerUpgrades.reduce((acc, upgrade) => acc + upgrade.multiplier, clickBase);

  const clickValue =
    percentUpgrades.reduce((acc, upgrade) => acc * upgrade.multiplier, clickFlatValue) *
    (bonusEvent?.multiplier ?? 1);

  const handleClick = () => {
    increment(clickValue);
    addClickEvent({ value: clickValue, when: new Date().getTime() });
  };

  return (
    <button className="btn py-12" onClick={handleClick}>
      <p className="flex items-center gap-2">
        <span className="text-lg">Increment {formatNumber(clickValue)}</span>
        <span className="text-xs">(lvl {powerUpgrades.length + percentUpgrades.length})</span>
      </p>
    </button>
  );
}
