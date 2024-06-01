import { IoShareOutline } from "react-icons/io5";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { AspectRatio } from "../ui/aspect-ratio";
import { Blurhash } from "react-blurhash";
import { toBlob } from "html-to-image";
import React, { useCallback, useRef, useState } from "react";
import { encode } from "blurhash";
import { TbMicrophone2 } from "react-icons/tb";
import { LiaExchangeAltSolid } from "react-icons/lia";

import Loader from "../Loaders/Loader";
import { Button } from "../ui/button";
import { VscMusic } from "react-icons/vsc";
import { GoShare } from "react-icons/go";
import { BiLinkAlt } from "react-icons/bi";
import { RootState } from "@/Store/Store";
import { useSelector } from "react-redux";

function PlaylistShareComp({
  lyrics,
  cover,
  name,
  maker,
}: {
  cover: string;
  maker: string;
  name: string;
  lyrics?: [{ time: number | string; lyrics: string }];
}) {
  const loadImage = useCallback(async (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  }, []);

  const getImageData = useCallback((image: HTMLImageElement) => {
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
    },
    [getImageData, loadImage]
  );

  const handleShareSong = useCallback(() => {
    setShareSong((prev) => !prev);
  }, []);

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const handleCopyLink = useCallback(() => {
    if (uid) {
      navigator.share({
        url: window.location.href.replace(uid.substring(uid.length - 4), ""),
      });
    }
  }, [uid]);
  return (
    <Drawer>
      <DrawerTrigger className="p-0 m-0">
        <GoShare className="h-8 w-8 animate-fade-left backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
      </DrawerTrigger>
      <DrawerContent className="  h-[100dvh] rounded-none px-[4.5vw] ">
        {!round && (
          <div className=" absolute z-10 bg-black/10 w-[91vw] h-[100dvh] flex justify-center items-center">
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
                src={cover || "./favicon.jpeg"}
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
                      src={cover || "/favicon.jpeg"}
                      width="100%"
                      height="100%"
                      alt="Image"
                      loading="lazy"
                      className="rounded-lg object-cover h-[100%] w-[100%]"
                    />
                  </div>
                  <div className=" break-words ">
                    <p className="text-lg  leading-[1.5rem] font-bold mt-0.5 break-words max-w-[59vw]">
                      {name}
                    </p>
                    <p className=" -mt-0.5 text-zinc-200 text-base font-semibold break-words max-w-[55vw]">
                      Playlist by {maker || "Someone"}
                    </p>
                    <p className=" text-sm mt-0.5 text-zinc-300/50 font-semibold break-words max-w-[55vw]">
                      Napster
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  <div></div>
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
              onClick={() => encodeImageToBlurhash(cover)}
              className=" text-xs flex animate-fade-up items-center px-2.5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
            >
              <LiaExchangeAltSolid className=" h-6 w-6" />
              <p>Change BG</p>
            </Button>
            <Button
              variant={"secondary"}
              onClick={handleCopyLink}
              className=" text-xs flex animate-fade-up items-center px-2.5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
            >
              <BiLinkAlt className=" h-6 w-6" />
              <p>Copy Link</p>
            </Button>
            {lyrics && (
              <Button
                variant={"secondary"}
                onClick={handleShareSong}
                className="text-xs  flex animate-fade-up items-center px-5 py-2 bg-zinc-900 text-zinc-300 rounded-lg space-x-1.5"
              >
                {ShareSong ? (
                  <TbMicrophone2 className=" h-6 w-6" />
                ) : (
                  <VscMusic className=" h-6 w-6" />
                )}
                <p>{ShareSong ? "Lyrics" : "Music"}</p>
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
const PlaylistShare = React.memo(PlaylistShareComp);
export default PlaylistShare;
