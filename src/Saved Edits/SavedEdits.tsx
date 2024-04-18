import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
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
import { DATABASE_ID, EDITS, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { likedSongs, playlistSongs } from "@/Interface";
import Loader from "@/components/Loaders/Loader";
import GoBack from "@/components/Goback";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import { RxShuffle } from "react-icons/rx";
import { RiFocus3Line } from "react-icons/ri";
import Share from "@/HandleShare/Share";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useInView } from "react-intersection-observer";
function SavedEditsComp() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
  });
  const dispatch = useDispatch();
  const { id } = useParams();

  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );

  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const [offset, setOffset] = useState<string>();
  const [pDetails, setPDetails] = useState<playlistSongs[]>();

  const getPlaylistDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, EDITS, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || localStorage.getItem("uid") || ""]),
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
  } = useQuery<likedSongs[]>(["editSongDetails", id], getPlaylistDetails, {
    retry: 5,
    staleTime: 1000,
    refetchOnWindowFocus: false,
  });
  const handleShufflePlay = useCallback(async () => {
    if (pDetails) {
      dispatch(shuffle(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("edits"));
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
      dispatch(SetPlaylistOrAlbum("edits"));
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

  const handleFocus = useCallback(() => {
    const toFocus = document.getElementById(playlist[currentIndex].youtubeId);
    toFocus?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex, playlist]);

  useEffect(() => {
    if (inView) {
      if (id && pDetails && offset) {
        db.listDocuments(DATABASE_ID, EDITS, [
          Query.orderDesc("$createdAt"),
          Query.equal("for", [id || localStorage.getItem("uid") || ""]),
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
          setPDetails((prev) => prev?.concat(modified));
          return modified as unknown as likedSongs[];
        });
      }
    }
  }, [inView, id, pDetails, offset]);

  return (
    <div className=" flex flex-col items-center">
      {pError && pError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No playlist found
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="h-7 w-7  my-5 mx-4  backdrop-blur-md text-black bg-white/70 rounded-full p-1" />
          </NavLink>
        </div>
      )}
      {pLoading && pLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {pDetails && pDetails.length > 1 ? (
        <>
          <div className="flex w-screen h-[25rem] justify-center pt-[6vh] relative ">
            <GoBack />
            <div className="absolute top-4 z-10 right-3 flex-col space-y-0.5">
              {playingPlaylistUrl == id && (
                <div className="" onClick={handleFocus}>
                  <RiFocus3Line className="h-8 w-8 fade-in mb-2  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
                </div>
              )}
              <Share />
            </div>
            <div className="h-56  w-56">
              <LazyLoadImage
                effect="blur"
                width="100%"
                height="100%"
                src="/edits.jpg"
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down rounded-xl h-[100%] w-[100%]"
              />
            </div>
            <div className=" absolute bottom-[1.5vh] px-4 left-0  right-0">
              <h1 className="text-center animate-fade-down   font-semibold py-[1vh] text-2xl capitalize">
                Tunes
              </h1>
              <div className="flex space-x-4 py-1 px-2 justify-center  items-center w-full">
                <Button
                  onClick={handlePlay}
                  type="button"
                  variant={"secondary"}
                  className="text-lg py-6  animate-fade-down  shadow-none bg-zinc-800 rounded-lg px-[13dvw]"
                >
                  <FaPlay className="mr-2" />
                  Play
                </Button>
                <Button
                  type="button"
                  onClick={handleShufflePlay}
                  variant={"secondary"}
                  className="text-lg py-6 animate-fade-down  shadow-none bg-zinc-800 rounded-lg px-[12dvw]"
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
                  query="editSongsDetails"
                  artistId={data.artists[0].id}
                  audio={data.youtubeId}
                  key={data.youtubeId + i}
                  id={i}
                  where="edits"
                  title={data.title}
                  artist={data.artists[0].name}
                  cover={data.thumbnailUrl}
                  reload={pRefetch}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {pDetails?.length == 1 && (
            <div className="h-screen flex justify-center items-center">
              <GoBack />
              <NavLink
                to={"/share-play"}
                className="underline underline-offset-2"
              >
                No Saved Edits.
              </NavLink>
            </div>
          )}
        </>
      )}
    </div>
  );
}
const SavedEdits = React.memo(SavedEditsComp);
export default SavedEdits;
