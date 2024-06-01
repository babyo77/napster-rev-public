import { FaPlay } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { DATABASE_ID, LIKE_SONG, db } from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { likedSongs } from "@/Interface";
import Loader from "@/components/Loaders/Loader";
import GoBack from "@/components/Goback";
import { Button } from "@/components/ui/button";
import Songs from "@/components/Library/Songs";
import { RxShuffle } from "react-icons/rx";
import Share from "@/HandleShare/Share";
import { useInView } from "react-intersection-observer";
import NotFound from "@/components/404";

import useLikedSongs from "@/hooks/useLikedSongs";
function LikedSongComp() {
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
  } = useLikedSongs({ id });

  const q = useQueryClient();
  useEffect(() => {
    if (inView && uid) {
      if (id && pDetails) {
        db.listDocuments(DATABASE_ID, LIKE_SONG, [
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
          await q.setQueryData(["likedSongsDetails", id], (prev) => [
            ...(prev as likedSongs[]),
            ...modified,
          ]);
        });
      }
    }
  }, [inView, id, pDetails, q, uid]);

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
      {pDetails && pDetails.length == 0 && <NotFound />}
      {pDetails && pDetails.length > 1 && (
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
                src="/liked.webp"
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down -xl h-[100%] w-[100%]"
              />
            </div>
            <div className=" absolute bottom-[1.5vh] px-4 left-0  right-0">
              <h1 className="text-center animate-fade-down   font-semibold py-[1vh] text-2xl capitalize">
                Liked Songs
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
          <div className="py-3 -mt-[2vh]  pb-[9.4rem]">
            {pDetails.map((data, i) => (
              <div key={data.youtubeId + i} ref={ref}>
                <Songs
                  data={pDetails}
                  p={id || ""}
                  liked={true}
                  forId={data.for}
                  delId={data.$id}
                  query="likedSongsDetails"
                  artistId={data.artists[0].id}
                  audio={data.youtubeId}
                  key={data.youtubeId + i}
                  id={i}
                  where="liked"
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
const LikedSong = React.memo(LikedSongComp);
export default LikedSong;
