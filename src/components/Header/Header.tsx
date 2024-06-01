import AddLibrary from "../Library/AddLibrary";
import Settings from "../Settings/Settings";

function Header({ title, l }: { title?: string; l?: boolean }) {
  return (
    <>
      <nav className="p-5 pt-11 px-5  flex justify-between items-center">
        <div className=" flex items-center space-x-2">
          <h1 className=" leading-tight animate-fade-right capitalize font-semibold tracking-tight text-3xl ">
            {title || "NapsterDrx."}
          </h1>
        </div>
        {l && <AddLibrary />}
        <Settings />
      </nav>
    </>
  );
}

export default Header;
