import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import ShareLyrics from "./reelShare";
import { LiaDownloadSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DATABASE_ID, EDITS, db } from "@/appwrite/appwriteConfig";
import { ID, Permission, Query, Role } from "appwrite";
import { playlistSongs } from "@/Interface";
import { useQuery } from "react-query";
import { ReelsApi, ReelsInfoApi } from "@/API/api";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SetReels, SetStopPlaying, setReelsIndex } from "@/Store/Player";
import { LuMusic2 } from "react-icons/lu";
import { Skeleton } from "../ui/skeleton";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import musicData from "../../assets/music.json";
import { GoMute, GoUnmute } from "react-icons/go";
import Loader from "../Loaders/Loader";
import { SiGooglegemini } from "react-icons/si";
import socket from "@/socket";
import { FaPlay } from "react-icons/fa";
import useImage from "@/hooks/useImage";
import { useSearchParams } from "react-router-dom";
import { IoShareOutline } from "react-icons/io5";

function SharePlay() {
  const playlist = useSelector((state: RootState) => state.musicReducer.reels);
  const queue = useSelector((state: RootState) => state.musicReducer.playlist);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [dur, setDuration] = useState<number>();
  const [prog, setProgress] = useState<number>();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState<boolean>();

  const dispatch = useDispatch();
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.reelsIndex
  );

  const [search] = useSearchParams();
  const url = search.get("url");
  const getReels = useCallback(async () => {
    const rnDno = Math.floor(Math.random() * queue.length - 1);
    const r = await axios.get(
      `${ReelsApi}${
        queue && queue.length > 0
          ? queue[rnDno]?.title?.replace("/", "") +
              "rnd " +
              queue[rnDno]?.artists[0]?.name.replace("/", "") || ""
          : "rnd"
      }`
    );

    if (url) {
      const re = await axios.get(`${ReelsInfoApi}${url}`);
      if (re.status === 200 && re.data) {
        new Audio(re.data.youtubeId);
        console.log([re.data, ...r.data]);

        dispatch(SetReels([re.data, ...r.data]));
      } else {
        new Audio(r.data[0].youtubeId);
        dispatch(SetReels(r.data));
      }
    } else {
      new Audio(r.data[0].youtubeId);
      dispatch(SetReels(r.data));
    }
    return r.data as playlistSongs[];
  }, [dispatch, queue, url]);

  const { isRefetching } = useQuery<playlistSongs[]>(["reels"], getReels, {
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const loadMoreReels = useCallback(async () => {
    const rnDno = Math.floor(Math.random() * queue.length - 1);
    const r = await axios.get(
      `${ReelsApi}${
        queue && queue.length > 0
          ? queue[rnDno]?.title?.replace("/", "") +
              "rnd " +
              queue[rnDno]?.artists[0]?.name.replace("/", "") || ""
          : "rnd"
      }`
    );
    new Audio(r.data[0].youtubeId);
    dispatch(SetReels([...playlist, ...r.data]));
    return r.data as playlistSongs[];
  }, [dispatch, queue, playlist]);

  const isLikedCheck = async () => {
    const r = await db.listDocuments(DATABASE_ID, EDITS, [
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
      enabled: false,
      staleTime: 0,
    }
  );

  const [liked, SetLiked] = useState<boolean>();
  const currentArtistId = useSelector(
    (state: RootState) => state.musicReducer.currentArtistId
  );

  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const handleLike = useCallback(async () => {
    if (liked) return;
    if (playlist.length == 0) return;
    SetLiked(true);

    if (uid) {
      db.createDocument(
        DATABASE_ID,
        EDITS,
        ID.unique(),
        {
          youtubeId: playlist[currentIndex].youtubeId,
          title: playlist[currentIndex].title,
          artists: [
            playlist[currentIndex].artists[0]?.id ||
              currentArtistId ||
              "unknown",

            playlist[currentIndex]?.artists || "unknown",
          ],
          thumbnailUrl: playlist[currentIndex].thumbnailUrl,
          for: uid,
        },
        [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
      )
        .then(() => {
          refetch();
        })
        .catch(() => {
          // setOnce(false);
          SetLiked(false);
        });
    }
  }, [currentIndex, playlist, currentArtistId, refetch, liked, uid]);

  const RemoveLike = useCallback(async () => {
    if (playlist.length == 0) return;
    SetLiked(false);
    // setOnce(false);
    if (isLiked) {
      try {
        await db.deleteDocument(
          DATABASE_ID,
          EDITS,
          isLiked[0].$id || "default"
        );
      } catch (error) {
        // setOnce(true);
        console.error(error);
        SetLiked(true);
      }
    }
  }, [isLiked, playlist]);

  useEffect(() => {
    if (playlist[currentIndex]?.artists) {
      refetch();
    }
  }, [playlist, currentIndex, refetch]);

  const handleDownload = useCallback(() => {
    if (playlist.length == 0) return;
    const link = document.createElement("a");
    link.style.display = "none";
    link.target = "_blank";
    link.href = `${playlist[currentIndex].youtubeId}&file=${playlist[currentIndex].title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [playlist, currentIndex]);

  const handleMute = useCallback(() => {
    const music = audioRef.current;
    if (music) {
      setMuted(!music.muted);
      music.muted = !music.muted;
    }
  }, []);

  useEffect(() => {
    dispatch(SetStopPlaying(true));
  }, [dispatch]);

  const goNext = useCallback(() => {
    if (playlist && playlist.length > 0 && playlist[currentIndex + 1]) {
      if (currentIndex == playlist.length - 2) {
        loadMoreReels();
      }

      document
        .getElementById(playlist[currentIndex + 1]?.youtubeId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      dispatch(setReelsIndex(currentIndex + 1));
    }
  }, [playlist, currentIndex, dispatch, loadMoreReels]);

  const goPrev = useCallback(() => {
    if (playlist && playlist.length > 0 && playlist[currentIndex - 1]) {
      document
        .getElementById(playlist[currentIndex - 1]?.youtubeId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      dispatch(setReelsIndex(currentIndex - 1));
    }
  }, [playlist, currentIndex, dispatch]);

  useEffect(() => {
    function handleNew() {
      socket.emit("message", { id: uid, ...playlist[currentIndex] });
      socket.emit("duration", { id: uid, duration: dur });
      socket.emit("progress", { id: uid, duration: prog });
    }
    socket.on("new", handleNew);

    return () => {
      socket.off("new", handleNew);
    };
  }, [playlist, currentIndex, uid, dur, prog]);

  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      const sound = audioRef.current;
      setIsLoading(true);

      sound.src = playlist[currentIndex].youtubeId;

      const handlePlay = () => {
        socket.emit("message", { id: uid, ...playlist[currentIndex] });
        animationRef.current?.play();
        refetch();
        setPaused(false);
      };
      const handlePause = () => {
        setPaused(true);
        animationRef.current?.pause();
      };

      const handleSeek = (seek: MediaSessionActionDetails) => {
        if (sound.currentTime !== seek.seekTime) {
          sound.currentTime = seek.seekTime ?? 0;
          if (sound.paused) {
            sound.play();
          }
        }
      };

      const handleError = () => {
        setIsLoading(false);
      };

      const handleLoad = () => {
        sound.play();
        setIsLoading(true);
        animationRef.current?.play();
        navigator.mediaSession.metadata = new MediaMetadata({
          title: playlist[currentIndex].title,
          //@ts-expect-error:additional added for reels
          artist: playlist[currentIndex]?.artists,
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
        navigator.mediaSession.setActionHandler("nexttrack", goNext);
        navigator.mediaSession.setActionHandler("previoustrack", goPrev);
        navigator.mediaSession.setActionHandler("pause", () => sound.pause());
        navigator.mediaSession.setActionHandler("seekto", handleSeek);
        setDuration(sound.duration);
        socket.emit("duration", { id: uid, duration: sound.duration });
      };
      const handleTimeUpdate = () => {
        setProgress(sound.currentTime);
        socket.emit("progress", { id: uid, progress: sound.currentTime });
      };
      sound.addEventListener("play", handlePlay);
      sound.addEventListener("pause", handlePause);
      sound.addEventListener("loadedmetadata", handleLoad);
      sound.addEventListener("timeupdate", handleTimeUpdate);
      sound.addEventListener("ended", goNext);
      sound.addEventListener("error", handleError);

      new Audio(
        playlist[currentIndex + 1] ? playlist[currentIndex + 1].youtubeId : ""
      ).load();

      return () => {
        sound.pause();
        sound.src = "";
        sound.removeEventListener("pause", handlePause);
        sound.removeEventListener("error", handleError);
        sound.removeEventListener("play", handlePlay);
        sound.removeEventListener("loadedmetadata", handleLoad);
        sound.removeEventListener("timeupdate", handleTimeUpdate);
        sound.removeEventListener("ended", goNext);

        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("seekto", null);
      };
    }
  }, [playlist, currentIndex, refetch, goNext, goPrev, uid]);

  const handlePlayPause = useCallback(() => {
    const sound = audioRef.current;
    if (sound && sound.paused) {
      setPaused(false);
      sound.play();
    } else {
      setPaused(true);
      sound?.pause();
    }
  }, []);
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sound = audioRef.current;
    if (sound) {
      sound.currentTime = parseInt(e.target.value);
    }
  }, []);

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      const reel = document.getElementById("reel");

      const handleIntersection: IntersectionObserverCallback = (entries) => {
        entries.forEach(async (entry) => {
          entry.target.classList.remove("opacity-40");
          if (entry.isIntersecting) {
            const data = entry.target.getAttribute("data-index");
            const index = parseInt(data || "0");

            if (currentIndex !== index) {
              if (audioRef.current) {
                animationRef.current?.destroy();
              }
              if (index == playlist.length - 1) {
                loadMoreReels();
              }

              setIsLoading(false);
              setProgress(0);
              // setOnce(false);
              SetLiked(false);
              dispatch(setReelsIndex(index));
            }
            entry.target.classList.remove("opacity-40");
          }
        });
      };
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: 0.4,
      });

      if (reel) {
        const reelDiv = reel.querySelectorAll(".reel-div");
        reelDiv.forEach((div) => {
          observer.observe(div);
        });
      }
      return () => {
        observer.disconnect();
      };
    }
  }, [playlist, currentIndex, dispatch, loadMoreReels]);

  const c = useImage(playlist[currentIndex]?.thumbnailUrl);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        goNext();
      }
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        goPrev();
      }
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  }, [goNext, goPrev]);

  const handleCopy = useCallback(() => {
    navigator.share({
      url: playlist[currentIndex].youtubeId.replace(
        "https://occasional-clara-babyo777.koyeb.app/",
        window.location.origin + "/share-play"
      ),
    });
  }, [playlist, currentIndex]);

  return (
    <div
      id="reel"
      className="relative h-dvh pb-[10dvh]  overflow-x-hidden overflow-y-scroll snap-y snap-mandatory"
    >
      <audio
        src=""
        ref={audioRef}
        hidden
        preload="true"
        loop={document.visibilityState === "visible"}
      ></audio>

      {paused && (
        <div
          onClick={handlePlayPause}
          className=" bg-black/40  animate-fade duration-500 fixed w-full h-dvh pb-[20dvh] z-20"
        >
          <div className="justify-center items-center flex w-full h-full">
            <div>
              <FaPlay className="h-11 w-11" />
            </div>
          </div>
        </div>
      )}
      <div className=" z-10 w-full absolute top-4 left-3">
        <h1 className="text-2xl animate-fade-right font-semibold">Tunes</h1>
      </div>
      {isRefetching && (
        <div className="  animate-fade-down fixed top-11  items-center w-full justify-center">
          <Loader />
        </div>
      )}
      <div className=" hidden z-10 top-4 right-3">
        <SiGooglegemini onClick={() => alert("AI")} className="h-7 w-7" />
      </div>
      {playlist && playlist.length > 0 ? (
        playlist.map((playlist, i) => (
          <div
            key={playlist.youtubeId + i}
            data-index={i}
            id={playlist.youtubeId}
            className="reel-div opacity-40 snap-start h-[90dvh] relative"
          >
            {window.matchMedia("(display-mode:standalone)").matches && (
              <div className=" z-10 w-full absolute bottom-[0rem]">
                <input
                  type="range"
                  value={prog || 0}
                  max={dur || 0}
                  onChange={handleSeek}
                  className="w-full  h-[0.2rem] animate-fade-up bg-zinc-300/75 transition-all duration-300 overflow-hidden rounded-none appearance-none cursor-pointer"
                />
              </div>
            )}

            <div className=" z-10 animate-fade-right  h-10 w-10 rounded-sm justify-between absolute bottom-[1.6rem] space-y-2.5 flex  items-center right-2.5">
              <img
                height="100%"
                width="100%"
                src={
                  c
                    ? playlist?.thumbnailUrl?.replace(
                        "w120-h120",
                        "w1080-h1080"
                      )
                    : "/cache.jpg"
                }
                onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                  (e.currentTarget.src = "/newfavicon.jpg")
                }
                alt="Image"
                className="object-cover rounded-sm  transition-all duration-300 w-[100%] h-[100%] "
              />
            </div>

            <div className=" z-20  justify-between absolute bottom-[1.4rem] space-y-2.5 flex  items-center left-3.5">
              <>
                <div className=" z-10 flex items-center animate-fade-right space-x-1">
                  <div
                    onClick={handleMute}
                    className=" text-xs  bg-zinc-800/80 backdrop-blur-xl px-2.5 font-normal py-2 rounded-full"
                  >
                    <p className="flex items-center  text-start  space-x-1">
                      {muted ? <GoMute /> : <GoUnmute />}
                    </p>
                  </div>
                  <div className=" text-xs  bg-zinc-800/80 backdrop-blur-xl px-2.5 font-normal py-1 rounded-xl">
                    <p className="flex items-center max-w-[60dvw] text-start  space-x-1">
                      <LuMusic2 />
                      <span className="max-w-[60dvw] truncate">
                        {playlist?.title}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            </div>

            {/* {dbClick && (
              <div className=" z-10  pb-[7dvh] absolute w-full h-full flex justify-center items-center text-9xl bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text  ">
                <Lottie animationData={likeData} className="h-80 w-80" />
              </div>
            )} */}

            <div className=" z-10 absolute text-4xl bottom-20 space-y-2.5 flex flex-col items-center right-2">
              <div className=" animate-fade-left">
                {liked ? (
                  <IoMdHeart onClick={RemoveLike} className=" text-red-500" />
                ) : (
                  <IoMdHeartEmpty onClick={handleLike} />
                )}
              </div>
              {!window.matchMedia("(display-mode:standalone)").matches ? (
                <div
                  onClick={handleCopy}
                  className="m-0 p-1.5 flex  justify-center items-center    rounded-full "
                >
                  <IoShareOutline className="h-7 w-7 text-white" />
                </div>
              ) : (
                <div className=" animate-fade-left">
                  <ShareLyrics className="h-7 w-7" />
                </div>
              )}

              <div onClick={handleDownload} className=" animate-fade-left">
                <LiaDownloadSolid />
              </div>
            </div>

            <div className=" absolute animate-fade-right z-10 bottom-[4rem] left-3">
              <div className=" flex space-x-2 items-center">
                <div>
                  <Avatar className=" h-12 w-12">
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarImage
                      src={
                        //@ts-expect-error:additional added
                        playlist?.avatar || "/favicon.jpeg"
                      }
                    />
                  </Avatar>
                </div>

                <div>
                  <h1 className=" flex truncate  text-xl font-semibold">
                    <div className="max-w-[60dvw]  truncate">
                      {(playlist?.artists as unknown as string) || (
                        <Skeleton className="w-28 bg-zinc-800 h-3" />
                      )}
                    </div>
                  </h1>
                  <div>
                    <p className="  text-xs hidden truncate w-[50dvw]">
                      {playlist?.title || "unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-h-full min-h-full absolute w-full h-full px-14 flex justify-center items-center ">
              <div className=" h-56 w-56 flex  flex-col items-center justify-center ">
                <img
                  onClick={handlePlayPause}
                  height="100%"
                  width="100%"
                  src={c ? playlist?.thumbnailUrl : "/cache.jpg"}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                    (e.currentTarget.src = "/newfavicon.jpg")
                  }
                  alt="Image"
                  className={`  object-cover rounded-lg 
                
                    animate-fade-down
                   transition-all duration-300 w-[100%] h-[100%] `}
                />
                {isLoading ? (
                  <Lottie
                    lottieRef={animationRef}
                    className=" animate-fade-down -mt-[1dvh] h-32 w-32"
                    animationData={musicData}
                  />
                ) : (
                  <div className="min-h-24 -mt-[1dvh] min-w-24"></div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className=" fade-in w-full flex flex-col  leading-tight tracking-tight justify-center items-center h-dvh transition-all duration-500 space-y-3 font-semibold text-xl capitalize">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default SharePlay;
