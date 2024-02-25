import Songs from "./Songs";
import { Button } from "../ui/button";
import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { SearchPlaylist, playlistSongs } from "@/Interface";
import Loader from "../Loaders/Loader";
import { GetPlaylistSongsApi, SearchPlaylistApi } from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
  setPlaylistUrl,
} from "@/Store/Player";
import React, { useCallback, useEffect } from "react";
import { RootState } from "@/Store/Store";
import AddLibrary from "./AddLibrary";
import GoBack from "../Goback";
function LibraryComp() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const playlistUrl = useSelector(
    (state: RootState) => state.musicReducer.playlistUrl
  );
  const getPlaylist = async () => {
    const list = await axios.get(`${GetPlaylistSongsApi}${id}`);
    return list.data as playlistSongs[];
  };
  const getPlaylistDetails = async () => {
    const list = await axios.get(`${SearchPlaylistApi}${id}`);
    return list.data as SearchPlaylist[];
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<
    playlistSongs[]
  >(["playlist", id], getPlaylist, {
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60 * 60000,
  });

  const {
    data: pDetails,
    isLoading: pLoading,
    isError: pError,
    refetch: pRefetch,
    isRefetching: pIsRefetching,
  } = useQuery<SearchPlaylist[]>(["playlistDetails", id], getPlaylistDetails, {
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60 * 60000,
  });

  useEffect(() => {
    dispatch(setIsLikedSong(false));
    if (id && id !== playlistUrl) {
      dispatch(setPlaylistUrl(id));
    }
    dispatch(SetPlaylistOrAlbum("library"));
  }, [dispatch, id, playlistUrl]);
  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${pDetails && pDetails[0].title}`,
        text: `${pDetails && pDetails[0].title}}`,
        url: window.location.origin + `/library/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  }, [id, pDetails]);
  const handlePlay = useCallback(() => {
    if (data) {
      dispatch(setPlaylist(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
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

  return (
    <div className=" flex flex-col items-center">
      {isError && pError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No playlist found
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="h-7 w-7  my-5 mx-4  backdrop-blur-md text-black bg-white/70 rounded-full p-1" />
          </NavLink>
        </div>
      )}
      {isRefetching && pIsRefetching && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {isLoading && pLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {data && (
        <>
          <div className="flex w-full h-[23rem]   relative ">
            <GoBack />

            <div className=" absolute top-4 z-10 right-3">
              <IoReload
                onClick={() => (refetch(), pRefetch())}
                className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5"
              />
            </div>
            <div className=" absolute top-[3.6rem] z-10 right-3">
              <AddLibrary clone={true} id={id} />
            </div>

            <img
              width="100%"
              height="100%"
              src={
                (pDetails &&
                  pDetails[0]?.thumbnailUrl.replace(
                    "w120-h120",
                    "w1080-h1080"
                  )) ||
                data[0]?.thumbnailUrl.replace("w120-h120", "w1080-h1080")
              }
              alt="Image"
              loading="lazy"
              className="object-cover opacity-80 h-[100%] w-[100%]"
            />

            <div className=" absolute bottom-5 px-4 left-0  right-0">
              <h1 className="text-center  font-semibold py-2 text-2xl capitalize">
                {(pDetails && pDetails[0]?.title) || "Unknown"}
              </h1>
              <div className="flex space-x-4 py-1 px-2 justify-center  items-center w-full">
                <Button
                  onClick={handlePlay}
                  type="button"
                  variant={"ghost"}
                  className="text-base py-5 text-zinc-100 shadow-none bg-white/20 backdrop-blur-md rounded-lg px-14"
                >
                  <FaPlay className="mr-2" />
                  Play
                </Button>
                <Button
                  type="button"
                  onClick={handleShare}
                  variant={"ghost"}
                  className="text-base py-5 text-zinc-100 shadow-none bg-white/20 backdrop-blur-md rounded-lg px-14"
                >
                  <FaShare className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          <div className="py-3 pb-[9.5rem]">
            {data.map((data, i) => (
              <Songs
                p={id || ""}
                artistId={data.artists[0]?.id}
                audio={data.youtubeId}
                key={data.youtubeId + i}
                id={i}
                title={data.title}
                artist={data.artists[0]?.name}
                cover={data.thumbnailUrl}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const Library = React.memo(LibraryComp);
export default Library;
