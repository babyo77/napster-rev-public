import { FaPlay } from "react-icons/fa6";
import { IoReload } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { AlbumSongs } from "@/Interface";

import { GetAlbumSongs } from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentArtistId,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import React, { useCallback, useEffect, useMemo } from "react";
import { RootState } from "@/Store/Store";
import Loader from "@/components/Loaders/Loader";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import GoBack from "@/components/Goback";

function AlbumPageComp() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const artistId = useMemo(() => new URLSearchParams(location.search), []);

  const playlistUrl = useSelector(
    (state: RootState) => state.musicReducer.playlistUrl
  );
  const getPlaylist = async () => {
    const list = await axios.get(`${GetAlbumSongs}${id}`);
    return list.data as AlbumSongs[];
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<
    AlbumSongs[]
  >(["album", id], getPlaylist, {
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 60 * 600000,
  });

  useEffect(() => {
    dispatch(setIsLikedSong(false));
    dispatch(SetPlaylistOrAlbum("album"));
  }, [dispatch, id, playlistUrl]);
  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${data && data[0].album}`,
        text: `${data && data[0].album}}`,
        url: window.location.origin + `/library/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  }, [id, data]);
  const handlePlay = useCallback(() => {
    if (data) {
      dispatch(setPlaylist(data));
      dispatch(
        setCurrentArtistId(data[0].artists[0].id || artistId.get("id") || "")
      );
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      if (data.length === 1) dispatch(isLoop(true));
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id, artistId]);

  return (
    <div className=" flex flex-col items-center">
      {isError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No album found
          </div>
          <GoBack />
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
      {data && (
        <>
          <div className="flex w-full h-[23rem]  relative ">
            <GoBack />

            <div className=" absolute top-4 z-10 right-3">
              <IoReload
                onClick={() => refetch()}
                className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5"
              />
            </div>

            <img
              width="100%"
              height="100%"
              src={data[0].thumbnailUrl.replace("w120-h120", "w1080-h1080")}
              alt="Image"
              loading="lazy"
              className="object-cover opacity-80 h-[100%] w-[100%]"
            />

            <div className=" absolute bottom-5 px-4 left-0  right-0">
              <h1 className="text-center  font-semibold py-2 text-2xl capitalize">
                {data[0].album}
              </h1>
              <div className="flex space-x-4 py-1 justify-center  items-center w-full">
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
                query="album"
                link={false}
                artistId={data.artists[0]?.id || artistId.get("id") || ""}
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
const AlbumPage = React.memo(AlbumPageComp);

export default AlbumPage;
