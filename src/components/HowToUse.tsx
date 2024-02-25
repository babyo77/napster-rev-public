import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function HowToUse() {
  return (
    <Dialog>
      <DialogTrigger>
        <p className=" rounded-xl py-2.5 mt-3 bg-secondary w-full text-base">
          Load from Spotify
        </p>
      </DialogTrigger>
      <DialogContent className="w-[87vw] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="  text-lg">Adding Soon...</DialogTitle>
        </DialogHeader>

        <div>
          <AspectRatio ratio={3 / 3}>
            <LazyLoadImage
              width="100%"
              height="100%"
              effect="blur"
              src="/favicon.jpeg"
              alt="install-NGLdrx"
              className=" border rounded-xl object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              asChild
              variant={"secondary"}
              className="font-bold py-5 w-full rounded-xl"
            >
              <p>Start listening</p>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { HowToUse };
