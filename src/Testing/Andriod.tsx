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

export function AndroidScreenshots() {
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
        <CarouselItem className="rounded-xl">
          <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
            <LazyLoadImage
              height="100%"
              width="100%"
              src="/ui/Andriod/cropped-tele1.jpg"
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
              src="/ui/Andriod/cropped-tele 2.jpg"
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
              src="/ui/Andriod/cropped-tele3.jpg"
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
              src="/ui/Andriod/cropped-tele4.jpg"
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
              src="/ui/Andriod/cropped-and3.jpg"
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
              src="/ui/Andriod/cropped-and4.jpg"
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
              src="/ui/Andriod/cropped-and5.jpg"
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
              src="/ui/Andriod/cropped-and6.jpg"
              alt="ui"
              effect="opacity"
              className="rounded-xl object-cover h-[100%] w-[100%] "
            />
          </AspectRatio>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
