import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { levelThresholds } from "./data/upgrades";
import { GEN_MAX_LEVEL, type Generator } from "./data/generators";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, places: number = 3): string {
  if (num >= 1e33) {
    return (num / 1e33).toFixed(places) + "De";
  } else if (num >= 1e30) {
    return (num / 1e30).toFixed(places) + "No";
  } else if (num >= 1e27) {
    return (num / 1e27).toFixed(places) + "Oc";
  } else if (num >= 1e24) {
    return (num / 1e24).toFixed(places) + "Sp";
  } else if (num >= 1e21) {
    return (num / 1e21).toFixed(places) + "Sx";
  } else if (num >= 1e18) {
    return (num / 1e18).toFixed(places) + "Qn";
  } else if (num >= 1e15) {
    return (num / 1e15).toFixed(places) + "Qd";
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(places) + "T";
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(places) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(places) + "M";
  } else if (num >= 1e3) {
    return Number(num.toFixed(0)).toLocaleString();
  }
  return num?.toFixed(1) ?? "0";
}

export function getGeneratorUpgradeCost(
  baseCost: number,
  costMultiplier: number,
  level: number,
  ascension: number
): number {
  const actualLevel = level + ascension * GEN_MAX_LEVEL;
  const maxIndex = levelThresholds.reduce(
    (acc, threshold, idx) => (actualLevel >= threshold ? idx + 1 : acc),
    0
  );
  const levelMult = Math.max(1, Math.pow(2, maxIndex));
  const ascensionMult = Math.max(1, (ascension + level === GEN_MAX_LEVEL ? 1 : 0) * 1e5);
  return (
    baseCost *
    costMultiplier *
    (1 + actualLevel / 100) *
    levelMult *
    ascensionMult *
    Math.pow(1.03, actualLevel / 2)
  );
  //return baseCost * Math.pow(costMultiplier, level) * levelMult;
}

export function getGeneratorUpgradeCostBulk(
  baseCost: number,
  costMultiplier: number,
  currentLevel: number,
  targetLevel: number,
  ascension: number
): number {
  let totalCost = 0;
  for (let i = currentLevel; i < targetLevel; i++) {
    totalCost += getGeneratorUpgradeCost(baseCost, costMultiplier, i, ascension);
  }
  return totalCost;
}

export function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${remainingMinutes}m`;
  }
  return "ages";
}

export function getNextPrestigePoints(countTotal: number, lifetimeTotal: number): number {
  const previousSession = Math.max(0, lifetimeTotal - countTotal);
  const x = (input: number) => Math.pow(input, 0.2);
  const a = x(lifetimeTotal);
  const b = x(previousSession);
  return Math.abs(a - b);
}

export function getPrestigeMultiplier(prestigePoints: number) {
  return 1 + prestigePoints * 0.01;
}

export function getGeneratorBaseVps(defintion: Generator, level: number, ascension: number): number {
  return defintion.valuePerSecond * level * Math.max(1, ascension * 1e5);
}