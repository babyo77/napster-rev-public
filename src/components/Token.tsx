import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";

export function Token() {
  const token = localStorage.getItem("uid") || "";
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(token);
      alert("copied");
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  return (
    <Dialog>
      <DialogTrigger>
        <p className=" rounded-xl py-2.5 mt-3 bg-neutral-900  w-full text-base">
          Token
        </p>
      </DialogTrigger>
      <DialogContent className="w-[87vw] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Your access token</DialogTitle>
          <DialogDescription>
            Anyone who has this token will be able to change your playlists.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={localStorage.getItem("uid") || ""}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            variant={"secondary"}
            className="px-3 bg-zinc-800 hover:bg-zinc-100/20 text-white"
          >
            <span className="sr-only" onClick={handleCopy}>
              Copy
            </span>
            <CopyIcon className="h-4 w-4 " onClick={handleCopy} />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              asChild
              variant={"secondary"}
              className=" py-5 w-full rounded-xl"
            >
              <p>Close</p>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
