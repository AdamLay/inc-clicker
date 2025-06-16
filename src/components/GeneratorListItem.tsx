import { useShallow } from "zustand/react/shallow";
import { generators, type Generator } from "../data/generators";
import { selectValuePerSecond, useStore } from "../store/store";
import { cn, formatDuration, formatNumber, getGeneratorUpgradeCostBulk } from "../util";
import { memo, useMemo } from "react";
import useStats from "../hooks/useStats";
import { levelThresholds, upgrades } from "../data/upgrades";
import UpgradeListItem from "./UpgradeListItem";

export default function GeneratorListItem({
  name,
  definition,
}: {
  name: string;
  definition: Generator;
}) {
  const [count, countTotal, myUpgrades, addGenerator, myGenerators, buyCount, prestigePoints] =
    useStore(
      useShallow((state) => [
        state.count,
        state.countTotal,
        state.upgrades,
        state.addGenerator,
        state.generators,
        state.buyCount,
        state.prestigePoints,
      ])
    );
  const { getGeneratorVps } = useStats();
  const currentVps = useMemo(
    () =>
      selectValuePerSecond({
        upgrades: myUpgrades,
        generators: myGenerators,
        backgroundMode: null,
        prestigePoints,
      }),
    [myUpgrades, myGenerators, prestigePoints]
  );

  // Static ?
  const genUpgrades = useMemo(() => upgrades.filter((x) => x.parameter === name), [name, upgrades]);
  const baseVps = useMemo(() => getGeneratorVps(name, 1), [myUpgrades, definition]);
  const generator = useMemo(() => myGenerators.find((x) => x.name === name), [myGenerators, name]);

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

  const upgradeCount = useMemo(
    () => genUpgrades.filter((x) => myUpgrades.includes(x.name)).length,
    [genUpgrades, myUpgrades]
  );

  const buyEnabled = count >= upgradeCost;

  if (countTotal < definition.initialCost * 0.01) return null;

  return (
    <>
      <li
        className={cn(
          "list-row flex items-center select-none gap-2",
          buyEnabled ? "cursor-pointer hover:bg-base-200" : "cursor-not-allowed opacity-50",
          countTotal < definition.initialCost * 0.1
            ? "blur-[2px] opacity-25 backdrop-brightness-50"
            : null
        )}
        onClick={buyEnabled ? () => addGenerator(name, upgradeCost, buyCount) : undefined}
      >
        <div className="flex-1">
          <Title name={name} upgradeCount={upgradeCount} />
          <p className="text-xs opacity-75">
            <Details upgradeCost={upgradeCost} baseVps={baseVps} buyCount={buyCount} />
            <TimeUntilBuy count={count} upgradeCost={upgradeCost} currentVps={currentVps} />
          </p>
        </div>
        <Right
          currentVps={currentVps}
          level={generator?.level ?? 0}
          definition={definition}
          myUpgrades={myUpgrades}
        />
      </li>
      <PendingUpgrade
        level={generator?.level ?? 1}
        upgradeCount={upgradeCount}
        myUpgrades={myUpgrades}
        genUpgrades={genUpgrades}
      />
    </>
  );
}

const Title = memo(function ({ name, upgradeCount }: { name: string; upgradeCount: number }) {
  return (
    <p>
      {name} {upgradeCount > 0 && <span>(lvl {upgradeCount})</span>}
    </p>
  );
});

const Details = memo(function ({
  upgradeCost,
  baseVps,
  buyCount,
}: {
  upgradeCost: number;
  baseVps: number;
  buyCount: number;
}) {
  return (
    <>
      {formatNumber(upgradeCost)} - {formatNumber(baseVps * buyCount)}/s -{" "}
      {formatDuration(upgradeCost / (baseVps * buyCount))} PP
    </>
  );
});

const Right = memo(function ({
  myUpgrades,
  definition,
  currentVps,
  level,
}: {
  myUpgrades: string[];
  definition: { name: string; level: number; initialCost: number; multiplier: number };
  currentVps: number;
  level: number;
}) {
  const { getGeneratorVps } = useStats();

  const vps = useMemo(
    () => getGeneratorVps(definition.name, level),
    [myUpgrades, definition, level]
  );

  if (level <= 0) return null;

  const vpsPercent = (vps / currentVps) * 100;
  return (
    <>
      <p>{formatNumber(vps)}/s</p>
      <p className="text-xs opacity-75">{vpsPercent.toFixed(1)}%</p>
      <div className="text-2xl font-bold">{level}</div>
    </>
  );
});

const TimeUntilBuy = function ({
  count,
  upgradeCost,
  currentVps,
}: {
  count: number;
  upgradeCost: number;
  currentVps: number;
}) {
  if (count > upgradeCost) return null;
  const secondsUntilBuy = Math.max(0, (upgradeCost - count) / currentVps);
  return <span>{formatDuration(secondsUntilBuy)}</span>;
};

const PendingUpgrade = memo(function ({
  level,
  upgradeCount,
  myUpgrades,
  genUpgrades,
}: {
  level: number;
  upgradeCount: number;
  myUpgrades: string[];
  genUpgrades: { name: string }[];
}) {
  const maxLevel = levelThresholds.reduce(
    (acc, threshold, idx) => (level >= threshold ? idx + 1 : acc),
    0
  );

  const pendingUpgrade = (() => {
    if (maxLevel <= upgradeCount) return null;
    for (const upgrade of genUpgrades) {
      if (!myUpgrades.includes(upgrade.name)) return upgrade;
    }
  })();

  return pendingUpgrade ? <UpgradeListItem name={pendingUpgrade?.name} icon /> : null;
});
