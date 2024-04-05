import { QRCodeSVG } from "qrcode.react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import React, { SyntheticEvent } from "react";
import Autoplay from "embla-carousel-autoplay";
import { AspectRatio } from "./ui/aspect-ratio";

function Desktop({ desktop, iPad }: { desktop: boolean; iPad: boolean }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <>
      <div className="absolute fade-in inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <div className="flex z-10   justify-center flex-col h-screen text-center items-center py-10">
        <Carousel
          plugins={[plugin.current]}
          className="rounded-xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="rounded-xl">
            <CarouselItem className="rounded-xl flex justify-center items-center">
              <AspectRatio
                ratio={9 / 10}
                className=" bg-transparent rounded-xl"
              >
                <video
                  src="/assets/demo.mp4"
                  muted
                  autoPlay
                  onClick={(e: SyntheticEvent<HTMLVideoElement>) =>
                    e.currentTarget.play()
                  }
                  className="rounded-xl object-fit h-[100%] w-[100%] "
                />
              </AspectRatio>
            </CarouselItem>
            <CarouselItem className="rounded-xl flex flex-col  justify-center items-center">
              <span className="font-semibold text-zinc-700">
                Not available for {desktop && "Desktop"} {iPad && "iPad"} Now
              </span>
              <h1 className="font-bold text-5xl mt-4 mb-4 text-zinc-700">
                Scan this QR
              </h1>
              <span className="font-semibold text-zinc-700">on Phone</span>
              <div className="  bg-black/20 h-96 w-96  mt-5 object-center flex justify-center items-center overflow-hidden rounded-3xl">
                <QRCodeSVG
                  value={window.location.origin}
                  className="h-96 w-96 p-4 rounded-[1.7rem]"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center flex-col items-center mt-[2vw]">
          <h1 className="font-bold text-zinc-500">NapsterDrx.</h1>
          <span className="font-semibold text-zinc-500 text-xs mt-1">
            Love from NapsterDrx.
          </span>
        </div>
      </div>
    </>
  );
}

export { Desktop };
