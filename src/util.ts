import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { levelThresholds } from "./data/upgrades";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1e27) {
    return (num / 1e27).toFixed(3) + "Oc";
  } else if (num >= 1e24) {
    return (num / 1e24).toFixed(3) + "Sp";
  } else if (num >= 1e21) {
    return (num / 1e21).toFixed(3) + "Sx";
  } else if (num >= 1e18) {
    return (num / 1e18).toFixed(3) + "Qn";
  } else if (num >= 1e15) {
    return (num / 1e15).toFixed(3) + "Qd";
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(3) + "T";
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(3) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(3) + "M";
  } else if (num >= 1e3) {
    return Number(num.toFixed(0)).toLocaleString();
  }
  return num?.toFixed(1) ?? "0";
}

export function getGeneratorUpgradeCost(
  baseCost: number,
  costMultiplier: number,
  level: number
): number {
  const maxIndex = levelThresholds.reduce(
    (acc, threshold, idx) => (level >= threshold ? idx + 1 : acc),
    0
  );
  const levelMult = Math.max(1, Math.pow(2, maxIndex));
  return baseCost * costMultiplier * (1 + level / 100) * levelMult * Math.pow(1.03, level / 2);
  //return baseCost * Math.pow(costMultiplier, level) * levelMult;
}

export function getGeneratorUpgradeCostBulk(
  baseCost: number,
  costMultiplier: number,
  currentLevel: number,
  targetLevel: number
): number {
  let totalCost = 0;
  for (let i = currentLevel; i < targetLevel; i++) {
    totalCost += getGeneratorUpgradeCost(baseCost, costMultiplier, i);
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
