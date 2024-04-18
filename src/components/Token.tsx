import { Button } from "@/components/ui/button";

import { useCallback } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export function Token() {
  const token = localStorage.getItem("uid") || "";
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(token);
      alert("Token Copied to Clipboard");
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <p className=" animate-fade-up font-semibold  rounded-xl py-2.5 mt-3 bg-neutral-800  w-full text-base">
          Token
        </p>
      </DrawerTrigger>
      <DrawerContent className="w-full h-dvh px-5 rounded-none">
        <DrawerHeader>
          <DrawerTitle className="animate-fade-down">
            Your access token
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center space-y-4 h-full justify-center">
          <p className="text-2xl text-center font-semibold text-zinc-200">
            {localStorage.getItem("uid")}
          </p>
          <Button
            size="sm"
            variant={"secondary"}
            className="px-3 w-full text-base font-medium rounded-2xl bg-zinc-800 animate-fade-up hover:bg-zinc-100/20 text-zinc-200 py-5"
          >
            <p onClick={handleCopy}>Copy To Clipboard</p>
          </Button>
        </div>
        <DrawerFooter className="sm:justify-start px-0"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
