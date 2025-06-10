export const UpgradeType = {
  Generator: "Generator",
  Clicker: "Clicker",
  Global: "Global",
} as const;
export type UpgradeType = (typeof UpgradeType)[keyof typeof UpgradeType];

export type Upgrade = {
  name: string;
  cost: number;
  multiplier: number;
  type: UpgradeType;
  parameter?: string;
  condition?: (param: any) => boolean;
};

const upgrade = (
  name: string,
  cost: number,
  multiplier: number,
  type: UpgradeType,
  parameter?: string,
  condition?: any
): Upgrade => ({
  name,
  cost,
  multiplier,
  type,
  parameter,
  condition,
});

const levelRestrictions = [1, 10, 25, 50, 100, 150, 200, 250, 300, 350];

const upgradeSet = (
  name: string,
  cost: number,
  multiplier: number | ((index: number) => number),
  type: UpgradeType,
  parameter?: string,
  costPow: number = 10
): Upgrade[] => {
  return Array.from({ length: 10 }, (_, i) =>
    upgrade(
      `${name} (${i + 1})`,
      cost * Math.pow(costPow, i),
      typeof multiplier === "function" ? multiplier(i) : multiplier,
      type,
      parameter,
      type === UpgradeType.Generator ? (param: number) => param >= levelRestrictions[i] : undefined
    )
  );
};

export const upgrades: Upgrade[] = [
  ...upgradeSet("Click Power", 50, (i) => (i + 1) * 1.5, UpgradeType.Clicker),
  ...upgradeSet("Global 2%", 200, 1.02, UpgradeType.Global),
  ...upgradeSet("Starter", 20, (i) => [2, 3, 2, 4][i] ?? 2, UpgradeType.Generator, "Starter", 8),
  ...upgradeSet(
    "Constructor",
    300,
    (i) => [1.5, 2, 4, 3][i] ?? 2,
    UpgradeType.Generator,
    "Constructor",
    9
  ),
  ...upgradeSet("Assembler", 4e3, 2, UpgradeType.Generator, "Assembler", 10),
  ...upgradeSet("Manufacturer", 5e4, 2, UpgradeType.Generator, "Manufacturer", 11),
  ...upgradeSet("Atomiser", 5e5, 2, UpgradeType.Generator, "Atomiser", 12),
  ...upgradeSet("Collider", 5e6, 2, UpgradeType.Generator, "Collider", 13),
  ...upgradeSet("Quantum Generator", 5e7, 2, UpgradeType.Generator, "Quantum Generator", 14),
  ...upgradeSet("Dark Matter Reactor", 5e8, 2, UpgradeType.Generator, "Dark Matter Reactor", 15),
  ...upgradeSet("Singularity Engine", 5e9, 2, UpgradeType.Generator, "Singularity Engine", 16),
  ...upgradeSet("Black Hole Device", 5e10, 2, UpgradeType.Generator, "Black Hole Device", 17),
  ...upgradeSet("Cosmic Forge", 5e11, 2, UpgradeType.Generator, "Cosmic Forge", 18),
];

(window as any).upgrades = upgrades; // For debugging in console
