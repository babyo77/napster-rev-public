import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { suggestedArtists } from "@/Interface";
import { useCallback } from "react";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import axios from "axios";

function ArtistSearch({
  name,
  artistId,
  thumbnailUrl,
  fromSearch,
}: suggestedArtists) {
  const handleClick = useCallback(() => {
    if (!fromSearch) {
      try {
        db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
          youtubeId: artistId,
          thumbnailUrl: thumbnailUrl,
          title: name,
          type: "artist",
          for: localStorage.getItem("uid") || "error",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [artistId, name, thumbnailUrl, fromSearch]);

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
      <Link to={`/artist/${artistId}`}>
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
              className="rounded-full object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
      </Link>
      <Link to={`/artist/${artistId}`}>
        <div className="flex  flex-col pl-1 text-start w-[67dvw]">
          <p className={`w-[60dvw] truncate`}>{name}</p>

          <p className="-mt-0.5  text-zinc-400 text-xs w-[40dvw]   truncate">
            Artist
          </p>
        </div>
      </Link>
      <Link to={`/artist/${artistId}`}>
        <GrNext />
      </Link>
    </div>
  );
}

export { ArtistSearch };
