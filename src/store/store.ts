import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generators, type GeneratorState } from "../data/generators";
import { upgrades, UpgradeType } from "../data/upgrades";

export type ClickEvent = { value: number; when: number };
export type BonusEvent = { multiplier: number; duration: number; when: number };

interface State {
  count: number;
  countTotal: number;
  lifetimeTotal: number;
  prestigePoints: number;
  increase: (by: number) => void;
  generators: GeneratorState[];
  addGenerator: (name: string, cost: number, count: number) => void;
  upgrades: string[];
  addUpgrade: (name: string, cost: number) => void;
  buyCount: number;
  setBuyCount: (amt: number) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  resetConfirmOpen: boolean;
  setResetConfirmOpen: (open: boolean) => void;
  resetGame: () => void;
  backgroundMode: Date | null;
  setBackgroundMode: (bgm: Date | null) => void;
  clicks: number;
  clickEvents: ClickEvent[];
  addClickEvent: (evt: ClickEvent) => void;
  bonusEvent: BonusEvent | null;
  setBonusEvent: (evt: BonusEvent | null) => void;
  prestigeConfirmOpen: boolean;
  setPrestigeConfirmOpen: (open: boolean) => void;
  setPrestige: (vipp: number) => void;

  setCount_Debug: (amt: number) => void;
  setPrestige_Debug: (amt: number) => void;
}

const STARTING_COUNT = 0;

export const selectValuePerSecond = (state: {
  upgrades: string[];
  generators: GeneratorState[];
  backgroundMode: Date | null;
  bonusEvent?: BonusEvent | null;
  prestigePoints: number;
}) => {
  const generatorUpgrades = upgrades.filter(
    (x) => state.upgrades.includes(x.name) && x.type === UpgradeType.Generator
  );
  const globalUpgrades = upgrades.filter(
    (x) => state.upgrades.includes(x.name) && x.type === UpgradeType.Global
  );

  const prestigeMult = 1 + state.prestigePoints * 0.02;

  let valuePerSecond = 0;
  for (const gen of state.generators) {
    const definition = generators.find((g) => g.name === gen.name)!;
    const genBaseVps = definition.valuePerSecond * gen.level;
    const genUpgrades = generatorUpgrades.filter((x) => x.parameter === gen.name);
    const genVps = genUpgrades.reduce((acc, next) => acc * next.multiplier, genBaseVps);
    valuePerSecond += genVps;
  }

  const totalVps =
    globalUpgrades.reduce((acc, next) => acc * next.multiplier, valuePerSecond) *
    prestigeMult *
    (state.bonusEvent?.multiplier ?? 1);

  if (!state.backgroundMode) return totalVps;

  const timeout = 15 * 60 * 1000;
  const isValid = new Date().getTime() - state.backgroundMode.getTime() < timeout;
  return totalVps * (isValid ? 0.1 : 0);
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      count: STARTING_COUNT,
      countTotal: STARTING_COUNT,
      lifetimeTotal: STARTING_COUNT,
      prestigePoints: 0,
      increase: (by) =>
        set((state) => ({
          count: state.count + by,
          countTotal: state.countTotal + by,
          lifetimeTotal: state.lifetimeTotal + by,
        })),
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
      backgroundMode: null,
      setBackgroundMode: (bgm: Date | null) => set(() => ({ backgroundMode: bgm })),
      helpOpen: false,
      setHelpOpen: (open: boolean) => set(() => ({ helpOpen: open })),
      resetConfirmOpen: false,
      setResetConfirmOpen: (open: boolean) => set(() => ({ resetConfirmOpen: open })),
      resetGame: () =>
        set(() => ({
          count: STARTING_COUNT,
          countTotal: STARTING_COUNT,
          generators: [],
          upgrades: [],
          buyCount: 1,
          lifetimeTotal: 0,
          prestigePoints: 0,
          resetConfirmOpen: false,
        })),
      clicks: 0,
      clickEvents: [],
      addClickEvent: (evt: { value: number; when: number }) =>
        set((state) => ({
          clicks: state.clicks + 1,
          clickEvents: [
            // Keep clicks from >= 1.5 seconds ago
            ...state.clickEvents.filter((x) => x.when > new Date().getTime() - 1_500),
            evt,
          ],
        })),
      bonusEvent: null,
      setBonusEvent: (evt: BonusEvent | null) => set(() => ({ bonusEvent: evt })),
      prestigeConfirmOpen: false,
      setPrestigeConfirmOpen: (open: boolean) => set(() => ({ prestigeConfirmOpen: open })),
      setPrestige: (vipp: number) =>
        set((state) => ({
          count: 0,
          countTotal: 0,
          prestigePoints: state.prestigePoints + vipp,
          generators: [],
          upgrades: [],
          buyCount: 1,
        })),
      setCount_Debug: (amt: number) =>
        set(() => ({ count: amt, countTotal: amt, lifetimeTotal: amt })),
      setPrestige_Debug: (amt: number) => set(() => ({ prestigePoints: amt })),
    }),
    {
      name: "inc-clicker-storage", // unique name for localStorage key
      partialize: (state) => ({
        count: state.count,
        countTotal: state.countTotal,
        generators: state.generators,
        upgrades: state.upgrades,
        buyCount: state.buyCount,
        clicks: state.clicks,
        lifetimeTotal: state.lifetimeTotal,
        prestigePoints: state.prestigePoints,
      }),
    }
  )
);
