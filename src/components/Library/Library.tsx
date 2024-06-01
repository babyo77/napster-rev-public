import Songs from "./Songs";
import { Button } from "../ui/button";
import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { Link, NavLink, useParams } from "react-router-dom";

import Loader from "../Loaders/Loader";
import { RxShuffle } from "react-icons/rx";

import AddLibrary from "./AddLibrary";
import GoBack from "../Goback";

import { EditCustomPlaylist } from "./EditCustomPlaylist";
import PlaylistShare from "./playlistShare";
import Share from "@/HandleShare/Share";
import NotFound from "../404";
import Rating from "./rating";
import useLibrary from "@/hooks/useLibrary";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { ADD_TO_LIBRARY, DATABASE_ID, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { playlistSongs } from "@/Interface";

function LibraryComp() {
  const { id } = useParams();
  const {
    c2,
    user,
    pDetails,
    pLoading,
    pError,
    playlistThumbnail,
    playlistThumbnailError,
    playlistThumbnailIsRefetching,
    playlistThumbnailLoading,
    playlistThumbnailRefetch,
    handleSave,
    handleShufflePlay,
    handlePlay,
    isRefetching,
    isSaved,
    isStandalone,
    isLoading,
    pIsRefetching,
    isError,
    refetch,
    data,
    uid,
  } = useLibrary({ id });
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const q = useQueryClient();
  useEffect(() => {
    if (inView) {
      if (id && id.startsWith("custom") && data) {
        db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
          Query.orderDesc("$createdAt"),
          Query.equal("playlistId", [id.replace("custom", "")]),
          Query.cursorAfter(data[data.length - 1].$id || ""),
        ]).then(async (r) => {
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
          await q.setQueryData(["playlist", id], (prev) => [
            ...(prev as playlistSongs[]),
            ...modified,
          ]);
        });
      }
    }
  }, [inView, id, uid, data, q]);

  return (
    <div className=" flex flex-col items-center">
      {isError && pError && playlistThumbnailError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No playlist found
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="h-7 w-7  my-5 mx-4  backdrop-blur-md text-black bg-white/70 rounded-full p-1" />
          </NavLink>
        </div>
      )}
      {isRefetching && pIsRefetching && playlistThumbnailIsRefetching && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {isLoading && pLoading && playlistThumbnailLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {!data && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {data && data.length == 0 && <NotFound />}
      {data && pDetails && user && (
        <>
          <div className="flex w-screen  pt-[7vh] justify-center  ">
            <GoBack />

            <div className="absolute top-4 z-10 right-3  items-center">
              {id?.startsWith("custom") && data && uid == data[0]?.for && (
                <EditCustomPlaylist
                  reload={playlistThumbnailRefetch}
                  thumbnailUrl={c2 ? c2 : "/cache.jpg"}
                  id={id.replace("custom", "")}
                  name={(pDetails && pDetails[0]?.title) || ""}
                  creator={(pDetails && pDetails[0]?.name) || ""}
                />
              )}
              {isSaved && isSaved?.length == 0 && !id?.startsWith("custom") && (
                <div className="-mb-1.5">
                  <AddLibrary clone={true} id={id} />
                </div>
              )}
              {isSaved && isSaved?.length == 0 && id?.startsWith("custom") && (
                <div className="" onClick={handleSave}>
                  <IoMdAdd className="h-8 w-8 animate-fade-left  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
                </div>
              )}

              {isStandalone ? (
                <div>
                  <PlaylistShare
                    cover={
                      (playlistThumbnail &&
                        playlistThumbnail[0]?.thumbnailUrl) ||
                      "/cache.jpg"
                    }
                    maker={(user && user[0]?.name) || ""}
                    name={(pDetails && pDetails[0]?.title) || ""}
                  />{" "}
                </div>
              ) : (
                <Share />
              )}
              <Rating />
            </div>

            <div className=" flex flex-col justify-center items-center">
              <div className="h-56  w-56">
                <img
                  width="100%"
                  height="100%"
                  src={
                    (playlistThumbnail &&
                      playlistThumbnail[0]?.thumbnailUrl.replace(
                        "w120-h120",
                        "w1080-h1080"
                      )) ||
                    "/cache.jpg"
                  }
                  onError={(e) => (e.currentTarget.src = "/cache.jpg")}
                  alt="Image"
                  loading="lazy"
                  className="object-cover animate-fade-down -xl h-[100%] w-[100%]"
                />
              </div>
              <div>
                <h1 className="text-center animate-fade-down font-semibold leading-tight pt-[1vh]  text-2xl capitalize px-4">
                  {(pDetails && pDetails[0]?.title) || "Mixes"}
                </h1>
                {user && user.length > 0 && (
                  <div className="flex items-center w-full justify-center space-x-0.5 ">
                    <img
                      src={user[0].image || "/newfavicon.jpg"}
                      alt=""
                      className="h-3 w-3 rounded-full"
                    />
                    <h1 className="text-center animate-fade-down  font-medium text-zinc-300 -pt-4 truncate text-xs ">
                      {
                        <Link to={`/profile/${pDetails[0].for}`}>
                          {user[0].name}
                        </Link>
                      }
                    </h1>
                  </div>
                )}
              </div>
              <div
                className={`flex space-x-4 py-1 ${
                  user && user.length > 0 ? "pt-2" : "pt-3"
                } px-2 justify-center  items-center w-full`}
              >
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
          <div className="py-1  pb-[9.4rem]">
            {data.map((d, i) => (
              <div key={d.youtubeId ? d.youtubeId + i : i} ref={ref}>
                <Songs
                  data={data}
                  reload={refetch}
                  p={id || ""}
                  forId={d.for}
                  where={"library"}
                  artistId={d.artists ? d?.artists[0]?.id : "unknown"}
                  audio={d.youtubeId}
                  key={d.youtubeId ? d.youtubeId + i : ""}
                  id={i}
                  query={(id?.startsWith("custom") && "custom") || ""}
                  delId={d.$id}
                  title={d?.title || "unknown"}
                  artist={d.artists ? d?.artists[0]?.name : "unknown"}
                  cover={d?.thumbnailUrl || "/cache.jpg"}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const Library = React.memo(LibraryComp);
export default Library;
