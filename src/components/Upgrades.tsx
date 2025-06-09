import { useShallow } from "zustand/react/shallow";
import { upgrades } from "../data/upgrades";
import { useStore } from "../store/store";
import UpgradeListItem from "./UpgradeListItem";
import { orderBy } from "lodash";

export default function Upgrades() {
  const myUpgrades = useStore(useShallow((state) => state.upgrades));

  const purchased = upgrades.filter((upgrade) => myUpgrades.includes(upgrade.name));
  const available = upgrades.filter((upgrade) => !myUpgrades.includes(upgrade.name));

  return (
    <div>
      <h1 className="text-sm font-bold text-center">Upgrades</h1>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {orderBy(available, "cost").map((upgrade) => (
          <UpgradeListItem key={upgrade.name} name={upgrade.name} />
        ))}
      </ul>
      {purchased.length > 0 && (
        <>
          <h1 className="text-sm font-bold text-center mt-4">Purchased</h1>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {purchased.map((upgrade) => (
              <UpgradeListItem key={upgrade.name} name={upgrade.name} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
