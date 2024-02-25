import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { FaShare } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  isLoop,
  play,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import React, { useCallback } from "react";
import { RootState } from "@/Store/Store";
import { DATABASE_ID, LIKE_SONG, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { likedSongs } from "@/Interface";
import Loader from "@/components/Loaders/Loader";
import GoBack from "@/components/Goback";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";

function LikedSongComp() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const getPlaylistDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, LIKE_SONG, [
      Query.equal("for", [id || localStorage.getItem("uid") || "default"]),
    ]);
    const modified = r.documents.map((doc) => ({
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
    return modified as unknown as likedSongs[];
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );

  const {
    data: pDetails,
    isLoading: pLoading,
    isError: pError,
    refetch: pRefetch,
  } = useQuery<likedSongs[]>(["likedSongsDetails", id], getPlaylistDetails, {
    retry: 0,
    staleTime: 1000,
    refetchOnWindowFocus: false,
  });

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${pDetails && pDetails[0].title}`,
        text: `${pDetails && pDetails[0].title}}`,
        url: window.location.origin + `/liked/${localStorage.getItem("uid")}`,
      });
    } catch (error) {
      console.log(error);
    }
  }, [pDetails]);
  const handlePlay = useCallback(() => {
    if (pDetails) {
      dispatch(setIsLikedSong(true));
      dispatch(setPlaylist(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
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
      {pDetails && (
        <>
          <div className="flex w-full h-[23rem]   relative ">
            <GoBack />

            <div className=" absolute top-4 z-10 right-3">
              <IoReload
                onClick={() => pRefetch()}
                className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5"
              />
            </div>

            <img
              width="100%"
              height="100%"
              src="https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png"
              alt="Image"
              loading="lazy"
              className="object-cover opacity-80 h-[100%] w-[100%]"
            />

            <div className=" absolute bottom-5 px-4 left-0  right-0">
              <h1 className="text-center  font-semibold py-2 text-2xl capitalize">
                Liked Songs
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
            {pDetails.map((data, i) => (
              <Songs
                p={id || ""}
                liked={true}
                query="likedSongsDetails"
                artistId={data.artists[0].id}
                audio={data.youtubeId}
                key={data.youtubeId + i}
                id={i}
                title={data.title}
                artist={data.artists[0].name}
                cover={data.thumbnailUrl}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const LikedSong = React.memo(LikedSongComp);
export default LikedSong;
