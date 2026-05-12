import { Star } from "lucide-react";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { GEN_MAX_LEVEL, type Generator } from "../data/generators";
import { GEN_MAX_UPGRADE, levelThresholds, upgrades } from "../data/upgrades";
import useStats from "../hooks/useStats";
import { useStore } from "../store/store";
import { cn, formatDuration, formatNumber, getGeneratorUpgradeCost } from "../util";
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
    ]),
  );
  const { getGeneratorVps } = useStats();

  // Static ?
  const generator = useMemo(() => myGenerators.find((x) => x.name === name), [myGenerators, name]);
  const genUpgrades = useMemo(() => upgrades.filter((x) => x.parameter === name), [name]);

  //if (name == "Cosmic Forge") console.log(genUpgrades);

  const baseVps = useMemo(
    () => getGeneratorVps(name, 1, generator?.ascension ?? 0),
    [generator?.ascension, name, getGeneratorVps],
  );
  const currentLevel = generator?.level ?? 0;
  const upgradeCostOne = useMemo(
    () =>
      getGeneratorUpgradeCost(
        definition.initialCost,
        definition.multiplier,
        currentLevel,
        generator?.ascension ?? 0,
      ),
    [currentLevel, definition.initialCost, definition.multiplier, generator?.ascension],
  );

  const upgradeCount = useMemo(
    () => genUpgrades.filter((x) => myUpgrades.includes(x.name)).length,
    [genUpgrades, myUpgrades],
  );

  const isMaxUpgrade = GEN_MAX_UPGRADE === upgradeCount;
  const isMaxLevel = GEN_MAX_LEVEL === currentLevel;
  const ascensionReady = isMaxLevel && isMaxUpgrade;

  const {
    totalCost: upgradeCost,
    buyCount,
    buyCountMax,
  } = (() => {
    const ascension = generator?.ascension ?? 0;
    const maxBuyCount = ascensionReady ? 1 : GEN_MAX_LEVEL - currentLevel;

    let totalCost = 0;
    let buyCount = 0;
    for (let i = 0; i < Math.min(buyCountSelection, maxBuyCount); i++) {
      const cost = getGeneratorUpgradeCost(
        definition.initialCost,
        definition.multiplier,
        currentLevel + buyCount,
        ascension,
      );

      totalCost += cost;
      buyCount++;
    }

    let totalCostMax = 0;
    let buyCountMax = 0;
    for (let i = 0; i < maxBuyCount; i++) {
      const cost = getGeneratorUpgradeCost(
        definition.initialCost,
        definition.multiplier,
        currentLevel + buyCountMax,
        ascension,
      );

      const wouldExceedCost = totalCostMax + cost > count;
      if (!wouldExceedCost) {
        totalCostMax += cost;
        buyCountMax++;
      }
    }

    return buyCountSelection === -1
      ? { totalCost: totalCostMax, buyCount: buyCountMax, buyCountMax }
      : { totalCost, buyCount, buyCountMax };
  })();

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

  const ascension = generator?.ascension ?? 0;

  return (
    <>
      <li
        className={cn(
          "list-row flex flex-col select-none gap-2",
          countTotal < definition.initialCost * 0.1
            ? "blur-[2px] opacity-25 backdrop-brightness-50"
            : null,
          ascensionReady && buyEnabled ? "bg-base-200" : "",
        )}
        onClick={buyEnabled ? handleClick : undefined}
      >
        <div
          className={cn(
            "flex-1 flex items-center gap-2",
            buyEnabled ? "cursor-pointer hover:bg-base-200" : "cursor-not-allowed opacity-50",
          )}
        >
          {ascension > 0 && (
            <div className="flex items-center">
              <span className="text-primary text-xl font-bold mr-1">{ascension}</span>
              <Star size={12} className="text-primary" />
            </div>
          )}
          <div className="flex-1">
            <Title name={name} upgradeCount={upgradeCount} ascension={ascension} />
            {ascensionReady ? (
              <p className="text-sm text-primary font-semibold opacity-75">
                Ascend! {formatNumber(upgradeCostOne)}
              </p>
            ) : (
              <p className="text-xs opacity-75">
                <Details
                  upgradeCost={upgradeCost}
                  baseVps={baseVps}
                  buyCount={buyCount}
                  buyCountMax={buyCountMax}
                  buyCountSelection={buyCountSelection}
                />
                <TimeUntilBuy count={count} upgradeCost={upgradeCost} currentVps={currentVps} />
              </p>
            )}
          </div>
          <Right
            currentVps={currentVps}
            level={generator?.level ?? null}
            ascension={generator?.ascension ?? 0}
            definition={definition}
          />
        </div>
        <PendingUpgrade
          myUpgrades={myUpgrades}
          genUpgrades={genUpgrades}
          level={currentLevel}
          upgradeCount={upgradeCount}
        />
      </li>
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
      {ascension < 1 && upgradeCount > 0 && (
        <span className="text-secondary">lvl {upgradeCount}</span>
      )}{" "}
      {name}
    </p>
  );
});

const Details = memo(function ({
  upgradeCost,
  baseVps,
  buyCount,
  buyCountMax,
  buyCountSelection,
}: {
  upgradeCost: number;
  baseVps: number;
  buyCount: number;
  buyCountMax: number;
  buyCountSelection: number;
}) {
  return (
    <>
      <span>
        <span className="text-primary">
          +{buyCount}
          {buyCountSelection !== -1 && <>/{buyCountMax}</>}
        </span>{" "}
        ={" "}
      </span>
      {formatNumber(upgradeCost, 1)} <span className="text-primary-content">|</span>{" "}
      <span className="text-secondary">
        {formatDuration(upgradeCost / (baseVps * buyCount))} PP
      </span>
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
  level: number | null;
  ascension: number;
}) {
  const { getGeneratorVps } = useStats();

  const vps = useMemo(
    () => getGeneratorVps(definition.name, level ?? 0, ascension),
    [getGeneratorVps, definition.name, level, ascension],
  );

  if (level === null) return null;

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
  myUpgrades,
  genUpgrades,
  level,
  upgradeCount,
}: {
  myUpgrades: string[];
  genUpgrades: { name: string }[];
  level: number;
  upgradeCount: number;
}) {
  const maxLevel = levelThresholds.reduce(
    (acc, threshold, idx) => (level >= threshold ? idx + 1 : acc),
    0,
  );

  const pendingUpgrade = (() => {
    //if (maxLevel <= upgradeCount) return null;
    for (const upgrade of genUpgrades) {
      if (!myUpgrades.includes(upgrade.name)) return upgrade;
    }
  })();

  const disabled = maxLevel <= upgradeCount;

  return pendingUpgrade ? (
    <UpgradeListItem name={pendingUpgrade?.name} forceShow icon compact disabled={disabled} />
  ) : null;
});
