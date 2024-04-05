import { useDispatch } from "react-redux";
import AddLibrary from "../Library/AddLibrary";
import Settings from "../Settings/Settings";
import { setIsIphone } from "@/Store/Player";

function Header({ title, l }: { title?: string; l?: boolean }) {
  const dispatch = useDispatch();

  const handlePwa = () => {
    dispatch(setIsIphone(true));
  };
  return (
    <>
      <nav className="p-5 pt-11 px-5 fade-in flex justify-between items-center">
        <h1 className="  font-bold tracking-tight text-3xl ">
          {title || "NapsterDrx."}
        </h1>
        {!window.matchMedia("(display-mode: standalone)").matches &&
          title == "Home" && (
            <p className="-mr-[45vw]" onClick={handlePwa}>
              Install
            </p>
          )}
        {l && <AddLibrary />}
        <Settings />
      </nav>
    </>
  );
}

export default Header;
