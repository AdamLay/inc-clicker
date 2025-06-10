export type Generator = {
  name: string;
  level: number;
  initialCost: number;
  valuePerSecond: number;
  multiplier: number;
};

export type GeneratorState = {
  name: string;
  level: number;
};

export const generators: Generator[] = [
  {
    name: "Starter",
    level: 1,
    initialCost: 10,
    valuePerSecond: 0.1,
    multiplier: 1.05,
  },
  {
    name: "Constructor",
    level: 1,
    initialCost: 1e2,
    valuePerSecond: 1,
    multiplier: 1.07,
  },
  {
    name: "Assembler",
    level: 1,
    initialCost: 1e3,
    valuePerSecond: 10,
    multiplier: 1.09,
  },
  {
    name: "Manufacturer",
    level: 1,
    initialCost: 1e4,
    valuePerSecond: 1e2,
    multiplier: 1.11,
  },
  {
    name: "Atomiser",
    level: 1,
    initialCost: 1e5,
    valuePerSecond: 1e3,
    multiplier: 1.13,
  },
  {
    name: "Collider",
    level: 1,
    initialCost: 1e6,
    valuePerSecond: 1e4,
    multiplier: 1.15,
  },
  {
    name: "Quantum Generator",
    level: 1,
    initialCost: 1e7,
    valuePerSecond: 1e5,
    multiplier: 1.17,
  },
  {
    name: "Dark Matter Reactor",
    level: 1,
    initialCost: 1e8,
    valuePerSecond: 1e6,
    multiplier: 1.19,
  },
  {
    name: "Singularity Engine",
    level: 1,
    initialCost: 1e9,
    valuePerSecond: 1e7,
    multiplier: 1.21,
  },
  {
    name: "Black Hole Device",
    level: 1,
    initialCost: 1e11,
    valuePerSecond: 1e8,
    multiplier: 1.23,
  },
  {
    name: "Cosmic Forge",
    level: 1,
    initialCost: 1e13,
    valuePerSecond: 1e9,
    multiplier: 1.25,
  },
];
