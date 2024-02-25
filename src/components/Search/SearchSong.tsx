import { IoIosMore } from "react-icons/io";
import { AspectRatio } from "../ui/aspect-ratio";
import { useCallback } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import {
  isLoop,
  play,
  setCurrentArtistId,
  setCurrentIndex,
  setPlaylist,
} from "@/Store/Player";
import { artists, playlistSongs } from "@/Interface";
import { Link } from "react-router-dom";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
function SearchSong({
  title,
  artist,
  cover,
  id,
  audio,
  artistId,
}: {
  audio: string;
  id: string;
  title: string;
  artist: artists[];
  cover: string;
  artistId: string;
}) {
  const dispatch = useDispatch();
  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const handlePlay = useCallback(() => {
    try {
      db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
        song: title,
        user: localStorage.getItem("uid") || "error",
      });
    } catch (error) {
      console.log(error);
    }
    const m: playlistSongs = {
      youtubeId: id,
      title: title,
      artists: artist,
      thumbnailUrl: cover,
    };
    dispatch(setCurrentIndex(0));
    dispatch(setPlaylist([m]));
    dispatch(isLoop(true));
    dispatch(setCurrentArtistId(artistId));
    if (!isPlaying) dispatch(play(true));
  }, [artist, isPlaying, cover, id, title, dispatch, artistId]);
  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${title} - ${artist[0].name}`,
        text: `${title} - ${artist[0].name}`,
        url: window.location.origin + "/library/expand",
      });
    } catch (error) {
      console.log(error);
    }
  }, [artist, title]);
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  return (
    <div className="flex fade-in py-2 space-x-2 items-center">
      <div className="overflow-hidden h-12 w-12 space-y-2">
        <AspectRatio ratio={1 / 1}>
          <LazyLoadImage
            onClick={handlePlay}
            src={cover}
            width="100%"
            height="100%"
            effect="blur"
            alt="Image"
            loading="lazy"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/demo3.jpeg")
            }
            className="rounded-md object-cover h-[100%] w-[100%]"
          />
        </AspectRatio>
      </div>
      <div className="flex  flex-col pl-1 text-start w-[70dvw]">
        <p
          onClick={handlePlay}
          className={`w-[60dvw] ${
            playlist[currentIndex]?.youtubeId == audio &&
            currentIndex == 0 &&
            "text-red-500"
          }  truncate`}
        >
          {title}
        </p>
        <Link to={`/artist/${artistId}`}>
          <p className="-mt-0.5 underline text-zinc-400 text-xs w-[40dvw]   truncate">
            {artist[0].name}
          </p>
        </Link>
        <div className="h-[.05rem] w-full bg-zinc-300/10 mt-1.5"></div>
      </div>
      <IoIosMore onClick={handleShare} />
    </div>
  );
}

export default SearchSong;
