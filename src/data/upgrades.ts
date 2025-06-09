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
  ...upgradeSet("Click Power", 50, (i) => (i + 1) * 2, UpgradeType.Clicker),
  ...upgradeSet("Global 2%", 200, 1.02, UpgradeType.Global),
  ...upgradeSet("Starter", 20, 2, UpgradeType.Generator, "Starter", 8),
  ...upgradeSet("Constructor", 300, 2, UpgradeType.Generator, "Constructor", 9),
  ...upgradeSet("Assembler", 4e3, 2, UpgradeType.Generator, "Assembler", 10),
  ...upgradeSet("Manufacturer", 5e4, 2, UpgradeType.Generator, "Manufacturer", 11),
];
