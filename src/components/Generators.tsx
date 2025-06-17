import { useShallow } from "zustand/shallow";
import { GEN_MAX_LEVEL, generators } from "../data/generators";
import { useStore } from "../store/store";
import BuyCountSelector from "./BuyCountSelector";
import GeneratorListItem from "./GeneratorListItem";
import { orderBy } from "lodash";

export default function Generators() {
  const [myGenerators] = useStore(useShallow((state) => [state.generators]));
  const indexMap = generators.reduce(
    (acc, gen, i) => ({
      ...acc,
      [gen.name]: i,
    }),
    {} as any
  );
  const myMaxGenerators = myGenerators.filter((gen) => gen.level >= GEN_MAX_LEVEL);
  const myCurrentGenerators = myGenerators.filter((gen) => gen.level < GEN_MAX_LEVEL);
  const availableGenerators = generators.filter(
    (x) => !myGenerators.some((my) => my.name === x.name)
  );

  return (
    <div>
      <BuyCountSelector />
      <ul className="list bg-base-100 rounded-box shadow-md mt-2">
        {orderBy(myCurrentGenerators, (x) => indexMap[x.name]).map((generator) => (
          <GeneratorListItem
            key={generator.name}
            name={generator.name}
            definition={generators.find((x) => x.name === generator.name)!}
          />
        ))}
        {availableGenerators.map((generator) => (
          <GeneratorListItem key={generator.name} name={generator.name} definition={generator} />
        ))}
        {myMaxGenerators.map((generator) => (
          <GeneratorListItem
            key={generator.name}
            name={generator.name}
            definition={generators.find((x) => x.name === generator.name)!}
          />
        ))}
      </ul>
    </div>
  );
}
