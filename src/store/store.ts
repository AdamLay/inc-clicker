import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generators, type GeneratorState } from "../data/generators";
import { upgrades, UpgradeType } from "../data/upgrades";
import { getGeneratorBaseVps, getPrestigeMultiplier } from "../util";

export type ClickEvent = { value: number; when: number };
export type BonusEvent = { multiplier: number; duration: number; when: number };

interface State {
  count: number;
  countTotal: number;
  lifetimeTotal: number;
  prestigePoints: number;
  currentVps: number;
  increase: (by: number) => void;
  generators: GeneratorState[];
  addGenerator: (name: string, cost: number, count: number) => void;
  ascendGenerator: (name: string, cost: number) => void;
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

  // Save/load game functionality
  saveGameToFile: () => void;
  loadGameFromFile: (saveData: string) => void;

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

  const prestigeMult = getPrestigeMultiplier(state.prestigePoints);

  let valuePerSecond = 0;
  for (const gen of state.generators) {
    const definition = generators.find((g) => g.name === gen.name)!;
    const genBaseVps = getGeneratorBaseVps(definition, gen.level, gen.ascension ?? 0);
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
    (set, get) => {

      const withUpdateVps = (fn: () => void) => {

        fn();
        set((state) => {
          const vps = selectValuePerSecond(state);
          return { currentVps: vps };
        });
      };

      return {
        count: STARTING_COUNT,
        countTotal: STARTING_COUNT,
        lifetimeTotal: STARTING_COUNT,
        prestigePoints: 0,
        currentVps: 0,
        increase: (by) =>
          set((state) => ({
            count: state.count + by,
            countTotal: state.countTotal + by,
            lifetimeTotal: state.lifetimeTotal + by,
          })),
        generators: [],
        addGenerator: (generatorName: string, cost: number, count: number = 1) =>
          withUpdateVps(() => set((state) => {
            const exists = state.generators.some((g) => g.name === generatorName);
            return {
              count: state.count - cost,
              generators: exists
                ? state.generators.map((g) =>
                  g.name === generatorName
                    ? { ...g, level: g.level + count, ascension: g.ascension ?? 0 }
                    : g
                )
                : [...state.generators, { name: generatorName, level: count, ascension: 0 }],
            };
          })),
        ascendGenerator: (name: string, cost: number) =>
          withUpdateVps(() => set((state) => ({
            count: state.count - cost,
            generators: state.generators.map((g) =>
              g.name === name ? { ...g, level: 1, ascension: (g.ascension ?? 0) + 1 } : g
            ),
          }))),
        upgrades: [],
        addUpgrade: (name: string, cost: number) =>
          withUpdateVps(() => set((state) => ({
            count: state.count - cost,
            upgrades: [...state.upgrades, name],
          }))),
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
          withUpdateVps(() => set((state) => ({
            count: 0,
            countTotal: 0,
            prestigePoints: state.prestigePoints + vipp,
            generators: [],
            upgrades: [],
            buyCount: 1,
          }))),

        // Save/load game functionality
        saveGameToFile: () => {
          const state = get();
          const saveData = {
            count: state.count,
            countTotal: state.countTotal,
            lifetimeTotal: state.lifetimeTotal,
            prestigePoints: state.prestigePoints,
            generators: state.generators,
            upgrades: state.upgrades,
            buyCount: state.buyCount,
            clicks: state.clicks,
            version: 1, // Version for future compatibility
            timestamp: new Date().toISOString(),
          };

          const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `inc-clicker-save-${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();

          // Clean up
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },

        loadGameFromFile: (saveData: string) => {
          try {
            const parsedData = JSON.parse(saveData);

            // Validate required fields
            if (
              parsedData.count === undefined ||
              parsedData.countTotal === undefined ||
              parsedData.generators === undefined ||
              parsedData.upgrades === undefined
            ) {
              throw new Error("Invalid save file format");
            }

            set({
              count: parsedData.count,
              countTotal: parsedData.countTotal,
              lifetimeTotal: parsedData.lifetimeTotal || parsedData.countTotal,
              prestigePoints: parsedData.prestigePoints || 0,
              generators: parsedData.generators,
              upgrades: parsedData.upgrades,
              buyCount: parsedData.buyCount || 1,
              clicks: parsedData.clicks || 0,
              clickEvents: [],
            });
          } catch (error) {
            console.error("Failed to load game data:", error);
            alert("Failed to load game data. The save file might be corrupted.");
          }
        },

        setCount_Debug: (amt: number) =>
          set(() => ({ count: amt, countTotal: amt, lifetimeTotal: amt })),
        setPrestige_Debug: (amt: number) => set(() => ({ prestigePoints: amt })),
      }
    },
    {
      name: "inc-clicker-storage", // unique name for localStorage key
      partialize: (state) => ({
        count: state.count,
        countTotal: state.countTotal,
        currentVps: state.currentVps,
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
