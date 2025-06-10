import { MenuIcon } from "lucide-react";

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <MenuIcon />
        </button>
      </div> */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Gleaming Semolina</a>
      </div>
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <MenuIcon />
        </label>
      </div>
    </div>
  );
}
