import { IoPlay } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import AudioPLayer from "./AudioPLayer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { FaPause } from "react-icons/fa6";
import { useCallback, useState } from "react";
import { play, setCurrentIndex, setIsIphone } from "@/Store/Player";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Loader from "../Loaders/Loader";
import { useLocation } from "react-router-dom";
export function Player() {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.musicReducer.isLoading
  );
  const [music, setPlayer] = useState<HTMLAudioElement>();
  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const isLooped = useSelector((state: RootState) => state.musicReducer.isLoop);
  const isPlaylist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );

  const isStandalone = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );
  const handlePlay = useCallback(() => {
    try {
      if (isPlaying && music) {
        music.pause();
        dispatch(play(false));
      } else {
        if (music) {
          music.play();
          dispatch(play(true));
        }
      }
    } catch (error) {
      //@ts-expect-error:error
      alert(error.message);
    }
  }, [dispatch, isPlaying, music]);

  const handleNext = useCallback(() => {
    if (!isStandalone) {
      dispatch(setIsIphone(true));
    }
    if (isLooped) return;
    if (isPlaylist.length > 1) {
      dispatch(setCurrentIndex((currentIndex + 1) % isPlaylist.length));
    }
  }, [dispatch, currentIndex, isPlaylist.length, isLooped, isStandalone]);
  const location = useLocation();
  return (
    <>
      <div
        className={`  ${
          location.pathname !== "/share-play"
            ? "flex items-center rounded-2xl shadow-md z-10 -mb-3   w-[95vw] ml-0.5 fade-in  backdrop-blur-md justify-between py-2 bg-zinc-900/90"
            : ""
        } `}
      >
        {isPlaylist && isPlaylist.length > 0 ? (
          <AudioPLayer setPlay={setPlayer} />
        ) : (
          <>
            {location.pathname !== "/share-play" && (
              <div
                className={`items-center animate-fade-up  ${
                  location.pathname == "/share-play" ? "hidden" : ""
                } flex space-x-2 w-[68dvw]  border-white   px-2.5`}
              >
                <div className=" h-11 w-11 overflow-hidden rounded-lg">
                  <AspectRatio>
                    <LazyLoadImage
                      width="100%"
                      height="100%"
                      effect="blur"
                      src="/cache.jpg"
                      alt="Image"
                      className="object-cover rounded-lg w-[100%] h-[100%] "
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col text-start">
                  <p className="truncate w-44   font-semibold">Not Playing</p>
                </div>
              </div>
            )}
            {isLoading && location.pathname !== "/share-play" ? (
              <div></div>
            ) : (
              <div
                className={` ${
                  location.pathname == "/share-play" ? "hidden" : "flex"
                } space-x-3 pr-3`}
              >
                <IoPlay className="h-7 w-7" />

                <TbPlayerTrackNextFilled
                  className={`h-7 w-7 ${
                    isPlaylist && isPlaylist.length > 0
                      ? "text-zinc-200"
                      : "text-zinc-400"
                  }`}
                />
              </div>
            )}
          </>
        )}
        {isLoading && location.pathname !== "/share-play" ? (
          <div className="pr-[13vw]">
            <Loader loading={true} />
          </div>
        ) : (
          <>
            {isPlaylist &&
              location.pathname !== "/share-play" &&
              isPlaylist.length > 0 && (
                <div
                  className={`flex ${
                    location.pathname == "/share-play" ? "hidden" : ""
                  }  fade-in space-x-3  pr-3`}
                >
                  {isPlaying && location.pathname !== "/share-play" ? (
                    <FaPause className="h-7 w-7" onClick={handlePlay} />
                  ) : (
                    <IoPlay className="h-7 w-7" onClick={handlePlay} />
                  )}
                  <TbPlayerTrackNextFilled
                    className={`h-7 w-7  ${
                      isPlaylist &&
                      location.pathname !== "/share-play" &&
                      isPlaylist.length > 0
                        ? "text-zinc-200"
                        : "text-zinc-400"
                    }`}
                    onClick={handleNext}
                  />
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
}
