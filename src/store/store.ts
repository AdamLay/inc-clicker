import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generators, type GeneratorState } from "../data/generators";
import { upgrades, UpgradeType } from "../data/upgrades";

interface State {
  count: number;
  countTotal: number;
  increase: (by: number) => void;
  generators: GeneratorState[];
  addGenerator: (name: string, cost: number, count: number) => void;
  upgrades: string[];
  addUpgrade: (name: string, cost: number) => void;
  buyCount: number;
  setBuyCount: (amt: number) => void;

  setCount_Debug: (amt: number) => void;
}

const STARTING_COUNT = 0;

export const selectValuePerSecond = (state: {
  upgrades: string[];
  generators: GeneratorState[];
}) => {
  const generatorUpgrades = upgrades.filter(
    (x) => state.upgrades.includes(x.name) && x.type === UpgradeType.Generator
  );
  const globalUpgrades = upgrades.filter(
    (x) => state.upgrades.includes(x.name) && x.type === UpgradeType.Global
  );

  let valuePerSecond = 0;
  for (const gen of state.generators) {
    const definition = generators.find((g) => g.name === gen.name)!;
    const genBaseVps = definition.valuePerSecond * gen.level;
    const genUpgrades = generatorUpgrades.filter((x) => x.parameter === gen.name);
    const genVps = genUpgrades.reduce((acc, next) => acc * next.multiplier, genBaseVps);
    valuePerSecond += genVps;
  }

  return globalUpgrades.reduce((acc, next) => acc * next.multiplier, valuePerSecond);
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      count: STARTING_COUNT,
      countTotal: STARTING_COUNT,
      increase: (by) =>
        set((state) => ({ count: state.count + by, countTotal: state.countTotal + by })),
      generators: [],
      addGenerator: (generatorName: string, cost: number, count: number = 1) =>
        set((state) => {
          const exists = state.generators.some((g) => g.name === generatorName);
          return {
            count: state.count - cost,
            generators: exists
              ? state.generators.map((g) =>
                  g.name === generatorName ? { ...g, level: g.level + count } : g
                )
              : [...state.generators, { name: generatorName, level: count }],
          };
        }),
      upgrades: [],
      addUpgrade: (name: string, cost: number) =>
        set((state) => ({
          count: state.count - cost,
          upgrades: [...state.upgrades, name],
        })),
      buyCount: 1,
      setBuyCount: (amt: number) => set(() => ({ buyCount: amt })),
      setCount_Debug: (amt: number) => set(() => ({ count: amt })),
    }),
    {
      name: 'inc-clicker-storage', // unique name for localStorage key
      partialize: (state) => ({
        count: state.count,
        countTotal: state.countTotal,
        generators: state.generators,
        upgrades: state.upgrades,
        buyCount: state.buyCount
      }),
    }
  )
);
