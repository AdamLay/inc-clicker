import { useShallow } from "zustand/react/shallow";
import { selectValuePerSecond, useStore } from "../store/store";
import { cn, formatDuration, formatNumber } from "../util";
import { upgrades, UpgradeType } from "../data/upgrades";
import { ArrowUp, Check } from "lucide-react";
import useStats from "../hooks/useStats";

export default function UpgradeListItem({ name, icon }: { name: string; icon?: boolean }) {
  const [count, countTotal, addUpgrade, myUpgrades, generators, prestigePoints] = useStore(
    useShallow((state) => [
      state.count,
      state.countTotal,
      state.addUpgrade,
      state.upgrades,
      state.generators,
      state.prestigePoints,
    ])
  );
  const currentVps = selectValuePerSecond({
    upgrades: myUpgrades,
    generators,
    backgroundMode: null,
    prestigePoints,
  });
  const { getGeneratorVps } = useStats();
  const definition = upgrades.find((g) => g.name === name)!;
  const gen =
    definition.type === UpgradeType.Generator
      ? generators.find((g) => g.name === definition.parameter)
      : null;
  const bought = myUpgrades.includes(name);
  const buyEnabled = !bought && count >= definition.cost;
  const conditionSatisfied = !definition.condition || definition.condition(gen?.level);
  const show = countTotal >= definition.cost * 0.1 && conditionSatisfied;

  if (!show && !bought) return null;

  const pp = (() => {
    if (definition.type === UpgradeType.Clicker) return 0;
    if (definition.type === UpgradeType.Global) {
      const vps = selectValuePerSecond({
        upgrades: [...myUpgrades, name],
        generators,
        backgroundMode: null,
        prestigePoints,
      });
      const diff = vps - currentVps;
      return definition.cost / diff;
    }
    if (definition.type === UpgradeType.Generator) {
      const newGenVps = getGeneratorVps(
        definition.parameter!,
        gen?.level ?? 0,
        gen?.ascension ?? 0,
        [...myUpgrades, name]
      );
      const currentGenVps = getGeneratorVps(
        definition.parameter!,
        gen?.level ?? 0,
        gen?.ascension ?? 0,
        myUpgrades
      );
      const diff = newGenVps - currentGenVps;
      return definition.cost / diff;
    }
    return 0;
  })();

  const helperText = (() => {
    if (definition.type === UpgradeType.Clicker) {
      return `Increases click value by ${definition.multiplier}.`;
    }
    if (definition.type === UpgradeType.ClickerPrc) {
      return `Increases click multiplier by ${definition.multiplier.toFixed(1)}x.`;
    }
    if (definition.type === UpgradeType.Global) {
      return "Increases all generators' output.";
    }
    if (definition.type === UpgradeType.Generator) {
      return `Increase ${definition.parameter} output by ${definition.multiplier.toFixed(1)}x`;
    }
  })();

  const secondsUntilBuy = Math.max(0, (definition.cost - count) / currentVps);

  return (
    <li
      className={cn(
        "list-row flex items-center select-none",
        buyEnabled ? "cursor-pointer hover:bg-base-200" : "cursor-not-allowed opacity-50"
      )}
      onClick={buyEnabled ? () => addUpgrade(name, definition.cost) : undefined}
    >
      <div className="text-primary">{icon && <ArrowUp />}</div>
      <div className="flex-1">
        <p>
          {name} - <span className="text-xs">{helperText}</span>
        </p>
        <div className="text-xs font-semibold opacity-60">
          {formatNumber(definition.cost)} - {formatDuration(pp)} PP
          {secondsUntilBuy > 0 && <> - {formatDuration(secondsUntilBuy)}</>}
        </div>
      </div>
      {bought && <Check />}
    </li>
  );
}
