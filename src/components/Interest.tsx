import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { formatNumber } from "../util";
import { useState } from "react";
import { upgrades, UpgradeType } from "../data/upgrades";

interface InterestProps {}

export default function Interest({}: InterestProps) {
  const [increment, myUpgrades, backgroundMode] = useStore(
    useShallow((state) => [state.increase, state.upgrades, state.backgroundMode])
  );
  const currentCount = useStore(useShallow((state) => state.count));
  const [timerStarted, setTimerStarted] = useState(0);
  const [interestAmt, setInterestAmount] = useState(0);

  const interestUpgrades = upgrades.filter((u) => u.type === UpgradeType.Interest);
  const purchasedInterestUpgrades = interestUpgrades.filter((u) => myUpgrades.includes(u.name));

  const interestPrc = purchasedInterestUpgrades.reduce((acc, upgrade) => acc + upgrade.multiplier, 0);
  if (!interestPrc) return null;

  // No need for useEffect, since we can just update on each render triggered by the store count change

  // Every 10 seconds, increment the count by 5%
  if (!timerStarted || new Date().getTime() - timerStarted > 10_000) {
    //Snapshot current count amount into state
    setInterestAmount(currentCount * interestPrc);
    if (timerStarted && !backgroundMode) {
      increment(interestAmt);
    }
    setTimerStarted(new Date().getTime()); // Reset the timer
  }

  const progress = Math.min((new Date().getTime() - timerStarted) / 10_000, 1);
  const size = 16;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressBar = (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="stroke-primary"
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );

  return (
    <div className="flex gap-2 items-center justify-center col-span-2">
      <p className="text-xl align-middle">
        <span className="text-sm opacity-75">{(interestPrc * 100).toFixed(1)}% Interest</span>{" "}
        {formatNumber(interestAmt, 1)}/10s
      </p>
      {progressBar}
    </div>
  );
}
