import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { IoShareOutline } from "react-icons/io5";

export function AppScreenshots() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="rounded-xl">
        <CarouselItem className="rounded-xl flex flex-col py-11 justify-center items-center">
          Open in Safari <br /> <span className="py-1">Tap on Share</span>
          <IoShareOutline className="fill-black mt-1 mb-4  text-zinc-500  h-8 w-8" />
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="https://www.wikihow.com/images/thumb/d/da/Add-Apps-to-iPhone-Home-Screen-Step-10.jpg/v4-460px-Add-Apps-to-iPhone-Home-Screen-Step-10.jpg.webp"
              alt="ui"
              effect="opacity"
              className="rounded-xl  object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <video
              src="/assets/demo.mp4"
              muted
              autoPlay
              controls
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        {/* <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/2.PNG"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/3.PNG"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/4.PNG"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/5.PNG"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/1.PNG"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem> */}
      </CarouselContent>
    </Carousel>
  );
}
