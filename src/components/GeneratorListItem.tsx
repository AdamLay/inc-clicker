import { useShallow } from "zustand/react/shallow";
import { generators } from "../data/generators";
import { selectValuePerSecond, useStore } from "../store/store";
import { cn, formatDuration, formatNumber, getGeneratorUpgradeCostBulk } from "../util";
import { useMemo } from "react";
import useStats from "../hooks/useStats";
import { upgrades } from "../data/upgrades";

export default function GeneratorListItem({ name }: { name: string }) {
  const [count, myUpgrades, addGenerator, myGenerators, buyCount] = useStore(
    useShallow((state) => [
      state.count,
      state.upgrades,
      state.addGenerator,
      state.generators,
      state.buyCount,
    ])
  );
  const currentVps = selectValuePerSecond({ upgrades: myUpgrades, generators: myGenerators });
  const definition = generators.find((g) => g.name === name)!;
  const generator = myGenerators.find((x) => x.name === name);
  const { getGeneratorVps } = useStats();
  const upgradeCost = useMemo(
    () =>
      getGeneratorUpgradeCostBulk(
        definition.initialCost,
        definition.multiplier,
        generator?.level ?? 0,
        (generator?.level ?? 0) + buyCount
      ),
    [definition, generator, buyCount]
  );

  const vps = useMemo(
    () => getGeneratorVps(name, generator?.level ?? 0),
    [myUpgrades, definition, generator]
  );
  const baseVps = useMemo(() => getGeneratorVps(name, 1), [myUpgrades, definition]);
  const upgradeCount = useMemo(
    () =>
      upgrades.filter((x) => x.parameter === name).filter((x) => myUpgrades.includes(x.name))
        .length,
    [myUpgrades]
  );

  const buyEnabled = count >= upgradeCost;
  const secondsUntilBuy = Math.max(0, (upgradeCost - count) / currentVps);

  return (
    <li
      className={cn(
        "list-row flex items-center select-none gap-2",
        buyEnabled ? "cursor-pointer hover:bg-base-200" : "cursor-not-allowed opacity-50"
      )}
      onClick={buyEnabled ? () => addGenerator(name, upgradeCost, buyCount) : undefined}
    >
      <div className="flex-1">
        <p>
          {name} {upgradeCount > 0 && <span>(lvl {upgradeCount})</span>} | {formatNumber(vps)}/s
        </p>
        <p className="text-xs opacity-75">
          {formatNumber(upgradeCost)} - {formatNumber(baseVps)}/s -{" "}
          {formatDuration(upgradeCost / baseVps)} PP
          {secondsUntilBuy > 0 && <> - {formatDuration(secondsUntilBuy)}</>}
        </p>
        <p className="text-xs opacity-75"></p>
      </div>
      <div className="text-2xl font-bold">{generator?.level}</div>
    </li>
  );
}
