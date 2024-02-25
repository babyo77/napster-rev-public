import AddLibrary from "../Library/AddLibrary";
import Settings from "../Settings/Settings";

function Header({ title, l }: { title?: string; l?: boolean }) {
  return (
    <>
      <nav className="p-5 pt-11 px-5 flex justify-between items-center">
        <h1 className="  font-bold text-3xl ">{title || "NapsterDrx."}</h1>
        {l && <AddLibrary />}
        <Settings />
      </nav>
    </>
  );
}

export default Header;
