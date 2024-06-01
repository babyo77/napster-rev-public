import { FaPlay } from "react-icons/fa6";
import { NavLink, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { DATABASE_ID, EDITS, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { playlistSongs } from "@/Interface";
import Loader from "@/components/Loaders/Loader";
import GoBack from "@/components/Goback";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import { RxShuffle } from "react-icons/rx";
import Share from "@/HandleShare/Share";
import { useInView } from "react-intersection-observer";
import NotFound from "@/components/404";

import useLikedSongs from "@/hooks/useLikedSongs";
function SavedEditsComp() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
  });

  const { id } = useParams();

  const {
    pDetails,
    pError,
    pLoading,
    pRefetch,
    uid,
    handlePlay,
    handleShufflePlay,
  } = useLikedSongs({ id, edits: true });

  const q = useQueryClient();
  useEffect(() => {
    if (inView && uid) {
      if (id && pDetails) {
        db.listDocuments(DATABASE_ID, EDITS, [
          Query.orderDesc("$createdAt"),
          Query.equal("for", [id || uid]),
          Query.cursorAfter(pDetails[pDetails.length - 1].$id),
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
          await q.setQueryData(["editSongDetails", id], (prev) => [
            ...(prev as playlistSongs[]),
            ...modified,
          ]);
        });
      }
    }
  }, [inView, id, pDetails, uid, q]);

  return (
    <div className=" flex flex-col items-center">
      {pError && <NotFound />}
      {pLoading && pLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {!pDetails && !pError && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {pDetails && pDetails?.length == 0 && <NotFound />}
      {pDetails && pDetails.length > 1 ? (
        <>
          <div className="flex w-screen h-[25rem] justify-center pt-[6vh] relative ">
            <GoBack />
            <div className="absolute top-4 z-10 right-3 flex-col space-y-0.5">
              <Share className=" text-zinc-400" />
            </div>
            <div className="h-56  w-56">
              <img
                width="100%"
                height="100%"
                src="/edits.jpg"
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down -xl h-[100%] w-[100%]"
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
