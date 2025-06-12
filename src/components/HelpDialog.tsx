import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";

export default function HelpDialog() {
  const [open, setOpen] = useStore(useShallow((state) => [state.helpOpen, state.setHelpOpen]));
  return (
    <dialog open={open} onClose={() => setOpen(false)} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Gleaming Semolina - Incremental Clicker!</h3>
        <p>
          What is it? Number go up! An incremental game designed for more active play where the
          clicker stays relevant throughout the game.
        </p>
        <p className="font-bold mt-4">Generators:</p>
        <p>
          Generators are the backbone of your progress. They produce resources automatically over
          time.
        </p>
        <p>
          The first number is the cost, second number is the "value per second" (VPS) that each
          individual generator generates, the third number is the PP and the fourth (if present) is
          the time until you'll be able to afford to buy the next generator. On the right, it shows
          the total vps for this generator type, and the amount of generators owned.
        </p>
        <p className="mt-4">
          PP = "Payback Period". Smaller values are better! The time it takes for an
          upgrade/generator to pay itself off.
        </p>
        <p className="mt-4">VIPP = "Very Important Prestige Points".</p>

        <p className="font-bold mt-4">Saving and Loading:</p>
        <p>
          You can save your game progress to a file using the "Save Game" option in the menu. This
          will download a JSON file with your current game state that you can backup or share.
        </p>
        <p>
          To load a previously saved game, use the "Load Game" option and select your saved JSON
          file. This will restore your game to the state it was in when you saved it.
        </p>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
