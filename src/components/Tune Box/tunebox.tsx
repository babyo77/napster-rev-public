import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack, IoMdNotificationsOutline } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setPlayingPlaylistUrl,
  setPlaylist,
  shuffle,
} from "@/Store/Player";
import React, { useCallback, useEffect, useState } from "react";
import { RootState } from "@/Store/Store";
import { DATABASE_ID, TUNEBOX, db } from "@/appwrite/appwriteConfig";
import { Permission, Query, Role } from "appwrite";
import { likedSongs, playlistSongs } from "@/Interface";
import Loader from "@/components/Loaders/Loader";
import GoBack from "@/components/Goback";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import { RxShuffle } from "react-icons/rx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useInView } from "react-intersection-observer";
import { FiShare } from "react-icons/fi";
import { GoShare } from "react-icons/go";
import { Account } from "../Settings/Account";
import { getToken } from "firebase/messaging";
import { messaging } from "@/Landing Page/firebase";
function TuneBoxComp() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const [offset, setOffset] = useState<string>();
  const [pDetails, setPDetails] = useState<playlistSongs[]>();

  const getPlaylistDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, TUNEBOX, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || uid || ""]),
      Query.limit(150),
    ]);

    const lastId = r.documents[r.documents.length - 1].$id;

    setOffset(lastId);

    const modified = r.documents.map((doc) => ({
      $id: doc.$id,
      for: doc.for,
      youtubeId: doc.youtubeId,
      artists: [
        {
          id: doc.artists[0],
          name: doc.artists[1],
        },
      ],
      title: doc.title,
      thumbnailUrl: doc.thumbnailUrl,
    }));
    setPDetails(modified);
    return modified as unknown as likedSongs[];
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );

  const {
    isLoading: pLoading,
    isError: pError,
    refetch: pRefetch,
  } = useQuery<likedSongs[]>(["tuneboxSongsDetails", id], getPlaylistDetails, {
    retry: 0,
    staleTime: 1000,
    refetchOnWindowFocus: false,
  });
  const [notification, setNotification] = useState<boolean>(true);
  const getKey = useCallback(async () => {
    if (uid && messaging) {
      const token = await getToken(messaging, {
        vapidKey:
          "BKClLMyaVIbmLst3qE2nUH8P295K_8ZinQ7uM4ap7F-ZyvkG8_eaXi7BTNQDrc39UzXcLGtXd-Ved6cNpWNXiyk",
      });
      const res = await db.listDocuments(DATABASE_ID, "65da232e478bcf5bbbad", [
        Query.equal("for", uid),
        Query.limit(1),
      ]);
      if (
        res.documents.length > 0 &&
        !res.documents[0].notify.includes(token)
      ) {
        const tkn = [...res.documents[0].notify, token].filter((r) => r !== "");

        await db.updateDocument(
          DATABASE_ID,
          "65da232e478bcf5bbbad",
          res.documents[0].$id,
          {
            notify: tkn,
          }
        );
        setNotification(true);
      } else {
        await db.createDocument(
          DATABASE_ID,
          "65da232e478bcf5bbbad",
          uid,
          {
            for: uid,

            notify: [token],
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        );
        setNotification(true);
      }
    }
  }, [uid]);

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setNotification(true);
        getKey();
      } else {
        alert("Enable from you settings");
        setNotification(false);
      }
    } else {
      alert("Not supported! Please install NGLdrx. from account settings");
      setNotification(false);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        getKey();
      } else {
        setNotification(false);
      }
    }
  }, [getKey]);

  const handleShufflePlay = useCallback(async () => {
    if (pDetails) {
      dispatch(shuffle(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("tunebox"));
      if (pDetails.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, pDetails, isPlaying, id]);
  const handlePlay = useCallback(() => {
    if (pDetails) {
      dispatch(setPlaylist(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("tunebox"));
      if (pDetails.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, isPlaying, id, pDetails]);

  useEffect(() => {
    if (inView && uid) {
      if (id && pDetails && offset) {
        db.listDocuments(DATABASE_ID, TUNEBOX, [
          Query.orderDesc("$createdAt"),
          Query.equal("for", [id || uid]),
          Query.cursorAfter(offset),
        ]).then((r) => {
          const lastId = r.documents[r.documents.length - 1].$id;

          setOffset(lastId);

          const modified = r.documents.map((doc) => ({
            $id: doc.$id,
            for: doc.for,
            youtubeId: doc.youtubeId,
            artists: [
              {
                id: doc.artists[0],
                name: doc.artists[1],
              },
            ],
            title: doc.title,
            thumbnailUrl: doc.thumbnailUrl,
          }));
          setPDetails((prev) => prev && [...prev, ...modified]);
          return modified as unknown as likedSongs[];
        });
      }
    }
  }, [inView, id, pDetails, offset, uid]);

  const handleShare = () => {
    navigator.share({
      url: `${window.location.origin}/box/${uid}`,
    });
  };
  const isAccount = useSelector((state: RootState) => state.musicReducer.user);
  return (
    <div className=" flex flex-col items-center">
      {pError && pError && (
        <div className=" relative  w-full">
          <div className="fixed h-[90dvh] w-full px-4 flex justify-center flex-col items-center space-y-2.5">
            <div className="h-[60vw] w-[60vw]">
              <LazyLoadImage
                effect="blur"
                width="100%"
                height="100%"
                src="/tunebox.jpg"
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down rounded-xl h-[100%] w-[100%]"
              />
            </div>
            <p className=" text-zinc-300 text-center animate-fade-up  text-lg">
              Tunebox is a place for people to send you song recommendations.
              Click on Share To add songs to your Tunebox, This playlist will
              automatically be updated with any songs people add to your
              tunebox.
            </p>
            {isAccount ? (
              <Button
                onClick={handleShare}
                variant={"secondary"}
                className=" rounded-xl border bg-neutral-900 animate-fade-up text-xl space-x-1 py-6 font-normal p-6"
              >
                <FiShare />

                <p>Share</p>
              </Button>
            ) : (
              <Account tunebox className=" justify-center" />
            )}
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="animate-fade-right  my-5 mx-4  backdrop-blur-md  bg-black/30 rounded-full p-1  h-8 w-8 text-white " />
          </NavLink>
        </div>
      )}
      {pLoading && pLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}

      {pDetails && pDetails.length > 0 && !pError && (
        <>
          <div className="flex w-screen h-[25rem] justify-center pt-[6vh] relative ">
            <GoBack />
            <div className="absolute top-4 z-10 right-3 flex-col space-y-0.5">
              <div className="">
                <GoShare
                  onClick={handleShare}
                  className="h-8 w-8 animate-fade-left backdrop-blur-md text-white bg-black/30 rounded-full p-1.5"
                />
              </div>
              {!notification && messaging && (
                <div className="">
                  <IoMdNotificationsOutline
                    onClick={enableNotifications}
                    className="h-8 w-8 animate-fade-left backdrop-blur-md text-white bg-black/30 rounded-full p-1.5"
                  />
                </div>
              )}
            </div>
            <div className="h-56 w-56">
              <LazyLoadImage
                effect="blur"
                width="100%"
                height="100%"
                src="/tunebox.jpg"
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down rounded-xl h-[100%] w-[100%]"
              />
            </div>
            <div className=" absolute bottom-[1.5vh] px-4 left-0  right-0">
              <h1 className="text-center animate-fade-down   font-semibold py-[1vh] text-2xl capitalize">
                Tune Box
              </h1>
              <div className="flex space-x-4 py-1 px-2 justify-center  items-center w-full">
                <Button
                  onClick={handlePlay}
                  type="button"
                  variant={"secondary"}
                  className="text-lg py-6  animate-fade-down  shadow-none border bg-neutral-900 rounded-lg px-[13dvw]"
                >
                  <FaPlay className="mr-2" />
                  Play
                </Button>
                <Button
                  type="button"
                  onClick={handleShufflePlay}
                  variant={"secondary"}
                  className="text-lg py-6 animate-fade-down  shadow-none border bg-neutral-900 rounded-lg px-[12dvw]"
                >
                  <RxShuffle className="mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>
          </div>
          <div className="py-3 -mt-[2vh] pb-[8.5rem]">
            {pDetails.map((data, i) => (
              <div key={data.youtubeId + i} ref={ref}>
                <Songs
                  data={pDetails}
                  p={id || ""}
                  forId={data.for}
                  delId={data.$id}
                  query="tuneboxSongsDetails"
                  artistId={data.artists[0].id}
                  audio={data.youtubeId}
                  key={data.youtubeId + i}
                  id={i}
                  where="tunebox"
                  title={data.title}
                  artist={data.artists[0].name}
                  cover={data.thumbnailUrl}
                  reload={pRefetch}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const TuneBox = React.memo(TuneBoxComp);
export default TuneBox;
