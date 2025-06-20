import { useShallow } from "zustand/react/shallow";
import type { Upgrade } from "../data/upgrades";
import { useStore } from "../store/store";
import { sortBy } from "lodash";

export default function BuyAllUpgradesButton({ available }: { available: Upgrade[] }) {
  const [count, myUpgrades, addUpgrade] = useStore(
    useShallow((state) => [state.count, state.upgrades, state.addUpgrade])
  );

  const handleClick = () => {
    let amountRemaining = count;
    const sortedAvailable = sortBy(
      available.filter((x) => !myUpgrades.includes(x.name)),
      "cost"
    );
    for (const upgrade of sortedAvailable) {
      if (amountRemaining >= upgrade.cost) {
        addUpgrade(upgrade.name, upgrade.cost);
        amountRemaining -= upgrade.cost;
        console.log(`Bought upgrade: ${upgrade.name}, remaining count: ${amountRemaining}`);
      } else {
        break;
      }
    }
  };

  return (
    <div className="p-4">
      <button className="btn btn-secondary w-full" onClick={handleClick}>
        Buy All!
      </button>
    </div>
  );
}
