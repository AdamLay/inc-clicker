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
  ascension: number;
};

export const GEN_MAX_LEVEL = 1000;

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
    valuePerSecond: 7.5,
    multiplier: 1.09,
  },
  {
    name: "Manufacturer",
    level: 1,
    initialCost: 1e4,
    valuePerSecond: 66,
    multiplier: 1.11,
  },
  {
    name: "Atomiser",
    level: 1,
    initialCost: 1e5,
    valuePerSecond: 500,
    multiplier: 1.13,
  },
  {
    name: "Collider",
    level: 1,
    initialCost: 1e6,
    valuePerSecond: 5000,
    multiplier: 1.15,
  },
  {
    name: "Quantum Generator",
    level: 1,
    initialCost: 1e7,
    valuePerSecond: 5e4,
    multiplier: 1.17,
  },
  {
    name: "Dark Matter Reactor",
    level: 1,
    initialCost: 1e8,
    valuePerSecond: 4e5,
    multiplier: 1.19,
  },
  {
    name: "Singularity Engine",
    level: 1,
    initialCost: 1e9,
    valuePerSecond: 3e6,
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
  {
    name: "Intergalactic Propagator",
    level: 1,
    initialCost: 1e15,
    valuePerSecond: 1e10,
    multiplier: 1.25,
  },
  {
    name: "Multiversal Conduit",
    level: 1,
    initialCost: 1e17,
    valuePerSecond: 1e12,
    multiplier: 1.25,
  },
  {
    name: "Transdimensional Nexus",
    level: 1,
    initialCost: 1e19,
    valuePerSecond: 1e14,
    multiplier: 1.25,
  },
];
