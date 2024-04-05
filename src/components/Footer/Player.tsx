import { IoPlay } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import AudioPLayer from "./AudioPLayer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { FaPause } from "react-icons/fa6";
import { useCallback } from "react";
import { play, setCurrentIndex, setIsIphone } from "@/Store/Player";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Loader from "../Loaders/Loader";
export function Player() {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.musicReducer.isLoading
  );
  const music = useSelector((state: RootState) => state.musicReducer.music);
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
    if (isPlaying) {
      music?.pause();
      dispatch(play(false));
    } else {
      music?.play();
      dispatch(play(true));
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

  return (
    <>
      <div className="flex items-center w-[95vw] ml-0.5 fade-in py-2 backdrop-blur-md space-x-5 bg-zinc-800/70  rounded-2xl shadow-md z-10 -mb-3">
        {isPlaylist && isPlaylist.length > 0 ? (
          <AudioPLayer />
        ) : (
          <>
            <div className="items-center fade-in flex space-x-2 w-[68dvw]  border-white   px-2.5">
              <div className=" h-11 w-11 overflow-hidden rounded-xl">
                <AspectRatio>
                  <LazyLoadImage
                    width="100%"
                    height="100%"
                    effect="blur"
                    src="https://i.pinimg.com/originals/f1/91/a4/f191a4786289ade562884722ef784cff.jpg"
                    alt="Image"
                    className="object-cover rounded-xl w-[100%] h-[100%] "
                  />
                </AspectRatio>
              </div>
              <div className="flex flex-col text-start">
                <p className="truncate w-44   font-semibold">Not Playing</p>
              </div>
            </div>
            {isLoading ? (
              <Loader loading={true} />
            ) : (
              <div className="flex fade-in space-x-3 pr-3">
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
        {isLoading ? (
          <div className="pr-[13vw]">
            <Loader loading={true} />
          </div>
        ) : (
          <>
            {isPlaylist && isPlaylist.length > 0 && (
              <div className="flex fade-in space-x-3  pr-3">
                {isPlaying ? (
                  <FaPause className="h-7 w-7" onClick={handlePlay} />
                ) : (
                  <IoPlay className="h-7 w-7" onClick={handlePlay} />
                )}
                <TbPlayerTrackNextFilled
                  className={`h-7 w-7  ${
                    isPlaylist && isPlaylist.length > 0
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
