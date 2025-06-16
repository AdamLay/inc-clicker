import { generators } from "../data/generators";
import BuyCountSelector from "./BuyCountSelector";
import GeneratorListItem from "./GeneratorListItem";

export default function Generators() {
  return (
    <div>
      <BuyCountSelector />
      <ul className="list bg-base-100 rounded-box shadow-md mt-2">
        {generators.map((generator) => (
          <GeneratorListItem key={generator.name} name={generator.name} definition={generator} />
        ))}
      </ul>
    </div>
  );
}
