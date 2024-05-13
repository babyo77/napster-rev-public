import Header from "../Header/Header";
import SavedLibraryCard from "./SavedLibraryCard";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/Store/Store";
import SkeletonP from "./SkeletonP";

import { Link } from "react-router-dom";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GrNext } from "react-icons/gr";
import { ToggleLibrary } from "./Toggle";
import SavedAlbumCard from "./savedAAlbums";
import { ArtistSearch } from "./savedArtists";
import { GiPin } from "react-icons/gi";
import Lottie from "lottie-react";
import likeData from "../../assets/like.json";
import editsData from "../../assets/edits.json";
import { SavedProfile } from "./Savedprofile";
import useSaved from "@/hooks/saved";

function SavedLibraryComp() {
  const savedPlaylist = useSelector(
    (state: RootState) => state.musicReducer.savedPlaylist
  );
  const savedAlbums = useSelector(
    (state: RootState) => state.musicReducer.savedAlbums
  );
  const currentToggle = useSelector(
    (state: RootState) => state.musicReducer.currentToggle
  );
  const savedArtists = useSelector(
    (state: RootState) => state.musicReducer.savedArtists
  );
  const savedProfiles = useSelector(
    (state: RootState) => state.musicReducer.savedProfile
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const { isLoading } = useSaved();
  return (
    <>
      <Header title="Library" l={true} />
      <ToggleLibrary />
      <div className="  h-[80dvh] pb-36 overflow-scroll ">
        {currentToggle === "Playlists" && (
          <>
            <Link to={`/liked/${uid}`}>
              <div className="flex space-x-2 px-5 mb-3 animate-fade-right items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="overflow-hidden h-14  w-14 ">
                    <AspectRatio ratio={1 / 1} className="bg-white -md">
                      <Lottie
                        loop={false}
                        animationData={likeData}
                        className="w-[100%] h-[100%]"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex flex-col  text-xl text-start">
                    <p className="w-[59vw] fade-in font-medium text-lg truncate">
                      Liked Songs
                    </p>
                    <div className="flex -mt-0.5 text-zinc-400 items-center space-x-1">
                      <GiPin className="h-3 text-white w-3" />
                      <p className="text-xs w-[50vw]truncate">Playlist</p>
                    </div>
                  </div>
                </div>

                <GrNext className="h-5  w-5" />
              </div>
            </Link>
            <Link to={`/edits/${uid}`}>
              <div className="flex space-x-2 px-5 mb-3 animate-fade-right items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="overflow-hidden h-14  w-14 ">
                    <AspectRatio ratio={1 / 1} className="bg-white -md">
                      <Lottie
                        loop={false}
                        animationData={editsData}
                        className="w-[100%] h-[100%]"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex flex-col  text-xl text-start">
                    <p className="w-[59vw] fade-in font-medium text-lg truncate">
                      Liked Tunes
                    </p>
                    <div className="flex -mt-0.5 text-zinc-400 items-center space-x-1">
                      <GiPin className="h-3 text-white w-3" />
                      <p className="text-xs w-[50vw]truncate">Showcase</p>
                    </div>
                  </div>
                </div>

                <GrNext className="h-5  w-5" />
              </div>
            </Link>
            <Link to={`/tunebox/${uid}`}>
              <div className="flex space-x-2 px-5 mb-3 animate-fade-right items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="overflow-hidden h-14  w-14 -md ">
                    <AspectRatio ratio={1 / 1}>
                      <LazyLoadImage
                        height="100%"
                        width="100%"
                        effect="blur"
                        src="/tunebox.jpg"
                        alt="Image"
                        className="-md object-cover w-[100%] h-[100%]"
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex flex-col  text-xl text-start">
                    <p className="w-[59vw] fade-in font-medium text-lg truncate">
                      Tune Box
                    </p>
                    <div className="flex -mt-0.5 text-zinc-400 items-center space-x-1">
                      <GiPin className="h-3 text-white w-3" />
                      <p className="text-xs w-[50vw]truncate">Showcase</p>
                    </div>
                  </div>
                </div>

                <GrNext className="h-5  w-5" />
              </div>
            </Link>
          </>
        )}
        {isLoading && (
          <div className="flex fade-in space-y-3  flex-col px-5">
            <SkeletonP />
            <SkeletonP />
            <SkeletonP />
            <SkeletonP />
          </div>
        )}

        <div className="flex fade-in flex-col px-5">
          <div className=" space-y-3">
            {currentToggle === "Playlists" &&
              savedPlaylist.map((saved, id) => (
                <SavedLibraryCard
                  key={saved.link + id}
                  id={saved.$id || ""}
                  data={saved}
                  author={saved.creator}
                  link={saved.link}
                  f={saved.for}
                />
              ))}

            {currentToggle === "Albums" &&
              savedAlbums.map((saved, id) => (
                <SavedAlbumCard
                  key={saved.link + id}
                  id={saved.$id || ""}
                  author={saved.creator}
                  album={saved.name}
                  Image={saved.image}
                  link={saved.link}
                  f={saved.for}
                />
              ))}
            {currentToggle === "Artists" &&
              savedArtists.map((saved, id) => (
                <ArtistSearch
                  key={saved.artistId + id}
                  artistId={saved.artistId}
                  name={saved.name}
                  thumbnailUrl={saved.thumbnailUrl}
                />
              ))}
            {currentToggle === "Profiles" &&
              savedProfiles.map((saved, id) => (
                <SavedProfile key={saved.$id + id} pid={saved.pid} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
const SavedLibrary = React.memo(SavedLibraryComp);

export default SavedLibrary;
