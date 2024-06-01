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
  SetStopPlaying,
  play,
  setDurationLyrics,
  setIsIphone,
  setIsLoading,
  setNextPrev,
  setPlaylist,
  setProgressLyrics,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { SuggestionSearchApi, streamApi } from "@/API/api";
import { Link, useLocation } from "react-router-dom";

import {
  DATABASE_ID,
  ID,
  LAST_PLAYED,
  LIKE_SONG,
  MOST_PLAYED,
  db,
} from "@/appwrite/appwriteConfig";
import { useQuery, useQueryClient } from "react-query";
import { Permission, Query, Role } from "appwrite";
import { useSwipeable } from "react-swipeable";
import { IoIosList } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";
import Options from "./Options";
import Lyrics from "./Lyrics";
import socket from "@/socket";
import useImage from "@/hooks/useImage";
import axios from "axios";
import useCurrentPlaylist from "@/hooks/getCurrentPlaylistdetails";
import { Skeleton } from "../ui/skeleton";
import useFormatDuration from "@/hooks/formatDuration";
function AudioPLayerComp({
  setPlay,
}: {
  setPlay: React.Dispatch<React.SetStateAction<HTMLAudioElement | undefined>>;
}) {
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [playEffect, setPlayEffect] = useState<boolean>();
  const dispatch = useDispatch();
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [music, setPlayer] = useState<HTMLAudioElement | null>(null);
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
  const q = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);

  const isLikedCheck = async () => {
    const r = await db.listDocuments(DATABASE_ID, LIKE_SONG, [
      Query.equal("for", [uid || "default"]),
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
    ["likedSongs", playlist[currentIndex]?.youtubeId],
    isLikedCheck,
    {
      staleTime: Infinity,
    }
  );

  const handleLink = useCallback(() => {
    if (uid) {
      SetLiked(true);
      db.createDocument(
        DATABASE_ID,
        LIKE_SONG,
        ID.unique(),
        {
          youtubeId: playlist[currentIndex].youtubeId,
          title: playlist[currentIndex].title,
          artists: [
            playlist[currentIndex].artists[0]?.id ||
              currentArtistId ||
              "unknown",
            playlist[currentIndex].artists[0]?.name || "unknown",
          ],
          thumbnailUrl: playlist[currentIndex].thumbnailUrl,
          for: uid,
        },
        [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
      )
        .then(async () => {
          try {
            await q.refetchQueries(["likedSongsDetails", uid]);
          } catch (error) {
            console.log(error);
          }
          refetch();
        })
        .catch(() => {
          SetLiked(false);
        });
    }
  }, [currentIndex, playlist, currentArtistId, refetch, uid, q]);

  const RemoveLike = useCallback(async () => {
    SetLiked(false);
    if (isLiked) {
      try {
        await db.deleteDocument(DATABASE_ID, LIKE_SONG, isLiked[0].$id || "");
        try {
          await q.refetchQueries(["likedSongsDetails", uid]);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.error(error);
        SetLiked(true);
      }
    }
  }, [isLiked, q, uid]);

  const handlePlay = useCallback(() => {
    if (music) {
      setPlayEffect(true);
      const t = setTimeout(() => {
        setPlayEffect(false);
      }, 200);
      if (isPlaying) {
        dispatch(play(false));
        if (isLoading) return;
        music.pause();
      } else {
        dispatch(play(true));
        if (isLoading) return;
        music.play();
      }
      return () => clearTimeout(t);
    }
  }, [isPlaying, music, dispatch, isLoading]);

  const handleNext = useCallback(() => {
    setDuration(0);
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

  const stopPlaying = useSelector(
    (state: RootState) => state.musicReducer.stopPlaying
  );

  useEffect(() => {
    if (stopPlaying && music) {
      music.pause();
      dispatch(SetStopPlaying(false));
    }
  }, [stopPlaying, music, dispatch]);

  const handlePrev = useCallback(() => {
    setDuration(0);
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

  const [online, setOnline] = useState<boolean>();
  useEffect(() => {
    const online = navigator.onLine;
    setOnline(online);
  }, []);
  const saveLastPlayed = useCallback(() => {
    try {
      const divId = localStorage.getItem("$d_id_");

      if (divId && online) {
        localStorage.setItem(divId, JSON.stringify(playlist));
        localStorage.setItem("$cu_idx", String(currentIndex));
        localStorage.setItem("_nv_nav", String(PlaylistOrAlbum));
      }
    } catch (error) {
      console.log("local storage error: " + error);
      const divId = localStorage.getItem("$d_id_");
      if (divId) {
        localStorage.removeItem(divId);
      }
    }
    if (uid) {
      try {
        db.createDocument(
          DATABASE_ID,
          LAST_PLAYED,
          uid,
          {
            user: uid,
            playlisturl: playingPlaylistUrl,
            navigator: PlaylistOrAlbum,
            curentsongid: playlist[currentIndex].youtubeId,
            index: currentIndex,
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        ).catch((err) => {
          console.error("db error: " + err);

          db.updateDocument(
            DATABASE_ID,
            LAST_PLAYED,
            uid,
            {
              user: uid,
              playlisturl: playingPlaylistUrl,
              navigator: PlaylistOrAlbum,
              curentsongid: playlist[currentIndex].youtubeId,
              index: currentIndex,
            },
            [
              Permission.update(Role.user(uid)),
              Permission.delete(Role.user(uid)),
            ]
          );
        });
      } catch (error) {
        console.error("db error: " + error);
      }
    }
  }, [
    playlist,
    currentIndex,
    PlaylistOrAlbum,
    uid,
    playingPlaylistUrl,
    online,
  ]);

  const playingInsights = useCallback(() => {
    if (uid && playlist[currentIndex].youtubeId) {
      db.createDocument(
        DATABASE_ID,
        MOST_PLAYED,
        ID.unique(),
        {
          user: uid,
          sname: playlist[currentIndex]?.title || "unknown",
          sid: playlist[currentIndex]?.youtubeId,
          sartist: playlist[currentIndex]?.artists[0]?.name || "unknown",
        },
        [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
      ).catch((err) => console.log(err));
    }
  }, [playlist, currentIndex, uid]);
  const updateSeek = useCallback(async () => {
    if (music) {
      if (Math.floor(music.currentTime) === 30) {
        playingInsights();
      }
      // await db.updateDocument(DATABASE_ID, LAST_PLAYED, uid, {
      //   seek: music.currentTime,
      // });
    }
  }, [music, playingInsights]);

  useEffect(() => {
    if (isPlaying) {
      const seek = setInterval(async () => {
        updateSeek();
      }, 1000);
      return () => clearInterval(seek);
    }
  }, [updateSeek, isPlaying]);
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleNew() {
      socket.emit("message", { id: uid, ...playlist[currentIndex] });
      socket.emit("duration", { id: uid, duration: duration });
      socket.emit("progress", { id: uid, duration: progress });
    }
    socket.on("new", handleNew);

    return () => {
      socket.off("new", handleNew);
      // socket.disconnect();
    };
  }, [playlist, currentIndex, uid, duration, progress]);

  const handleSeekMetadata = useCallback((seek: MediaSessionActionDetails) => {
    const sound = audioRef.current;
    if (sound) {
      if (sound.currentTime !== seek.seekTime) {
        sound.currentTime = seek.seekTime ?? 0;
        if (sound.paused) {
          sound.play();
        }
      }
    }
  }, []);
  const updateMetadata = useCallback(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playlist[currentIndex]?.title || "unknown",
      artist: playlist[currentIndex]?.artists[0]?.name || "unknown",
      album: "",
      artwork: [
        {
          src:
            playlist[currentIndex]?.thumbnailUrl.replace(
              "w120-h120",
              "w1080-h1080"
            ) || "/cache.jpg",
        },
      ],
    });
  }, [playlist, currentIndex]);

  const handlePlayListener = useCallback(() => {
    const sound = audioRef.current;
    if (sound) {
      socket.emit("message", { id: uid, ...playlist[currentIndex] });
      // updateMetadata();
      if (isLooped) {
        sound.loop = true;
      }
      dispatch(play(true));
      setDuration(sound.duration);
      dispatch(setDurationLyrics(sound.duration));
      if (online) {
        try {
          saveLastPlayed();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [
    currentIndex,
    dispatch,
    isLooped,
    online,
    playlist,
    saveLastPlayed,
    uid,
    // updateMetadata
  ]);

  const handleTimeUpdate = useCallback(() => {
    const sound = audioRef.current;
    if (sound) {
      const time = sound.currentTime;
      setProgress(time);
      socket.emit("progress", { id: uid, progress: time });
      dispatch(setProgressLyrics(time));
    }
  }, [dispatch, uid]);

  const handleLoad = useCallback(() => {
    const sound = audioRef.current;
    if (sound) {
      sound.play();
      if (playlist[currentIndex + 1]) {
        const preload = new Audio();
        preload.src = playlist[currentIndex + 1]
          ? `${
              online &&
              !playlist[currentIndex + 1]?.youtubeId.startsWith("http")
                ? streamApi
                : ""
            }${playlist[currentIndex + 1]?.youtubeId}`
          : "";
        preload.load();
      }
      dispatch(setIsLoading(false));
      updateMetadata();
      setDuration(sound.duration);
      socket.emit("duration", { id: uid, duration: sound.duration });
      setProgress(sound.currentTime);
      dispatch(setDurationLyrics(sound.duration));
      refetch();
      navigator.mediaSession.setActionHandler("play", () => sound.play());
      navigator.mediaSession.setActionHandler("pause", () => sound.pause());
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
      navigator.mediaSession.setActionHandler("seekto", handleSeekMetadata);
      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      };
    }
  }, [
    currentIndex,
    dispatch,
    online,
    playlist,
    uid,
    refetch,
    updateMetadata,
    handleNext,
    handlePrev,
    handleSeekMetadata,
  ]);

  useEffect(() => {
    try {
      if (audioRef.current) {
        const sound: HTMLAudioElement = audioRef.current;
        if (!music) {
          setPlayer(sound);
        }
        sound.src = `${
          online && !playlist[currentIndex]?.youtubeId.startsWith("http")
            ? streamApi
            : ""
        }${playlist[currentIndex]?.youtubeId}`;

        const handlePause = () => {
          dispatch(play(false));
        };

        const handleError = () => {
          setDuration(0);
          setProgress(0);
          if (document.visibilityState === "hidden") {
            handleNext();
          } else {
            dispatch(play(false));
            dispatch(setIsLoading(false));
            sound.pause();
          }
        };

        const loading = () => {
          dispatch(setIsLoading(true));
        };
        const startPlay = () => {
          sound.play();
        };

        sound.addEventListener("loadstart", loading);
        sound.addEventListener("canplay", startPlay);
        sound.addEventListener("canplaythrough", startPlay);
        sound.addEventListener("play", handlePlayListener);
        sound.addEventListener("pause", handlePause);
        sound.addEventListener("loadedmetadata", handleLoad);
        sound.addEventListener("error", handleError);
        sound.addEventListener("timeupdate", handleTimeUpdate);
        sound.addEventListener("ended", handleNext);

        return () => {
          sound.removeEventListener("loadstart", loading);
          sound.removeEventListener("canplaythrough", startPlay);
          sound.removeEventListener("play", handlePlayListener);
          sound.removeEventListener("canplay", startPlay);
          sound.removeEventListener("pause", handlePause);
          sound.removeEventListener("loadedmetadata", handleLoad);
          sound.removeEventListener("timeupdate", handleTimeUpdate);
          sound.removeEventListener("error", handleError);
          sound.removeEventListener("ended", handleNext);
        };
      }
    } catch (error) {
      console.log("audio player error " + error);
    }
  }, [
    currentIndex,
    dispatch,
    handleLoad,
    handleNext,
    handlePlayListener,
    handleTimeUpdate,
    online,
    playlist,
    music,
  ]);

  useEffect(() => {
    if (music) {
      setPlay(music);
    }
  }, [setPlay, music]);
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

  const { formatDuration } = useFormatDuration();

  const c = useImage(
    playlist[currentIndex]?.thumbnailUrl.replace("w120-h120", "w1080-h1080")
  );
  const location = useLocation();

  useEffect(() => {
    if (
      currentIndex == playlist.length - 2 ||
      (currentIndex == playlist.length - 1 && online)
    ) {
      axios
        .get(`${SuggestionSearchApi}${playlist[playlist.length - 1].youtubeId}`)
        .then((res) => {
          if (res.data.length > 0) {
            dispatch(
              setPlaylist([...playlist, ...res.data.slice(1, res.data.length)])
            );
          }
        });
    }
  }, [playlist, dispatch, currentIndex, online]);
  const { currentPlaylist } = useCurrentPlaylist({ id: playingPlaylistUrl });
  return (
    <>
      <audio src="" ref={audioRef} hidden preload="true"></audio>

      {isStandalone ? (
        <p
          className={`w-[68dvw] ${
            location.pathname == "/share-play" ? "hidden" : ""
          }  px-4`}
        >
          install app to use player
        </p>
      ) : (
        <Drawer>
          <DrawerTrigger>
            {location.pathname == "/share-play" ? (
              <></>
            ) : (
              <div className="items-center leading-tight  flex space-x-1.5 w-[74dvw]   px-2.5">
                <div className=" h-11 w-11 overflow-hidden rounded-lg">
                  <img
                    height="100%"
                    width="100%"
                    src={c ? c : "/cache.jpg"}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                      (e.currentTarget.src = "/cache.jpg")
                    }
                    alt="Image"
                    className="object-cover  transition-all duration-300 w-[100%] h-[100%] "
                  />
                </div>
                <div className="flex flex-col text-start">
                  <p className=" text-sm truncate font-medium animate-fade-up w-[54vw] ">
                    {playlist[currentIndex]?.title}
                  </p>
                  <p className=" text-xs w-[30vw] text-zinc-400 animate-fade-up truncate">
                    {playlist[currentIndex].artists[0]?.name || "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </DrawerTrigger>

          <DrawerContent className=" h-[100dvh]  rounded-none  ">
            <div className="flex relative flex-col justify-start pt-7  h-full">
              <DrawerHeader>
                <div
                  {...swipeHandler}
                  className={`overflow-hidden flex justify-center items-center 
                   
                     rounded-lg mx-1  `}
                >
                  {currentPlaylist && currentPlaylist.length > 0 && (
                    <div className=" absolute text-zinc-400 text-xs font-medium tracking-tight leading-tight top-5">
                      <p className=" max-w-[50dvw] truncate">
                        <Link to={`/library/${playingPlaylistUrl}`}>
                          <DrawerClose>
                            {currentPlaylist[0].creator}
                          </DrawerClose>
                        </Link>
                      </p>
                    </div>
                  )}
                  <div className="flex  justify-center items-center rounded-lg  h-[44dvh]">
                    <img
                      src={c ? c : "/cache.jpg"}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                        (e.currentTarget.src = "/cache.jpg")
                      }
                      alt="Image"
                      className={`object-fit shadow-lg transition-all duration-500 rounded-lg ${
                        music && !music.paused
                          ? "w-[90vw] h-[44dvh]"
                          : "w-[75vw] h-[35dvh]"
                      }`}
                    />
                  </div>
                </div>
                <div className=" absolute bottom-[35.5vh] w-full text-start px-2 ">
                  <div className="flex items-center  w-fit space-x-3">
                    <div
                      className={`text-2xl leading-tight overflow-x-scroll whitespace-nowrap transition-all duration-300  ${
                        online ? "w-[63vw] " : "w-[87vw]"
                      } font-semibold`}
                    >
                      <h1> {playlist[currentIndex]?.title}</h1>
                    </div>
                    {online && (
                      <>
                        <div className=" bg-zinc-900 p-1.5 rounded-full">
                          {liked ? (
                            <AiFillStar
                              onClick={RemoveLike}
                              className="h-6 w-6  "
                            />
                          ) : (
                            <FaRegStar
                              className="h-6 w-6 "
                              onClick={handleLink}
                            />
                          )}
                        </div>
                        <Options
                          id={playingPlaylistUrl}
                          music={playlist[currentIndex]}
                        />
                      </>
                    )}
                  </div>

                  {playlist[currentIndex].artists[0]?.name ? (
                    <Link
                      to={`/artist/${
                        playlist[currentIndex].artists[0]?.id || currentArtistId
                      }`}
                    >
                      <DrawerClose className="text-start">
                        <p className="text-base truncate leading-tight transition-all duration-300 w-[70vw] text-red-500">
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
                {isLoading ? (
                  <Skeleton className="w-full h-2 bg-zinc-300/75 " />
                ) : (
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
                )}
                <div className="flex text-sm justify-between py-2 px-1">
                  <span className="text-zinc-400 transition-all duration-300 font-semibold">
                    {formatDuration(progress || 0)}
                  </span>
                  <span className="text-zinc-400 transition-all duration-300 font-semibold">
                    {formatDuration(duration || 0)?.replace(
                      "Infinity:NaN",
                      "--:--"
                    )}
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

                  <Lyrics music={music && music} closeRef={closeRef} />
                  <DrawerClose
                    ref={closeRef}
                    className="w-0 h-0 p-0 m-0 hidden"
                  ></DrawerClose>
                  {playlist.length > 1 ? (
                    <Link to={`/suggested/`}>
                      <DrawerClose>
                        <IoIosList className="h-6 w-6 text-zinc-300" />
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
