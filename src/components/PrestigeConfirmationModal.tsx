import { ArrowUp01Icon } from "lucide-react";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { formatNumber, getNextPrestigePoints, getPrestigeMultiplier } from "../util";

export default function PrestigeConfirmationModal() {
  const [open, setOpen, setPrestige, countTotal, lifetimeTotal, prestigePoints] = useStore(
    useShallow((state) => [
      state.prestigeConfirmOpen,
      state.setPrestigeConfirmOpen,
      state.setPrestige,
      state.countTotal,
      state.lifetimeTotal,
      state.prestigePoints,
    ])
  );

  const nextVipp = getNextPrestigePoints(countTotal, lifetimeTotal);

  return (
    <dialog open={open} onClose={() => setOpen(false)} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-primary">Prestige!</h3>
        <p className="py-4 text-lg">
          You will earn: <span className="font-bold">{formatNumber(nextVipp)} VIPP</span>
        </p>
        <p className="py-4">
          Each VIPP adds 1% to your vps. If you prestige now, your new multiplier will be:{" "}
          {getPrestigeMultiplier(prestigePoints + nextVipp).toFixed(1)}x
        </p>
        <p className="py-4">
          Are you sure you want to reset the game? This will reset your count, generators and
          upgrades, and grant you {formatNumber(nextVipp)} VIPP.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setPrestige(nextVipp);
              setOpen(false);
            }}
          >
            <ArrowUp01Icon /> Prestige
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
