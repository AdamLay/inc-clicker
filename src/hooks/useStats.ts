import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { useCallback } from "react";
import { upgrades, UpgradeType } from "../data/upgrades";
import { generators } from "../data/generators";
import { getPrestigeMultiplier } from "../util";

export default function useStats() {
  const [myUpgrades, prestigePoints] = useStore(
    useShallow((state) => [state.upgrades, state.prestigePoints])
  );

  const getGeneratorVps = useCallback(
    (generatorName: string, level: number, withUpgrades?: string[]) => {
      const genDefinition = generators.find((g) => g.name === generatorName)!;
      const appliedUpgrades = upgrades
        .filter((x) => (withUpgrades || myUpgrades).includes(x.name))
        .filter(
          (x) =>
            x.type === UpgradeType.Global ||
            (x.type === UpgradeType.Generator && x.parameter === generatorName)
        );

      const genBaseVps = genDefinition.valuePerSecond * level;
      const prestigeMult = getPrestigeMultiplier(prestigePoints);

      return (
        appliedUpgrades.reduce((acc, next) => acc * next.multiplier, genBaseVps) * prestigeMult
      );
    },
    [myUpgrades]
  );

  return { getGeneratorVps };
}
