import { ArrowUp, Check } from "lucide-react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { upgrades, UpgradeType } from "../data/upgrades";
import useStats from "../hooks/useStats";
import { selectValuePerSecond, useStore } from "../store/store";
import { cn, formatDuration, formatNumber } from "../util";

export default function UpgradeListItem({
  name,
  icon,
  compact,
  forceShow,
  disabled,
}: {
  name: string;
  icon?: boolean;
  compact?: boolean;
  forceShow?: boolean;
  disabled?: boolean;
}) {
  const [count, countTotal, currentVps, addUpgrade, myUpgrades, generators, prestigePoints] =
    useStore(
      useShallow((state) => [
        state.count,
        state.countTotal,
        state.currentVps,
        state.addUpgrade,
        state.upgrades,
        state.generators,
        state.prestigePoints,
      ]),
    );
  const { getGeneratorVps } = useStats();
  const definition = useMemo(() => upgrades.find((g) => g.name === name)!, [name]);
  const gen = useMemo(
    () =>
      definition.type === UpgradeType.Generator
        ? generators.find((g) => g.name === definition.parameter)
        : null,
    [definition.parameter, definition.type, generators],
  );
  const bought = useMemo(() => myUpgrades.includes(name), [myUpgrades, name]);
  const buyEnabled = !bought && count >= definition.cost && !disabled;
  const conditionSatisfied = !definition.condition || definition.condition(gen?.level);
  const show = forceShow || (countTotal >= definition.cost * 0.1 && conditionSatisfied);

  const helperText = useMemo(() => {
    if (definition.type === UpgradeType.Clicker) {
      return `Increases click value by ${definition.multiplier}.`;
    }
    if (definition.type === UpgradeType.ClickerPrc) {
      return `Increases click multiplier by ${definition.multiplier.toFixed(1)}x.`;
    }
    if (definition.type === UpgradeType.Global) {
      return "Increases all generators' output.";
    }
    if (definition.type === UpgradeType.Interest) {
      return "Returns a percentage of your current balance every 10 seconds.";
    }
    if (definition.type === UpgradeType.Generator) {
      return `Increase output by ${definition.multiplier.toFixed(1)}x`;
    }
  }, [definition]);

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
        [...myUpgrades, name],
      );
      const currentGenVps = getGeneratorVps(
        definition.parameter!,
        gen?.level ?? 0,
        gen?.ascension ?? 0,
        myUpgrades,
      );
      const diff = newGenVps - currentGenVps;
      return definition.cost / diff;
    }
    return 0;
  })();

  const secondsUntilBuy = Math.max(0, (definition.cost - count) / currentVps);

  return (
    <li
      className={cn(
        "flex items-center select-none",
        buyEnabled ? "cursor-pointer hover:bg-base-200" : "cursor-not-allowed opacity-50",
        compact ? "p-2 px-0" : "list-row",
      )}
      onClick={
        buyEnabled
          ? (e) => {
              e.stopPropagation();
              e.preventDefault();
              addUpgrade(name, definition.cost);
            }
          : undefined
      }
    >
      <div className="text-primary">{icon && <ArrowUp />}</div>
      <div className={cn("flex-1", compact ? "flex justify-between" : "")}>
        {compact ? (
          <span className="text-xs ml-1">{helperText}</span>
        ) : (
          <p>
            {name} - <span className="text-xs">{helperText}</span>
          </p>
        )}
        <div className="text-xs font-semibold opacity-80">
          {formatNumber(definition.cost)} -{" "}
          <span className="text-secondary">{formatDuration(pp)} PP</span>
          {secondsUntilBuy > 0 && <> - {formatDuration(secondsUntilBuy)}</>}
        </div>
      </div>
      {bought && <Check />}
    </li>
  );
}
