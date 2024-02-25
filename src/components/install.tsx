import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

function Install() {
  return (
    <Dialog>
      <DialogTrigger>
        <p className=" rounded-xl py-2.5 bg-secondary w-full text-base">
          Install NapsterDrx.
        </p>
      </DialogTrigger>
      <DialogContent className="w-[87vw] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-extrabold  text-lg">
            How to install
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="m">
          <ul className="flex flex-col gap-2 text-sm pb-4 -mt-4 ml-2">
            <li>Step 1. Click on Share</li>
            <li>Step 2. Add to home screen</li>
          </ul>

          <AspectRatio ratio={3 / 3}>
            <img
              src="/install.webp"
              alt="install-NGLdrx"
              className=" border rounded-xl object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              asChild
              variant={"default"}
              className="font-bold py-5 w-full rounded-xl"
            >
              <p>Close</p>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { Install };
