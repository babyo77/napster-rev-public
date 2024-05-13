import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { SearchPlaylist } from "@/Interface";
import { useCallback } from "react";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import useImage from "@/hooks/useImage";

function PlaylistSearchComp({
  playlistId,
  title,
  fromSearch,
  thumbnailUrl,
}: SearchPlaylist) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const handleClick = useCallback(async () => {
    if (!fromSearch) {
      try {
        db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
          youtubeId: playlistId,
          title: title,
          type: "playlist",
          thumbnailUrl: thumbnailUrl,
          for: uid || "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [playlistId, title, thumbnailUrl, fromSearch, uid]);

  const c = useImage(thumbnailUrl);
  return (
    <div
      onClick={handleClick}
      className="flex animate-fade-right py-2 space-x-2 items-center"
    >
      <Link to={`/library/${playlistId}`}>
        <div className="overflow-hidden h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              src={c || ""}
              width="100%"
              height="100%"
              effect="blur"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/cache.jpg")
              }
              className="-sm object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
      </Link>
      <Link to={`/library/${playlistId}`}>
        <div className="flex  flex-col pl-1 text-start w-[67dvw]">
          <p className={`w-[60dvw] truncate`}>{title}</p>

          <p className="-mt-0.5  text-zinc-400 text-xs w-[40dvw]   truncate">
            Playlist
          </p>
        </div>
      </Link>
      <Link to={`/library/${playlistId}`}>
        <GrNext />
      </Link>
    </div>
  );
}

export { PlaylistSearchComp };
