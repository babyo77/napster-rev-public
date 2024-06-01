import { AspectRatio } from "../ui/aspect-ratio";

import { Link } from "react-router-dom";
import { suggestedArtists } from "@/Interface";
import useSavedArtist from "@/hooks/useSavedArtist";

function ArtistSearch({ name, artistId, thumbnailUrl }: suggestedArtists) {
  const { handleClick, c } = useSavedArtist({ name, artistId, thumbnailUrl });
  return (
    <div
      onClick={handleClick}
      className="flex  animate-fade-right  space-x-2 items-center"
    >
      <Link to={`/artist/${artistId}`}>
        <div className="overflow-hidden h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <img
              src={c || "/cache.jpg"}
              width="100%"
              height="100%"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/cache.jpg")
              }
              className="rounded-full object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
      </Link>
      <Link to={`/artist/${artistId}`}>
        <div className="flex  flex-col pl-1 text-start w-[66dvw]">
          <p className={`w-[60dvw] text-lg font-medium truncate`}>{name}</p>

          <p className="-mt-0.5 text-zinc-400 text-xs w-[40dvw]   truncate">
            Artist
          </p>
        </div>
      </Link>
    </div>
  );
}

export { ArtistSearch };
