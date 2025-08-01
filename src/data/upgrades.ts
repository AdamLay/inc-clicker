export const UpgradeType = {
  Generator: "Generator",
  Clicker: "Clicker",
  ClickerPrc: "ClickerPrc",
  Global: "Global",
  Interest: "Interest",
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

export const levelThresholds = [10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];

export const GEN_MAX_UPGRADE = 15;

const upgradeSet = (
  name: string,
  cost: number,
  multiplier: number | ((index: number) => number),
  type: UpgradeType,
  parameter?: string,
  costPow: number = 10,
  upgradeCount: number = GEN_MAX_UPGRADE
): Upgrade[] => {
  return Array.from({ length: upgradeCount }, (_, i) => {
    return upgrade(
      `${name} (${i + 1})`,
      cost * Math.pow(costPow, i),
      typeof multiplier === "function" ? multiplier(i) : multiplier,
      type,
      parameter,
      type === UpgradeType.Generator ? (param: number) => param >= levelThresholds[i] : undefined
    );
  });
};

const generatorMult = (i: number) => 2 * Math.pow(1.05, i);

export const upgrades: Upgrade[] = [
  upgrade("Interest Rate (1)", 1e40, 0.006, UpgradeType.Interest),
  upgrade("Interest Rate (2)", 1e45, 0.006, UpgradeType.Interest),
  upgrade("Interest Rate (3)", 1e50, 0.006, UpgradeType.Interest),
  upgrade("Interest Rate (4)", 1e55, 0.006, UpgradeType.Interest),
  upgrade("Interest Rate (5)", 1e60, 0.006, UpgradeType.Interest),
  upgrade("Interest Rate (6)", 1e65, 0.006, UpgradeType.Interest),
  ...upgradeSet("Click Power", 50, (i) => (i + 1) * 2, UpgradeType.Clicker, "", 10, 5),
  ...upgradeSet("Click Percent", 5e6, 1.15, UpgradeType.ClickerPrc, "", 15, 10),
  ...upgradeSet("Global 2%", 80, 1.02, UpgradeType.Global),
  ...upgradeSet("Starter", 60, generatorMult, UpgradeType.Generator, "Starter", 8),
  ...upgradeSet("Constructor", 300, generatorMult, UpgradeType.Generator, "Constructor", 9),
  ...upgradeSet("Assembler", 4e3, generatorMult, UpgradeType.Generator, "Assembler", 10),
  ...upgradeSet("Manufacturer", 5e4, generatorMult, UpgradeType.Generator, "Manufacturer", 11),
  ...upgradeSet("Atomiser", 5e5, generatorMult, UpgradeType.Generator, "Atomiser", 12),
  ...upgradeSet("Collider", 5e6, generatorMult, UpgradeType.Generator, "Collider", 13),
  ...upgradeSet("Quantum Generator", 5e7, generatorMult, UpgradeType.Generator, "Quantum Generator", 14),
  ...upgradeSet("Dark Matter Reactor", 5e8, generatorMult, UpgradeType.Generator, "Dark Matter Reactor", 15),
  ...upgradeSet("Singularity Engine", 5e9, generatorMult, UpgradeType.Generator, "Singularity Engine", 16),
  ...upgradeSet("Black Hole Device", 5e11, generatorMult, UpgradeType.Generator, "Black Hole Device", 17),
  ...upgradeSet("Cosmic Forge", 5e13, generatorMult, UpgradeType.Generator, "Cosmic Forge", 18),
  ...upgradeSet(
    "Intergalactic Propagator",
    5e15,
    generatorMult,
    UpgradeType.Generator,
    "Intergalactic Propagator",
    19
  ),
  ...upgradeSet("Multiversal Conduit", 1e18, generatorMult, UpgradeType.Generator, "Multiversal Conduit", 20),
  ...upgradeSet(
    "Transdimensional Nexus",
    1e20,
    generatorMult,
    UpgradeType.Generator,
    "Transdimensional Nexus",
    21
  ),
];

(window as any).upgrades = upgrades; // For debugging in console
