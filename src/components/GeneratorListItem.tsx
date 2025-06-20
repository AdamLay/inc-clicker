import { useShallow } from "zustand/react/shallow";
import { GEN_MAX_LEVEL, type Generator } from "../data/generators";
import { useStore } from "../store/store";
import { cn, formatDuration, formatNumber, getGeneratorUpgradeCost } from "../util";
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
  const [
    count,
    countTotal,
    currentVps,
    myUpgrades,
    addGenerator,
    ascendGenerator,
    myGenerators,
    buyCountSelection,
  ] = useStore(
    useShallow((state) => [
      state.count,
      state.countTotal,
      state.currentVps,
      state.upgrades,
      state.addGenerator,
      state.ascendGenerator,
      state.generators,
      state.buyCount,
    ])
  );
  const { getGeneratorVps } = useStats();

  // Static ?
  const generator = useMemo(() => myGenerators.find((x) => x.name === name), [myGenerators, name]);
  const genUpgrades = useMemo(() => upgrades.filter((x) => x.parameter === name), [name]);
  const baseVps = useMemo(
    () => getGeneratorVps(name, 1, generator?.ascension ?? 0),
    [generator?.ascension, name, getGeneratorVps]
  );
  const currentLevel = generator?.level ?? 0;
  const ascensionReady = currentLevel >= GEN_MAX_LEVEL;
  const upgradeCostOne = useMemo(
    () =>
      getGeneratorUpgradeCost(
        definition.initialCost,
        definition.multiplier,
        currentLevel,
        generator?.ascension ?? 0
      ),
    [currentLevel, definition.initialCost, definition.multiplier, generator?.ascension]
  );

  const { totalCost: upgradeCost, buyCount } = (() => {
    let totalCost = 0;
    let i = 0;
    const ascension = generator?.ascension ?? 0;
    const buyMax = buyCountSelection === -1;
    const maxBuyCount = buyMax ? GEN_MAX_LEVEL : buyCountSelection;
    while (totalCost < count && i < maxBuyCount && currentLevel + i < GEN_MAX_LEVEL) {
      const cost = getGeneratorUpgradeCost(
        definition.initialCost,
        definition.multiplier,
        currentLevel + i,
        ascension
      );
      if (buyMax && totalCost + cost > count) break; // Don't exceed count
      totalCost += cost;
      i++;
    }
    return { totalCost, buyCount: i };
  })();

  const upgradeCount = useMemo(
    () => genUpgrades.filter((x) => myUpgrades.includes(x.name)).length,
    [genUpgrades, myUpgrades]
  );

  const buyEnabled = buyCount >= 1 && count >= upgradeCost; // && currentLevel + buyCount <= GEN_MAX_LEVEL;

  const handleClick = () => {
    if (ascensionReady) {
      // Ascend!
      ascendGenerator(name, upgradeCostOne);
    } else {
      addGenerator(name, upgradeCost, buyCount);
    }
  };

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
        onClick={buyEnabled ? handleClick : undefined}
      >
        <div className="flex-1">
          <Title name={name} upgradeCount={upgradeCount} ascension={generator?.ascension ?? 0} />
          {ascensionReady ? (
            <p className="text-sm opacity-75">Ascension ready! {formatNumber(upgradeCostOne)}</p>
          ) : (
            <p className="text-xs opacity-75">
              <Details
                upgradeCost={upgradeCost}
                baseVps={baseVps}
                buyCount={buyCount}
                buyCountSelection={buyCountSelection}
              />
              <TimeUntilBuy count={count} upgradeCost={upgradeCost} currentVps={currentVps} />
            </p>
          )}
        </div>
        <Right
          currentVps={currentVps}
          level={generator?.level ?? 0}
          ascension={generator?.ascension ?? 0}
          definition={definition}
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

const Title = memo(function ({
  name,
  upgradeCount,
  ascension,
}: {
  name: string;
  upgradeCount: number;
  ascension: number;
}) {
  return (
    <p>
      {name} {upgradeCount > 0 && <span>(lvl {upgradeCount})</span>}{" "}
      {ascension > 0 && <span className="text-secondary">*{ascension}*</span>}
    </p>
  );
});

const Details = memo(function ({
  upgradeCost,
  baseVps,
  buyCount,
  buyCountSelection,
}: {
  upgradeCost: number;
  baseVps: number;
  buyCount: number;
  buyCountSelection: number;
}) {
  return (
    <>
      {buyCountSelection === -1 ? (
        <span>
          <span className="text-primary">+{buyCount}</span> ={" "}
        </span>
      ) : null}{" "}
      {formatNumber(upgradeCost, 1)} <span className="text-primary-content">|</span>{" "}
      {formatNumber(baseVps * buyCount, 1)}/s <span className="text-primary-content">|</span>{" "}
      {formatDuration(upgradeCost / (baseVps * buyCount))} PP
    </>
  );
});

const Right = memo(function ({
  definition,
  currentVps,
  level,
  ascension,
}: {
  definition: { name: string; level: number; initialCost: number; multiplier: number };
  currentVps: number;
  level: number;
  ascension: number;
}) {
  const { getGeneratorVps } = useStats();

  const vps = useMemo(
    () => getGeneratorVps(definition.name, level, ascension),
    [getGeneratorVps, definition.name, level, ascension]
  );

  if (level <= 0) return null;

  const vpsPercent = (vps / currentVps) * 100;
  return (
    <>
      <div className="flex flex-col items-end">
        <p>{formatNumber(vps, 1)}/s</p>
        <p className="text-xs opacity-75">{vpsPercent.toFixed(1)}%</p>
      </div>
      <div className="text-2xl font-bold">{level >= GEN_MAX_LEVEL ? "MAX" : level}</div>
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
  return (
    <span>
      {" "}
      <span className="text-primary-content">|</span> {formatDuration(secondsUntilBuy)}
    </span>
  );
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
