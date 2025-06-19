import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { formatDuration } from "../util";

export default function RandomEventButton() {
  const [setBonusEvent, bonusEvent] = useStore(
    useShallow((state) => [state.setBonusEvent, state.bonusEvent])
  );
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!visible && Math.random() < 0.003) {
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
      multiplier: 2 + Math.random() * 5,
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
        <button className="btn py-6 mt-2 btn-primary" onClick={handleClick}>
          Bonus generation event!
        </button>
      )}
      {bonusEvent && (
        <p className="text-lg text-center my-2">
          Event multiplier! x{bonusEvent.multiplier.toFixed(1)} {timeLeft}
        </p>
      )}
    </>
  );
}
