import { useShallow } from "zustand/react/shallow";
import { upgrades } from "../data/upgrades";
import { useStore } from "../store/store";
import UpgradeListItem from "./UpgradeListItem";
import { orderBy } from "lodash";
import BuyAllUpgradesButton from "./BuyAllUpgradesButton";

export default function Upgrades() {
  const [myUpgrades, myGenerators] = useStore(
    useShallow((state) => [state.upgrades, state.generators])
  );

  //const purchased = upgrades.filter((upgrade) => myUpgrades.includes(upgrade.name));
  const available = upgrades.filter((upgrade) => {
    if (myUpgrades.includes(upgrade.name)) return false;
    if (upgrade.condition) {
      const generator = myGenerators.find((g) => g.name === upgrade.parameter);
      return generator && upgrade.condition(generator?.level);
    }
    return true;
  });

  return (
    <div>
      <BuyAllUpgradesButton available={available} />
      <ul className="list bg-base-100 rounded-box shadow-md">
        {orderBy(available, "cost").map((upgrade) => (
          <UpgradeListItem key={upgrade.name} name={upgrade.name} />
        ))}
      </ul>
      {/* {purchased.length > 0 && (
        <>
          <h1 className="text-sm font-bold text-center mt-4">Purchased</h1>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {purchased.map((upgrade) => (
              <UpgradeListItem key={upgrade.name} name={upgrade.name} />
            ))}
          </ul>
        </>
      )} */}
    </div>
  );
}
