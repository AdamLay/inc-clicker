import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { formatDuration } from "../util";

export default function RandomEventButton() {
  const [setBonusEvent, bonusEvent] = useStore(
    useShallow((state) => [state.setBonusEvent, state.bonusEvent]),
  );
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!visible && Math.random() < 0.005) {
        setVisible(true);
      }
      if (bonusEvent) {
        const timeLeft = bonusEvent.when + bonusEvent.duration - new Date().getTime();
        setTimeLeft(formatDuration(timeLeft / 1000));
      }
    }, 250);
    return () => clearInterval(interval);
  }, [bonusEvent, visible]);

  const handleClick = () => {
    const duration = (10 + Math.random() * 5) * 1000; // 10-15 seconds

    setBonusEvent({
      multiplier: 3 + Math.random() * 4,
      when: new Date().getTime(),
      duration,
    });

    setVisible(false);

    setTimeout(() => {
      setBonusEvent(null);
    }, duration);
  };

  return (
    <>
      {visible && !bonusEvent && (
        <button className="btn py-8 btn-primary" onClick={handleClick}>
          Bonus event!
        </button>
      )}
      {bonusEvent && (
        <div className="flex flex-col gap-1 px-2">
          <p className="text-2xl font-extrabold text-primary text-center">
            x{bonusEvent.multiplier.toFixed(1)}
          </p>
          <p className="text-lg text-center">{timeLeft}</p>
        </div>
      )}
    </>
  );
}
