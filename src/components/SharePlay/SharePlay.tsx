import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import ShareLyrics from "./reelShare";
import { LiaDownloadSolid } from "react-icons/lia";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DATABASE_ID, FAV_ARTIST, EDITS, db } from "@/appwrite/appwriteConfig";
import { ID, Query } from "appwrite";
import { ArtistDetails, favArtist, playlistSongs } from "@/Interface";
import { useQuery } from "react-query";
import { GetArtistDetails, ReelsApi } from "@/API/api";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { SetReels, setReelsIndex } from "@/Store/Player";
import { useDoubleTap } from "use-double-tap";
import { Link } from "react-router-dom";
import { LuMusic2 } from "react-icons/lu";
import { Skeleton } from "../ui/skeleton";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import musicData from "../../assets/music.json";
import likeData from "../../assets/like.json";
import { GoMute, GoUnmute } from "react-icons/go";
import Loader from "../Loaders/Loader";

function SharePlay() {
  const playlist = useSelector((state: RootState) => state.musicReducer.reels);
  const queue = useSelector((state: RootState) => state.musicReducer.playlist);
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [dur, setDuration] = useState<number>();
  const [prog, setProgress] = useState<number>();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState<boolean>();
  const music = useSelector((state: RootState) => state.musicReducer.music);

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );

  const dispatch = useDispatch();
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.reelsIndex
  );
  const [isFavArtist, setIsFavArtist] = useState<boolean>();

  const getReels = useCallback(async () => {
    const rnDno = Math.floor(Math.random() * queue.length - 1);
    const r = await axios.get(
      `${ReelsApi}${
        queue[rnDno]?.title.replace("/", "") +
        " " +
        queue[rnDno]?.artists[0]?.name.replace("/", "")
      }`
    );

    dispatch(SetReels(r.data));
    return r.data as playlistSongs[];
  }, [dispatch, queue]);

  const { refetch: loadMoreReels, isRefetching } = useQuery<playlistSongs[]>(
    ["reels"],
    getReels,
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const loadIsFav = async () => {
    const r = await db.listDocuments(DATABASE_ID, FAV_ARTIST, [
      Query.equal("for", [localStorage.getItem("uid") || "default"]),
      Query.equal("artistId", [
        playlist[currentIndex]?.artists[0].id || "none",
      ]),
    ]);
    const p = r.documents as unknown as favArtist[];
    if (p.length == 0) {
      setIsFavArtist(false);
    } else {
      setIsFavArtist(true);
    }
    return p;
  };

  const { data: isFav, refetch: refetchFav } = useQuery<favArtist[]>(
    ["checkFavArtist", playlist[currentIndex]?.artists[0].id],
    loadIsFav,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const removeFromFav = async () => {
    if (isFav) {
      setIsFavArtist(false);

      await db
        .deleteDocument(DATABASE_ID, FAV_ARTIST, isFav[0].$id)
        .catch(() => setIsFavArtist(false));
      refetchFav();
    }
  };

  const getArtistDetails = async () => {
    const list = await axios.get(
      `${GetArtistDetails}${playlist[currentIndex]?.artists[0].id}`
    );
    return list.data as ArtistDetails;
  };

  const { data, refetch: followRefetch } = useQuery<ArtistDetails>(
    ["artist", playlist[currentIndex]?.artists[0].id],
    getArtistDetails,
    {
      retry: 5,
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
      onSuccess(d) {
        d == null && followRefetch();
      },
    }
  );

  const addToFav = async () => {
    if (!playlist[currentIndex].artists[0].id) return;
    setIsFavArtist(true);
    await db
      .createDocument(DATABASE_ID, FAV_ARTIST, ID.unique(), {
        artistId: playlist[currentIndex]?.artists[0].id,
        name: data?.name,
        thumbnailUrl: data?.thumbnails[0].url.replace(
          "w540-h225",
          "w1080-h1080"
        ),
        for: localStorage.getItem("uid"),
      })
      .catch(() => setIsFavArtist(true));
    refetchFav();
  };

  const isLikedCheck = async () => {
    const r = await db.listDocuments(DATABASE_ID, EDITS, [
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
  const [once, setOnce] = useState<boolean>();
  const handleLike = useCallback(() => {
    if (liked) return;
    if (playlist.length == 0) return;
    SetLiked(true);
    setOnce(true);
    db.createDocument(DATABASE_ID, EDITS, ID.unique(), {
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
        setOnce(false);
        SetLiked(false);
      });
  }, [currentIndex, playlist, currentArtistId, refetch, liked]);

  const RemoveLike = useCallback(async () => {
    if (playlist.length == 0) return;
    SetLiked(false);
    setOnce(false);
    if (isLiked) {
      try {
        await db.deleteDocument(
          DATABASE_ID,
          EDITS,
          isLiked[0].$id || "default"
        );
      } catch (error) {
        setOnce(true);
        console.error(error);
        SetLiked(true);
      }
    }
  }, [isLiked, playlist]);

  useEffect(() => {
    if (playlist[currentIndex]?.artists[0].id) {
      followRefetch();
      refetch();
    }
  }, [playlist, currentIndex, followRefetch, refetch]);

  const image = async () => {
    const response = await axios.get(
      playlist[currentIndex]?.thumbnailUrl.replace("w120-h120", "w1080-h1080"),
      {
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return URL.createObjectURL(blob);
  };

  const { data: c } = useQuery(
    ["image", playlist[currentIndex]?.thumbnailUrl],
    image,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (playlist.length == 0) {
      loadMoreReels();
    }
  }, [playlist, loadMoreReels]);

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

  const handleNext = useCallback(async () => {
    setIsLoading(true);
    animationRef.current?.destroy();
    setProgress(0);
    currentIndex == playlist.length - 1 && (await loadMoreReels());
    setOnce(false);
    setNext(true);
    const t = setTimeout(() => {
      setNext(false);
    }, 200);
    SetLiked(false);
    if (playlist.length > 1) {
      dispatch(setReelsIndex((currentIndex + 1) % playlist.length));
    }
    return () => clearTimeout(t);
  }, [dispatch, playlist.length, currentIndex, loadMoreReels]);

  const handlePrev = useCallback(async () => {
    setIsLoading(true);
    if (currentIndex === 0) {
      await loadMoreReels();
      return;
    }
    setProgress(0);
    setOnce(false);
    setPrev(true);
    const t = setTimeout(() => {
      setPrev(false);
    }, 200);
    if (playlist.length > 1) {
      dispatch(
        setReelsIndex((currentIndex - 1 + playlist.length) % playlist.length)
      );
    }
    return () => clearTimeout(t);
  }, [dispatch, playlist.length, currentIndex, loadMoreReels]);

  const swipeHandler = useSwipeable({
    onSwipedUp: handleNext,
    onSwipedDown: handlePrev,
  });

  const [dbClick, setDb] = useState<boolean>();

  const handleDbClick = useCallback(() => {
    setDb(true);
    if (!once) {
      if (playlist.length > 0) {
        handleLike();
      }
    }
    const t = setTimeout(() => {
      setDb(false);
    }, 1290);
    return () => clearTimeout(t);
  }, [handleLike, once, playlist]);

  const bind = useDoubleTap(handleDbClick);

  const handleMute = useCallback(() => {
    const music = audioRef.current;
    if (music) {
      setMuted(!music.muted);
      music.muted = !music.muted;
    }
  }, []);

  useEffect(() => {
    if (isPlaying && music) {
      music.pause();
    }
  }, [isPlaying, music]);

  useEffect(() => {
    if (playlist.length > 0) {
      const sound = audioRef.current;
      setIsLoading(true);
      if (sound) {
        sound.src = playlist[currentIndex].youtubeId;

        const handlePlay = () => {
          refetch();
          refetchFav();
          setIsLoading(false);
          animationRef.current?.play();
        };
        const handlePause = () => {
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

        const handleLoad = () => {
          setIsLoading(false);
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
          setDuration(sound.duration);
          animationRef.current?.play();
        };
        const handleTimeUpdate = () => {
          animationRef.current?.play();
          setProgress(sound.currentTime);
        };
        sound.addEventListener("play", handlePlay);
        sound.addEventListener("ended", handleNext);
        sound.addEventListener("pause", handlePause);
        sound.addEventListener("loadedmetadata", handleLoad);
        sound.addEventListener("timeupdate", handleTimeUpdate);
        sound.play();

        return () => {
          sound.load();
          sound.pause();
          sound.removeEventListener("ended", handleNext);
          sound.removeEventListener("pause", handlePause);
          sound.removeEventListener("play", handlePlay);
          sound.removeEventListener("loadedmetadata", handleLoad);
          sound.removeEventListener("timeupdate", handleTimeUpdate);

          navigator.mediaSession.setActionHandler("play", null);
          navigator.mediaSession.setActionHandler("pause", null);
          navigator.mediaSession.setActionHandler("nexttrack", null);
          navigator.mediaSession.setActionHandler("previoustrack", null);
          navigator.mediaSession.setActionHandler("seekto", null);
        };
      }
    }
  }, [playlist, currentIndex, handleNext, handlePrev, refetch, refetchFav]);

  const handlePlayPause = useCallback(() => {
    const sound = audioRef.current;
    if (sound && sound.paused) {
      sound.play();
    } else {
      sound?.pause();
    }
  }, []);
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sound = audioRef.current;
    if (sound) {
      sound.currentTime = parseInt(e.target.value);
    }
  }, []);
  return (
    <div className=" fixed w-full h-[90dvh] z-10 ">
      <audio src="" ref={audioRef} hidden preload="true" autoPlay></audio>
      <div className="h-[90dvh] pb-[19dvh] relative">
        <div className=" z-10 w-full absolute top-4 left-3">
          <h1 className="text-2xl animate-fade-right font-semibold">Tunes</h1>
        </div>
        <div className=" z-10 w-full absolute bottom-[0rem]">
          <input
            type="range"
            value={prog || 0}
            max={dur || 0}
            onChange={handleSeek}
            className="w-full  h-[0.2rem] animate-fade-up bg-zinc-300/75 transition-all duration-300 overflow-hidden rounded-none appearance-none cursor-pointer"
          />
        </div>
        {isRefetching && (
          <div className=" animate-fade-down absolute top-14 flex items-center w-full justify-center">
            <Loader />
          </div>
        )}
        <div className=" z-10 animate-fade-right  h-10 w-10 rounded-md justify-between absolute bottom-[1.6rem] space-y-2.5 flex  items-center right-2.5">
          {isLoading ? (
            <div className=" ml-2">
              <Loader />
            </div>
          ) : (
            <LazyLoadImage
              height="100%"
              width="100%"
              src={
                c ||
                playlist[currentIndex]?.thumbnailUrl.replace(
                  "w120-h120",
                  "w1080-h1080"
                )
              }
              onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                (e.currentTarget.src = "/newfavicon.jpg")
              }
              alt="Image"
              effect="blur"
              className="object-cover rounded-md  transition-all duration-300 w-[100%] h-[100%] "
            />
          )}
        </div>

        <div className=" z-20  justify-between absolute bottom-[1.4rem] space-y-2.5 flex  items-center left-3.5">
          {playlist.length == 0 ? (
            <Skeleton className="w-28 bg-zinc-800 h-3 mb-2 ml-0.5" />
          ) : (
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
                      {playlist[currentIndex]?.title}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {dbClick && (
          <div className=" z-10  pb-[7dvh] absolute w-full h-full flex justify-center items-center text-9xl bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text  ">
            <Lottie animationData={likeData} className="h-80 w-80" />
          </div>
        )}

        <div className=" z-10 absolute text-4xl bottom-20 space-y-2.5 flex flex-col items-center right-2">
          <div className=" animate-fade-left">
            {liked ? (
              <IoMdHeart onClick={RemoveLike} className=" text-red-500" />
            ) : (
              <IoMdHeartEmpty onClick={handleLike} />
            )}
          </div>

          <div className=" animate-fade-left">
            <ShareLyrics className="h-7 w-7" />
          </div>
          <div onClick={handleDownload} className=" animate-fade-left">
            <LiaDownloadSolid />
          </div>
        </div>

        <div className=" absolute animate-fade-right z-10 bottom-[4rem] left-3">
          <div className=" flex space-x-2 items-center">
            {playlist.length == 0 ? (
              <Skeleton className="w-11 rounded-full bg-zinc-800 h-11" />
            ) : (
              <Link to={`/artist/${data?.artistId}`}>
                <Avatar className=" h-12 w-12">
                  <AvatarFallback>CN</AvatarFallback>
                  <AvatarImage
                    src={
                      (data &&
                        data.thumbnails[0]?.url.replace(
                          "w540-h225",
                          "w1080-h1080"
                        )) ||
                      "/favicon.jpeg"
                    }
                  />
                </Avatar>
              </Link>
            )}
            <div>
              <h1 className=" flex truncate  text-xl font-semibold">
                <Link
                  to={`/artist/${data?.artistId}`}
                  className="max-w-[40dvw] truncate"
                >
                  {playlist[currentIndex]?.artists[0]?.name || (
                    <Skeleton className="w-28 bg-zinc-800 h-3" />
                  )}
                </Link>
                {playlist[currentIndex]?.artists[0]?.id && (
                  <div className="ml-1.5 mb-0.5 flex items-center">
                    {isFavArtist ? (
                      <p
                        onClick={removeFromFav}
                        className=" border px-2 py-0.5 bg-white text-black rounded-lg text-sm   "
                      >
                        Following
                      </p>
                    ) : (
                      <p
                        onClick={addToFav}
                        className=" border px-2 py-0.5 rounded-lg text-sm   "
                      >
                        Follow
                      </p>
                    )}
                  </div>
                )}
              </h1>
              <Link to={`/artist/${data?.artistId}`}>
                {playlist[currentIndex]?.title ? (
                  <p className="  text-xs hidden truncate w-[50dvw]">
                    {playlist[currentIndex]?.title || "unknown"}
                  </p>
                ) : (
                  <Skeleton className="w-24 mt-1 bg-zinc-800 h-3" />
                )}
              </Link>
            </div>
          </div>
        </div>

        <div
          {...bind}
          {...swipeHandler}
          className="max-h-full min-h-full pb-[7dvh] pt-[10dvh] absolute w-full h-full px-14 flex justify-center items-center "
        >
          <div className=" h-56 w-56 flex  flex-col items-center justify-center ">
            <LazyLoadImage
              onClick={handlePlayPause}
              height="100%"
              width="100%"
              src={c || playlist[currentIndex]?.thumbnailUrl}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                (e.currentTarget.src = "/newfavicon.jpg")
              }
              alt="Image"
              effect="blur"
              className={`  object-cover rounded-xl ${
                next && "animate-fade-up"
              }  ${
                prev && "animate-fade-down"
              }  transition-all duration-300 w-[100%] h-[100%] `}
            />
            {playlist.length > 0 && prog && prog > 0 ? (
              <Lottie
                autoplay={false}
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
    </div>
  );
}

export default SharePlay;
