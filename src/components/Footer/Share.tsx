import { IoShareOutline } from "react-icons/io5";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { AspectRatio } from "../ui/aspect-ratio";
import { Blurhash } from "react-blurhash";
import { toBlob } from "html-to-image";
import { forwardRef, useCallback, useRef, useState } from "react";
import { encode } from "blurhash";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { TbMicrophone2 } from "react-icons/tb";
import { LiaExchangeAltSolid } from "react-icons/lia";
import Loader from "../Loaders/Loader";
import { Button } from "../ui/button";
import { VscMusic } from "react-icons/vsc";
import { ChangeLyrics } from "./ChangeLyrics";
import { BiLinkAlt } from "react-icons/bi";
import useOptions from "../Library/useoptions";
import { toast } from "../ui/use-toast";

const ShareLyrics = forwardRef<
  HTMLButtonElement,
  {
    size?: boolean;
    className?: string;
    lyrics?: [{ time: number | string; lyrics: string }];
  }
>(({ lyrics, size, className }, ref) => {
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const loadImage = useCallback(async (src: string) => {
    setRound(false);
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  }, []);

  const getImageData = useCallback((image: HTMLImageElement) => {
    setRound(false);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    }
  }, []);

  const [blurHash, setBlurHash] = useState<string>(
    "L56bv5}iVBV|-LrnN$WB0rIT$_pK"
  );

  const [round, setRound] = useState<boolean>(true);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const shareLyrics = useCallback(async () => {
    setRound(false);

    const lyrics = lyricsRef.current;
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
      setRound(true);

      const file = new File([blob], "share.png", { type: "image/png" });

      const shareFile = [file];

      await navigator.share({
        files: shareFile,
      });
    } catch (error) {
      setRound(true);
      console.error(error);
    }
  }, []);

  const [blur, setBlur] = useState<boolean>(false);
  const [ShareSong, setShareSong] = useState<boolean>(true);

  const encodeImageToBlurhash = useCallback(
    async (imageUrl: string) => {
      try {
        setRound(false);
        const image = await loadImage(imageUrl);
        const imageData = getImageData(image as unknown as HTMLImageElement);
        if (imageData) {
          setBlur((prev) => !prev);
          setRound(true);
          return setBlurHash(
            encode(imageData.data, imageData.width, imageData.height, 4, 4)
          );
        }
      } catch (error) {
        toast({
          variant: "destructive",
          //@ts-expect-error:error
          description: `Error: ${error.message || "Try again"}`,
        });
        setRound(true);
      }
    },
    [getImageData, loadImage]
  );

  const handleShareSong = useCallback(() => {
    setShareSong((prev) => !prev);
  }, []);

  const { handleShare } = useOptions({ music: playlist[currentIndex] });
  return (
    <Drawer>
      <DrawerTrigger
        ref={ref}
        className={`m-0 p-1.5 flex  justify-center items-center ${
          className ? "" : "bg-zinc-900"
        }   rounded-full `}
      >
        <IoShareOutline
          className={` text-white ${
            size ? "h-[1.1rem] w-[1.1rem]" : "h-6 w-6"
          }`}
        />
      </DrawerTrigger>
      <DrawerContent className="  h-[100dvh] rounded-none px-[4.5vw]">
        {!round && (
          <div className=" absolute z-10 bg-black/10 w-[91vw] h-full pb-14 flex justify-center items-center">
            <Loader color="white" />
          </div>
        )}
        <div className=" relative flex animate-fade-down pt-[5vh] flex-col space-y-3 justify-center items-center py-[1vh] ">
          <AspectRatio
            id="lyrics"
            ref={lyricsRef}
            ratio={9 / 16}
            className={`relative shadow-none p-0  m-0 flex items-center justify-center overflow-hidden ${
              round ? "rounded-2xl" : ""
            }`}
          >
            {blur ? (
              <Blurhash
                hash={blurHash}
                width={"100%"}
                height={"100%"}
                resolutionX={32}
                resolutionY={32}
                punch={1}
              />
            ) : (
              <img
                loading="lazy"
                src={
                  playlist[currentIndex]?.thumbnailUrl.replace(
                    "w120-h120",
                    "w1080-h1080"
                  ) || "./favicon.jpeg"
                }
                width="100%"
                height="100%"
                alt="Image"
                className="blur-[1.3px] rounded-none shadow-none object-cover h-[100%] w-[100%]"
              />
            )}

            <div className=" absolute text-zinc-100  overflow-hidden rounded-2xl font-semibold backdrop-blur-lg">
              {ShareSong ? (
                <div className=" flex flex-col text-left  space-y-2  bg-black/30  py-3 px-3 pt-4">
                  <div className="overflow-hidden flex h-[15.5rem] w-[15.5rem]">
                    <img
                      src={
                        playlist[currentIndex]?.thumbnailUrl.replace(
                          "w120-h120",
                          "w1080-h1080"
                        ) || "/favicon.jpeg"
                      }
                      width="100%"
                      height="100%"
                      alt="Image"
                      loading="lazy"
                      className="rounded-lg object-cover h-[100%] w-[100%]"
                    />
                  </div>
                  <div className=" break-words ">
                    <p className="text-lg  leading-[1.5rem] font-bold mt-0.5 break-words max-w-[59vw]">
                      {playlist[currentIndex]?.title}
                    </p>
                    <p className=" -mt-0.5 text-zinc-200 text-base font-semibold break-words max-w-[55vw]">
                      {playlist[currentIndex]?.artists[0]?.name}
                    </p>
                    <p className=" text-sm mt-0.5 text-zinc-300/50 font-semibold break-words max-w-[55vw]">
                      Napster
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  {lyrics && <ChangeLyrics lyrics={lyrics} />}
                </div>
              )}
            </div>
          </AspectRatio>
        </div>
        <div className=" flex justify-center items-center pt-[1vh]">
          <div className="flex space-x-[4vw] text-xs">
            <Button
              variant={"secondary"}
              onClick={shareLyrics}
              id="share"
              className=" text-xs flex animate-fade-up items-center px-5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
            >
              <IoShareOutline className=" h-6 w-6" />
              <p>Share</p>
            </Button>
            <Button
              variant={"secondary"}
              onClick={() =>
                encodeImageToBlurhash(playlist[currentIndex].thumbnailUrl)
              }
              className=" text-xs flex animate-fade-up items-center px-2.5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
            >
              <LiaExchangeAltSolid className=" h-6 w-6" />
              <p>Change BG</p>
            </Button>
            {lyrics && lyrics.length > 0 && (
              <Button
                variant={"secondary"}
                onClick={handleShareSong}
                className="text-xs  flex  animate-fade-up items-center px-5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
              >
                {ShareSong ? (
                  <TbMicrophone2 className=" h-6 w-6" />
                ) : (
                  <VscMusic className=" h-6 w-6" />
                )}
                <p>{ShareSong ? "Lyrics" : "Music"}</p>
              </Button>
            )}
            {!lyrics && (
              <Button
                variant={"secondary"}
                onClick={handleShare}
                className=" text-xs flex animate-fade-up items-center px-2.5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
              >
                <BiLinkAlt className=" h-6 w-6" />
                <p>Copy link</p>
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
});

export default ShareLyrics;
