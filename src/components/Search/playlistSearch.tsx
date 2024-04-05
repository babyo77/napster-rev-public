import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { SearchPlaylist } from "@/Interface";
import { useCallback } from "react";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import axios from "axios";

function PlaylistSearchComp({
  playlistId,
  title,
  fromSearch,
  thumbnailUrl,
}: SearchPlaylist) {
  const handleClick = useCallback(() => {
    if (!fromSearch) {
      try {
        db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
          youtubeId: playlistId,
          title: title,
          type: "playlist",
          thumbnailUrl: thumbnailUrl,
          for: localStorage.getItem("uid") || "error",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [playlistId, title, thumbnailUrl, fromSearch]);

  const image = async () => {
    const response = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
    });
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return URL.createObjectURL(blob);
  };

  const { data: c } = useQuery(["image", thumbnailUrl], image, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  return (
    <div
      onClick={handleClick}
      className="flex fade-in py-2 space-x-2 items-center"
    >
      <Link to={`/library/${playlistId}`}>
        <div className="overflow-hidden h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              src={c || thumbnailUrl}
              width="100%"
              height="100%"
              effect="blur"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/liked.webp")
              }
              className="rounded-sm object-cover h-[100%] w-[100%]"
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
