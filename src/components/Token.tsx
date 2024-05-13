import { Button } from "@/components/ui/button";

import { useCallback, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { SiJsonwebtokens } from "react-icons/si";
import { toBlob } from "html-to-image";
import Loader from "./Loaders/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";

export function Token() {
  const [saving, setSaving] = useState<boolean>(false);
  const handleCopy = useCallback(async () => {
    setSaving(true);
    const lyrics = document.getElementById("cr");
    if (lyrics == null) return;

    try {
      await toBlob(lyrics, {
        cacheBust: true,
      });
      await toBlob(lyrics, {
        cacheBust: true,
      });
      const blob = await toBlob(lyrics, {
        cacheBust: true,
      });
      if (!blob) return;

      const file = new File([blob], "share.png", { type: "image/png" });

      const shareFile = [file];

      await navigator.share({
        files: shareFile,
      });
      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.error(error);
    }
  }, []);

  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <p className=" bg-neutral-950 animate-fade-up font-medium  rounded-xl py-2.5 mt-3  w-full text-base flex items-center justify-center space-x-1">
          <SiJsonwebtokens className="h-4 w-4" />
          <span>Credentials</span>
        </p>
      </DrawerTrigger>
      <DrawerContent className="w-full h-dvh px-5 rounded-none">
        <DrawerHeader>
          <DrawerTitle className="animate-fade-down">Credentials</DrawerTitle>
        </DrawerHeader>

        <div className="flex animate-fade-up flex-col items-center space-y-2 h-full justify-center">
          <div id="cr" className=" py-2 px-2">
            <p className="text-xl  text-pretty font-medium text-zinc-200">
              Token - {uid}
            </p>
            <p className="text-xl  text-pretty font-medium text-zinc-200">
              Password - {localStorage.getItem("pp")}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCopy}
            variant={"secondary"}
            className="px-3 w-full border bg-neutral-950  text-base font-medium rounded-2xl animate-fade-up hover:bg-zinc-100/20 text-zinc-200 py-5"
          >
            <p className="flex space-x-1.5 items-center">
              {saving && <Loader size="21" className=" mt-2" />}
              <span>Save Credentials</span>
            </p>
          </Button>
        </div>
        <DrawerFooter className="sm:justify-start px-0"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
