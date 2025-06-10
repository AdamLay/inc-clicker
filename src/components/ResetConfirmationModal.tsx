import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";

export default function ResetConfirmationModal() {
  const [open, setOpen, resetGame] = useStore(
    useShallow((state) => [state.resetConfirmOpen, state.setResetConfirmOpen, state.resetGame])
  );

  return (
    <dialog open={open} onClose={() => setOpen(false)} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-warning">Reset Game</h3>
        <p className="py-4">
          Are you sure you want to reset the game? This will delete all your progress and start from
          the beginning.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-warning" onClick={() => resetGame()}>
            Reset Game
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
