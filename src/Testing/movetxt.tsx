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

interface CarouselSlideProps {
  image: string;
  text: string;
}

const CarouselSlide = ({ image, text }: CarouselSlideProps) => (
  <div className="flex flex-col items-center">
    <AspectRatio ratio={9 / 16} className="bg-muted rounded-xl">
      <LazyLoadImage
        height="100%"
        width="100%"
        src={image}
        alt="ui"
        effect="opacity"
        className="rounded-xl object-cover h-[100%] w-[100%] "
      />
    </AspectRatio>
    <p className="text-center text-white mt-4">{text}</p>
  </div>
);

export function Moved() {
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
          <CarouselSlide
            image="https://cdn.discordapp.com/attachments/1213096773342601246/1213096773829001256/RPReplay_Final1709229551.mov?ex=65f43b69&is=65e1c669&hm=8b85aa134b7fb96f2fbae629294c2876ca6cc7e6da108edb5aacde51eb869437&"
            text="Slide 1"
          />
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <CarouselSlide image="/ui/Andriod/cropped-tele1.jpg" text="Slide 2" />
        </CarouselItem>

        <CarouselItem className="rounded-xl">
          <CarouselSlide
            image="/ui/Andriod/cropped-tele 2.jpg"
            text="Slide 3"
          />
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <CarouselSlide image="/ui/Andriod/cropped-tele3.jpg" text="Slide 4" />
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <CarouselSlide image="/ui/Andriod/cropped-tele4.jpg" text="Slide 5" />
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <CarouselSlide image="/ui/Andriod/cropped-and3.jpg" text="Slide 6" />
        </CarouselItem>
        <CarouselItem className="rounded-xl">
          <CarouselSlide image="/ui/Andriod/cropped-and4.jpg" text="Slide 7" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
