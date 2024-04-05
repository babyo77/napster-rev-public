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
        <p className=" rounded-xl bg-green-500 py-2.5 mt-3  w-full text-base">
          Transfer from Spotify
        </p>
      </DialogTrigger>
      <DialogContent className="w-[87vw]  rounded-2xl">
        <DialogHeader>
          <DialogTitle className="  text-lg">In app coming soon</DialogTitle>
        </DialogHeader>

        <div>
          <AspectRatio ratio={3 / 3}>
            <LazyLoadImage
              width="100%"
              height="100%"
              effect="blur"
              src="https://i.pinimg.com/originals/27/6f/27/276f273d11f8b9dbc0a9c55bb38ea8c6.gif"
              alt="Transfer"
              className=" border rounded-2xl object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              asChild
              variant={"secondary"}
              className=" py-5 w-full rounded-xl"
            >
              <a href="https://www.tunemymusic.com/transfer" target="_blank">
                Try Third Party
              </a>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { HowToUse };
