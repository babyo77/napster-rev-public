import { FaUserCircle } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SpotifyTransfer } from "../SpotifyTransfer";
import { useCallback, useRef } from "react";
import { Token } from "../Token";
import { SponsorsComp } from "../Sponsors";
import { DialogClose } from "../ui/dialog";

function Settings() {
  const closeRef = useRef(null);
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
  const handleLoadPlaylist = useCallback(() => {
    const l = prompt("Enter Shared Playlist Link");
    if (l && l?.trim() != "") {
      if (l.startsWith(window.location.origin)) {
        window.location.href = l;
      } else {
        alert("invalid link");
      }
    }
  }, []);

  return (
    <Drawer>
      <DrawerTrigger>
        <FaUserCircle className="h-7 w-7 text-zinc-100" />
      </DrawerTrigger>
      <DrawerContent className="px-5 bg-neutral-950">
        <DrawerHeader>
          <DrawerTitle className="text-zinc-400 font-bold">
            Napster Settings
          </DrawerTitle>
        </DrawerHeader>
        <p
          onClick={handleLoad}
          className=" rounded-xl py-2.5  bg-neutral-900 flex justify-center  text-base"
        >
          Load From Token
        </p>
        {/iPhone/i.test(navigator.userAgent) && (
          <p
            onClick={handleLoadPlaylist}
            className=" rounded-xl py-2.5 mt-3  bg-neutral-900 flex justify-center  text-base"
          >
            Load Playlist
          </p>
        )}
        <Token />
        {/* <p
          onClick={() =>
            (window.location.href = "mailto:yfw111realone@gmail.com")
          }
          className=" rounded-xl py-2.5 mt-3 bg-neutral-900 flex justify-center text-base "
        >
          Report bug
        </p> */}
        {/* <p
          onClick={() => window.open("https://tanmayo7.vercel.app")}
          className=" rounded-xl py-2.5 mt-3 bg-neutral-900 flex justify-center text-base "
        >
          More by babyo7_
        </p> */}
        <SponsorsComp />
        <SpotifyTransfer close={closeRef} />
        <p
          onClick={handleReset}
          className=" rounded-xl py-2.5 mt-3 flex justify-center bg-red-500 text-base "
        >
          Reset
        </p>
        <DialogClose ref={closeRef}></DialogClose>
        <DrawerFooter className=" items-center">
          <span className="text-xs text-zinc-300">Version - 1.2.7 beta</span>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default Settings;
