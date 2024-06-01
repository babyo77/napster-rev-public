import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { playlistSongs } from "@/Interface";
import { RxShuffle } from "react-icons/rx";
import { SearchApi, SuggestionSearchApi } from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
  shuffle,
} from "@/Store/Player";
import React, { useCallback, useEffect, useState } from "react";
import { RootState } from "@/Store/Store";
import { useInView } from "react-intersection-observer";
import { ADD_TO_LIBRARY, DATABASE_ID, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import Share from "@/HandleShare/Share";
import Loader from "@/components/Loaders/Loader";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import GoBack from "@/components/Goback";
import Rating from "@/components/Library/rating";

function TrackComp() {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const dispatch = useDispatch();
  const { id } = useParams();

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const [offset, setOffset] = useState<string>();

  const [data, setData] = useState<playlistSongs[]>();
  const getPlaylist = async () => {
    const list = await axios.get(`${SuggestionSearchApi}${id}`);
    if (list.data.length == 0) {
      const search = await axios.get(`${SearchApi}${id}`);
      return search.data;
    }
    setData(list.data);
    return list.data as playlistSongs[];
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const { isLoading, isError, refetch, isRefetching } = useQuery<
    playlistSongs[]
  >(["playlist", id], getPlaylist, {
    staleTime: Infinity,
    keepPreviousData: true,
  });

  useEffect(() => {
    dispatch(setIsLikedSong(false));
  }, [dispatch, refetch, id]);
  const handleShufflePlay = useCallback(async () => {
    if (data) {
      dispatch(shuffle(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));
      if (data.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id]);
  const handlePlay = useCallback(() => {
    if (data) {
      dispatch(setPlaylist(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));
      if (data.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id]);

  useEffect(() => {
    if (inView) {
      if (id && id.startsWith("custom") && offset && data) {
        db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
          Query.orderDesc("$createdAt"),
          Query.equal("playlistId", [id.replace("custom", "")]),
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

          setData((prev) => prev?.concat(modified));
        });
      }
    }
  }, [inView, id, uid, data, offset]);

  return (
    <div className=" flex flex-col items-center">
      {isError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No playlist found
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="h-7 w-7  my-5 mx-4  backdrop-blur-md text-black bg-white/70 rounded-full p-1" />
          </NavLink>
        </div>
      )}
      {isRefetching && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {!data && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {data && (
        <>
          <div className="flex w-screen h-[25rem] pt-[6vh] justify-center  relative ">
            <GoBack />

            <div className="absolute top-4 z-10 right-3  flex-col space-y-0.5">
              <Share />
              <div>
                <Rating />
              </div>
            </div>
            <div className="h-56  w-56">
              <img
                width="100%"
                height="100%"
                src={data[0]?.thumbnailUrl || "newfavicon.jpg"}
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down -xl h-[100%] w-[100%]"
              />
            </div>
            <div className=" absolute bottom-[1.5vh]  px-4 left-0  right-0">
              <h1 className="text-center animate-fade-down  font-semibold py-[1vh] truncate text-2xl capitalize">
                {data[0]?.title || "unknown"}
              </h1>
              <div className="flex space-x-4 py-1 px-2 justify-center  items-center w-full">
                <Button
                  onClick={handlePlay}
                  type="button"
                  variant={"secondary"}
                  className="text-lg py-6 animate-fade-down text-red-500 shadow-none bg-neutral-900 rounded-md px-[13dvw]"
                >
                  <FaPlay className="mr-2" />
                  Play
                </Button>
                <Button
                  type="button"
                  onClick={handleShufflePlay}
                  variant={"secondary"}
                  className="text-lg py-6  animate-fade-down  text-red-500 shadow-none bg-neutral-900 rounded-md px-[12dvw]"
                >
                  <RxShuffle className="mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>
          </div>
          <div className="py-3 -mt-[2vh] pb-[9.4rem]">
            {data.map((d, i) => (
              <div key={d.youtubeId + i} ref={ref}>
                <Songs
                  data={data}
                  reload={refetch}
                  p={id || ""}
                  forId={d.for}
                  where={"library"}
                  artistId={d.artists[0]?.id}
                  audio={d.youtubeId}
                  key={d.youtubeId + i}
                  id={i}
                  query={(id?.startsWith("custom") && "custom") || ""}
                  delId={d.$id}
                  title={d.title}
                  artist={d.artists[0]?.name}
                  cover={d.thumbnailUrl}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const Track = React.memo(TrackComp);
export default Track;
