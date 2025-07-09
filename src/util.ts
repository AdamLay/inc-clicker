import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { levelThresholds } from "./data/upgrades";
import { GEN_MAX_LEVEL, type Generator } from "./data/generators";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, places: number = 3): string {
  const tiers = [
    { value: 1e63, suffix: "Vg" }, // Vigintillion
    { value: 1e60, suffix: "NvD" }, // Novemdecillion
    { value: 1e57, suffix: "OcD" }, // Octodecillion
    { value: 1e54, suffix: "SpD" }, // Septendecillion
    { value: 1e51, suffix: "SxD" }, // Sexdecillion
    { value: 1e48, suffix: "QiD" }, // Quindecillion
    { value: 1e45, suffix: "QuD" }, // Quattuordecillion
    { value: 1e42, suffix: "TrD" }, // Tredecillion
    { value: 1e39, suffix: "DdD" }, // Duodecillion
    { value: 1e36, suffix: "UdD" }, // Undecillion
    { value: 1e33, suffix: "Dc" }, // Decillion
    { value: 1e30, suffix: "No" }, // Nonillion
    { value: 1e27, suffix: "Oc" }, // Octillion
    { value: 1e24, suffix: "Sp" }, // Septillion
    { value: 1e21, suffix: "Sx" }, // Sextillion
    { value: 1e18, suffix: "Qi" }, // Quintillion
    { value: 1e15, suffix: "Qa" }, // Quadrillion
    { value: 1e12, suffix: "T" }, // Trillion
    { value: 1e9, suffix: "B" }, // Billion
    { value: 1e6, suffix: "M" }, // Million
  ];
  for (const tier of tiers) {
    if (num >= tier.value) {
      return (num / tier.value).toFixed(places) + tier.suffix;
    }
  }
  if (num >= 1e3) {
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
  const ascensionMult = level === GEN_MAX_LEVEL ? Math.max(1, ascension * 1e5) : 1;
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
  //return defintion.valuePerSecond * level * Math.max(1, Math.pow(10, ascension) * 1e5);
  return defintion.valuePerSecond * level * Math.max(1, ascension * Math.pow(1e5, Math.max(1, ascension)));
}
