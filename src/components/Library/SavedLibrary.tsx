import Header from "../Header/Header";
import SavedLibraryCard from "./SavedLibraryCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistUrl, setSavedPlaylist } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import SkeletonP from "./SkeletonP";
import {
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { savedPlaylist } from "@/Interface";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GrNext } from "react-icons/gr";

function SavedLibraryComp() {
  const dispatch = useDispatch();
  const savedPlaylist = useSelector(
    (state: RootState) => state.musicReducer.savedPlaylist
  );
  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [localStorage.getItem("uid") || "default", "default"]),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data, isLoading } = useQuery("savedPlaylist", loadSavedPlaylist, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    dispatch(setSavedPlaylist([]));
    dispatch(setPlaylistUrl(""));
    if (data) {
      dispatch(setSavedPlaylist([...data]));
    }
  }, [dispatch, data]);

  return (
    <>
      <Header title="Library" l={true} />
      <Link to={`/liked/${localStorage.getItem("uid")}`}>
        <div className="flex space-x-2.5 px-4 mb-3 items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="overflow-hidden h-[3.2rem]  w-[3.2rem] ">
              <AspectRatio ratio={1 / 1}>
                <LazyLoadImage
                  height="100%"
                  width="100%"
                  effect="blur"
                  src="https://www.gstatic.com/youtube/media/ytm/images/pbg/liked-music-@576.png"
                  alt="Image"
                  className="rounded-md object-cover w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col  text-xl text-start">
              <p className="w-[59vw] fade-in truncate">Liked Songs</p>
              <p className="-mt-0.5  text-sm w-[50vw] truncate h-2"></p>
            </div>
          </div>

          <GrNext className="h-5 w-5" />
        </div>
      </Link>
      {isLoading && (
        <div className="flex fade-in space-y-3  flex-col px-4">
          <SkeletonP />
          <SkeletonP />
          <SkeletonP />
          <SkeletonP />
        </div>
      )}
      <div className="flex fade-in  flex-col px-4">
        <div className="pb-36 space-y-3">
          {savedPlaylist.map((saved, id) => (
            <SavedLibraryCard
              key={saved.link + id}
              id={saved.$id || ""}
              author={saved.creator}
              link={saved.link}
              f={saved.for}
            />
          ))}
        </div>
      </div>
    </>
  );
}
const SavedLibrary = React.memo(SavedLibraryComp);

export default SavedLibrary;
