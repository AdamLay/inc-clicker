import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { generators } from "../../data/generators";
import { formatNumber, getGeneratorUpgradeCost } from "../../util";
import { upgrades } from "../../data/upgrades";

export default function StatsGraphs() {
  return (
    <div>
      {generators.map((gen) => {
        const genUpgrades = upgrades.filter(
          (x) => x.type === "Generator" && x.parameter === gen.name
        );
        const data = Array.from({ length: 175 }).map((_, i) => {
          const level = i + 1;
          const appliedUpgrades = genUpgrades.filter((upg) => upg.condition?.(level) ?? true);
          const upgradeMultiplier = appliedUpgrades.reduce((acc, upg) => acc * upg.multiplier, 1);
          const cost = getGeneratorUpgradeCost(gen.initialCost, gen.multiplier, level);
          const baseVps = gen.valuePerSecond * upgradeMultiplier;
          const vps = gen.valuePerSecond * level * upgradeMultiplier;
          const pp = cost / baseVps;
          return {
            name: gen.name,
            level,
            cost,
            vps,
            pp,
            baseVps,
          };
        });
        return (
          <div className="bg-slate-950 p-2 rounded-md">
            <p>{gen.name}</p>
            <LineChart width={1280} height={720} data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="level" />
              <YAxis scale="log" domain={["auto", "auto"]} />

              <Line type="monotone" dataKey="vps" stroke="#82ca9d" />
              <Line type="monotone" dataKey="cost" stroke="#8884d8" />
              <Line type="monotone" dataKey="pp" stroke="#ffc658" />
              <Line type="monotone" dataKey="baseVps" stroke="#ff0000" />
              <Tooltip formatter={(value, name) => [formatNumber(value as any), name]} />
            </LineChart>
          </div>
        );
      })}
    </div>
  );
}
