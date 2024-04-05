import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaBackward, FaRegStar } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import { FaForward } from "react-icons/fa";
import { TfiLoop } from "react-icons/tfi";
import { FaPause } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  play,
  setDurationLyrics,
  setIsIphone,
  setIsLoading,
  setNextPrev,
  setPlayer,
  setProgressLyrics,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { GetImage, streamApi } from "@/API/api";
import Loader from "../Loaders/Loader";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  DATABASE_ID,
  ID,
  LAST_PLAYED,
  LIKE_SONG,
  db,
} from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import { Query } from "appwrite";
import { useSwipeable } from "react-swipeable";
import { IoIosList } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";
import Options from "./Options";
import Lyrics from "./Lyrics";
function AudioPLayerComp() {
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [playEffect, setPlayEffect] = useState<boolean>();
  const dispatch = useDispatch();
  const [duration, setDuration] = useState<number | "--:--">();
  const music = useSelector((state: RootState) => state.musicReducer.music);
  const [progress, setProgress] = useState<number | "--:--">();
  const [liked, SetLiked] = useState<boolean>();
  const PlaylistOrAlbum = useSelector(
    (state: RootState) => state.musicReducer.PlaylistOrAlbum
  );

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const isLoading = useSelector(
    (state: RootState) => state.musicReducer.isLoading
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector((state: RootState) => state.musicReducer.queue);
  const currentArtistId = useSelector(
    (state: RootState) => state.musicReducer.currentArtistId
  );
  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );
  const isLooped = useSelector((state: RootState) => state.musicReducer.isLoop);
  const isStandalone = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const isLikedCheck = async () => {
    const r = await db.listDocuments(DATABASE_ID, LIKE_SONG, [
      Query.equal("for", [localStorage.getItem("uid") || "default"]),
      Query.equal("youtubeId", [playlist[currentIndex].youtubeId]),
    ]);
    if (r.documents.length == 0) {
      SetLiked(false);
    } else {
      SetLiked(true);
    }
    return r.documents;
  };

  const { data: isLiked, refetch } = useQuery(
    ["likedSongs", playlist[currentIndex].youtubeId],
    isLikedCheck,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const handleLink = useCallback(() => {
    SetLiked(true);
    db.createDocument(DATABASE_ID, LIKE_SONG, ID.unique(), {
      youtubeId: playlist[currentIndex].youtubeId,
      title: playlist[currentIndex].title,
      artists: [
        playlist[currentIndex].artists[0]?.id || currentArtistId || "unknown",
        playlist[currentIndex].artists[0]?.name || "unknown",
      ],
      thumbnailUrl: playlist[currentIndex].thumbnailUrl,
      for: localStorage.getItem("uid") || "default",
    })
      .then(() => {
        refetch();
      })
      .catch(() => {
        SetLiked(false);
      });
  }, [currentIndex, playlist, currentArtistId, refetch]);

  const RemoveLike = useCallback(async () => {
    SetLiked(false);
    if (isLiked) {
      try {
        await db.deleteDocument(
          DATABASE_ID,
          LIKE_SONG,
          isLiked[0].$id || "default"
        );
      } catch (error) {
        console.error(error);
        SetLiked(true);
      }
    }
  }, [isLiked]);

  const handlePlay = useCallback(() => {
    setPlayEffect(true);
    const t = setTimeout(() => {
      setPlayEffect(false);
    }, 200);
    if (isPlaying) {
      music?.pause();
      dispatch(play(false));
    } else {
      music?.play();
      dispatch(play(true));
    }
    return () => clearTimeout(t);
  }, [isPlaying, music, dispatch]);

  const handleNext = useCallback(() => {
    setNext(true);
    const t = setTimeout(() => {
      setNext(false);
    }, 200);
    if (!isStandalone) {
      dispatch(setIsIphone(true));
    }
    if (isLooped) return;
    SetLiked(false);
    if (playlist.length > 1) {
      dispatch(setNextPrev("next"));
    }
    return () => clearTimeout(t);
  }, [dispatch, playlist.length, isLooped, isStandalone]);

  const handlePrev = useCallback(() => {
    setPrev(true);
    const t = setTimeout(() => {
      setPrev(false);
    }, 200);
    if (isLooped) return;
    if (playlist.length > 1) {
      dispatch(setNextPrev("prev"));
    }
    return () => clearTimeout(t);
  }, [dispatch, playlist.length, isLooped]);

  const swipeHandler = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
  });

  const saveLastPlayed = useCallback(() => {
    if (uid) {
      db.createDocument(DATABASE_ID, LAST_PLAYED, uid, {
        user: uid,
        playlisturl: playingPlaylistUrl,
        navigator: PlaylistOrAlbum,
        curentsongid: playlist[currentIndex].youtubeId,
        index: currentIndex,
      }).catch(() => {
        db.updateDocument(DATABASE_ID, LAST_PLAYED, uid, {
          user: uid,
          playlisturl: playingPlaylistUrl,
          navigator: PlaylistOrAlbum,
          curentsongid: playlist[currentIndex].youtubeId,
          index: currentIndex,
        });
      });
    }
  }, [playlist, currentIndex, PlaylistOrAlbum, uid, playingPlaylistUrl]);

  // const updateSeek = useCallback(async () => {
  //   if (uid && music) {
  //     await db.updateDocument(DATABASE_ID, LAST_PLAYED, uid, {
  //       seek: music.currentTime,
  //     });
  //   }
  // }, [uid, music]);

  // useEffect(() => {
  //   if (isPlaying) {
  //     const seek = setInterval(async () => {
  //       updateSeek();
  //     }, 5000);
  //     return () => clearInterval(seek);
  //   }
  // }, [updateSeek, isPlaying]);

  // const playingInsights = useCallback(() => {
  //   db.createDocument(DATABASE_ID, MOST_PLAYED, ID.unique(), {
  //     user: localStorage.getItem("uid"),
  //     sname: playlist[currentIndex].title,
  //     sid: playlist[currentIndex].youtubeId,
  //     sartist: playlist[currentIndex].artists[0].name,
  //   });
  // }, [playlist, currentIndex]);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current) {
      dispatch(setIsLoading(true));

      const sound: HTMLAudioElement | null = audioRef.current;
      sound.src = `${streamApi}${playlist[currentIndex]?.youtubeId}`;
      const handlePlay = () => {
        if (isLooped) {
          sound.loop = true;
        }
        dispatch(play(true));
        dispatch(setDurationLyrics(sound.duration));
        saveLastPlayed();
      };

      const handlePause = () => {
        dispatch(play(false));
      };

      const handleError = () => {
        setDuration("--:--");
        setProgress("--:--");
        dispatch(setIsLoading(false));
        sound.pause();
        dispatch(play(false));
      };

      const handleSeek = (seek: MediaSessionActionDetails) => {
        if (sound.currentTime !== seek.seekTime) {
          sound.currentTime = seek.seekTime ?? 0;
          if (sound.paused) {
            sound.play();
          }
        }
      };

      const handleLoad = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: playlist[currentIndex].title,
          artist: playlist[currentIndex].artists[0]?.name,
          album: "",
          artwork: [
            {
              src: playlist[currentIndex].thumbnailUrl.replace(
                "w120-h120",
                "w1080-h1080"
              ),
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => sound.play());
        navigator.mediaSession.setActionHandler("pause", () => sound.pause());
        navigator.mediaSession.setActionHandler("nexttrack", handleNext);
        navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
        navigator.mediaSession.setActionHandler("seekto", handleSeek);
        dispatch(setIsLoading(false));
        setDuration(sound.duration);
        setProgress(sound.currentTime);
        dispatch(setDurationLyrics(sound.duration));
        refetch();
      };

      const handleTimeUpdate = () => {
        const time = sound.currentTime;
        setProgress(time);
        dispatch(setProgressLyrics(time));
      };

      sound.setAttribute("playsinline", "true");
      sound.addEventListener("play", handlePlay);
      sound.addEventListener("pause", handlePause);
      sound.addEventListener("loadedmetadata", handleLoad);
      sound.addEventListener("error", handleError);
      sound.addEventListener("timeupdate", handleTimeUpdate);
      sound.addEventListener("ended", handleNext);
      sound.play();
      dispatch(setPlayer(sound));

      return () => {
        sound.load();
        sound.pause();

        sound.removeEventListener("play", handlePlay);
        sound.removeEventListener("pause", handlePause);
        sound.removeEventListener("loadedmetadata", handleLoad);
        sound.removeEventListener("timeupdate", handleTimeUpdate);
        sound.removeEventListener("error", handleError);
        sound.removeEventListener("ended", handleNext);

        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      };
    }
  }, [
    dispatch,
    handlePrev,
    currentIndex,
    playlist,
    handleNext,
    refetch,
    isLooped,
    saveLastPlayed,
  ]);

  const handleLoop = useCallback(async () => {
    if (music && isPlaying) {
      if (music.loop) {
        music.loop = false;
      } else {
        music.loop = true;
      }
    }
  }, [music, isPlaying]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (music) {
        music.currentTime = parseInt(e.target.value) ?? 0;
      }
    },
    [music]
  );
  const closeRef = useRef<HTMLButtonElement>(null);

  const formatDuration = useCallback((seconds: number | "--:--") => {
    if (seconds == "--:--") return seconds;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }, []);

  return (
    <>
      <audio src="" hidden ref={audioRef}></audio>
      {isStandalone ? (
        <p className="w-[68dvw]  px-4">app not installed</p>
      ) : (
        <Drawer>
          <DrawerTrigger>
            <div className="items-center fade-in flex space-x-2 w-[68dvw]   px-2.5">
              <div className=" h-11 w-11 overflow-hidden rounded-xl">
                <LazyLoadImage
                  height="100%"
                  width="100%"
                  src={
                    `${GetImage}${playlist[currentIndex].thumbnailUrl}` ||
                    "https://i.pinimg.com/564x/d4/40/76/d44076613b20dd92a8e4da29a8df538e.jpg"
                  }
                  alt="Image"
                  effect="blur"
                  className="object-cover transition-all duration-300 w-[100%] h-[100%] "
                />
              </div>
              <div className="flex flex-col text-start">
                <p className=" text-sm truncate  w-[50vw] ">
                  {playlist[currentIndex].title}
                </p>
                <p className=" text-xs w-[30vw] truncate">
                  {playlist[currentIndex].artists[0]?.name}
                </p>
              </div>
            </div>
          </DrawerTrigger>

          <DrawerContent className=" h-[100dvh]  rounded-none bg-[#121212] ">
            <div className="flex flex-col justify-start pt-7  h-full">
              <DrawerHeader>
                <div
                  {...swipeHandler}
                  className={`overflow-hidden flex justify-center items-center 
                   
                     rounded-2xl mx-1 `}
                >
                  <div className="flex justify-center items-center  h-[44dvh]">
                    <LazyLoadImage
                      src={playlist[currentIndex].thumbnailUrl.replace(
                        "w120-h120",
                        "w1080-h1080"
                      )}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                        (e.currentTarget.src =
                          "https://i.pinimg.com/564x/d4/40/76/d44076613b20dd92a8e4da29a8df538e.jpg")
                      }
                      alt="Image"
                      visibleByDefault
                      className={`object-fit shadow-lg transition-all duration-500 rounded-2xl ${
                        music && !music.paused
                          ? "w-[90vw] h-[44dvh]"
                          : "w-[75vw] h-[35dvh]"
                      }`}
                    />
                  </div>
                </div>
                <div className=" absolute bottom-[35.5vh] w-full text-start px-2 ">
                  <div className="flex items-center  w-fit space-x-3">
                    <h1 className="text-3xl truncate transition-all duration-300  w-[63vw] font-semibold">
                      {" "}
                      {playlist[currentIndex].title}
                    </h1>
                    <div className=" bg-zinc-900 p-1.5 rounded-full">
                      {liked ? (
                        <AiFillStar
                          onClick={RemoveLike}
                          className="h-6 w-6 fade-in "
                        />
                      ) : (
                        <FaRegStar
                          className="h-6 w-6 fade-in"
                          onClick={handleLink}
                        />
                      )}
                    </div>
                    <Options
                      id={playingPlaylistUrl}
                      music={playlist[currentIndex]}
                    />
                  </div>

                  {playlist[currentIndex].artists[0]?.name ? (
                    <Link
                      to={`/artist/${
                        playlist[currentIndex].artists[0]?.id || currentArtistId
                      }`}
                    >
                      <DrawerClose className="text-start">
                        <p className="text-base truncate transition-all duration-300 w-[70vw] text-red-500">
                          {" "}
                          {playlist[currentIndex].artists[0]?.name}
                        </p>
                      </DrawerClose>
                    </Link>
                  ) : (
                    <p className="text-base truncate transition-all duration-300 w-64 text-red-500">
                      {" "}
                      Unknown
                    </p>
                  )}
                </div>
              </DrawerHeader>
              <div className="flex  absolute bottom-[26vh]  w-full flex-col justify-center px-6 pt-1 ">
                <input
                  type="range"
                  value={progress || 0}
                  max={duration || 1}
                  onChange={handleSeek}
                  min="0"
                  step=".01"
                  dir="ltr"
                  className="w-full h-2 bg-zinc-300/75 transition-all duration-300 overflow-hidden rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex text-sm justify-between py-2 px-1">
                  <span className="text-zinc-400 transition-all duration-300 font-semibold">
                    {formatDuration((progress as "--:--") || 0)}
                  </span>
                  <span className="text-zinc-400 transition-all duration-300 font-semibold">
                    {formatDuration((duration as "--:--") || "--:--")}
                  </span>
                </div>
              </div>
              <div className="flex absolute bottom-[16vh] w-full space-x-16 justify-center  items-center">
                <div
                  className={`${
                    prev && "bg-zinc-900 rounded-full"
                  } transition-all duration-300 h-8 w-10`}
                >
                  <FaBackward
                    className={`${
                      prev ? "h-6 w-8" : "h-8 w-10"
                    } transition-all duration-300 ${
                      playlist.length > 1 ? "text-zinc-100" : "text-zinc-500"
                    } `}
                    onClick={handlePrev}
                  />
                </div>
                {isLoading ? (
                  <div className="h-12 w-12 flex justify-center items-center">
                    <Loader size="37" loading={true} />
                  </div>
                ) : (
                  <div className="h-12 w-12">
                    {isPlaying ? (
                      <FaPause
                        className={` transition-all duration-300 ${
                          playEffect ? "h-11 w-11" : "h-12 w-12"
                        }`}
                        onClick={handlePlay}
                      />
                    ) : (
                      <IoPlay
                        className={` transition-all duration-300 ${
                          playEffect ? "h-11 w-11" : "h-12 w-12"
                        }`}
                        onClick={handlePlay}
                      />
                    )}
                  </div>
                )}
                <div
                  className={`${
                    next && "bg-zinc-900 rounded-full"
                  } transition-all duration-300 h-8 w-9 `}
                >
                  <FaForward
                    className={` ${
                      next ? "h-6 w-7" : "h-8 w-9"
                    } transition-all duration-300 ${
                      playlist.length > 1 ? "text-zinc-100" : "text-zinc-500"
                    } `}
                    onClick={handleNext}
                  />
                </div>
              </div>
              <div className=" justify-center absolute bottom-[5vh] w-full px-8 text-zinc-400 items-center">
                <div className="flex items-center justify-between w-full">
                  <TfiLoop
                    className={`h-6 w-6 ${
                      music && music.loop ? "text-zinc-400" : "text-zinc-700"
                    }`}
                    onClick={handleLoop}
                  />

                  <Lyrics closeRef={closeRef} />
                  <DrawerClose
                    ref={closeRef}
                    className="w-0 h-0 p-0 m-0 hidden"
                  ></DrawerClose>
                  {playlist.length > 1 ? (
                    <Link to={`/suggested/`}>
                      <DrawerClose>
                        <IoIosList className="h-6 w-6" />
                      </DrawerClose>
                    </Link>
                  ) : (
                    <IoIosList className="h-6 w-6 text-zinc-700" />
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
const AudioPLayer = React.memo(AudioPLayerComp);
export default AudioPLayer;
