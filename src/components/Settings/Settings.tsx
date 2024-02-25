import { FaUserCircle } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HowToUse } from "../HowToUse";
import { useCallback } from "react";
import { Token } from "../Token";

function Settings() {
  const handleReset = useCallback(() => {
    const reset = confirm("Are you sure you want to reset");
    if (reset)
      localStorage.clear(), alert("successfully reset"), location.reload();
  }, []);
  const handleLoad = useCallback(() => {
    const l = prompt("Enter Shared Token");
    if (l && l?.trim() != "") {
      localStorage.setItem("uid", l);
      location.reload();
    }
  }, []);

  return (
    <Drawer>
      <DrawerTrigger>
        <FaUserCircle className="h-7 w-7 text-zinc-100" />
      </DrawerTrigger>
      <DrawerContent className="px-5">
        <DrawerHeader>
          <DrawerTitle className="text-zinc-400 font-bold">
            Napster Settings
          </DrawerTitle>
        </DrawerHeader>
        <p
          onClick={handleLoad}
          className=" rounded-xl py-2.5  bg-secondary flex justify-center  text-base"
        >
          Load From Token
        </p>
        <Token />
        <HowToUse />
        <p
          onClick={() => window.open("https://tanmayo7.vercel.app")}
          className=" rounded-xl py-2.5 mt-3 bg-secondary flex justify-center text-base "
        >
          More by babyo7_
        </p>
        <p
          onClick={handleReset}
          className=" rounded-xl py-2.5 mt-3 flex justify-center bg-red-500 text-base "
        >
          Reset
        </p>

        <DrawerFooter className=" items-center">
          <span className="text-xs text-zinc-300">Version - 1.1.7 beta</span>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default Settings;
