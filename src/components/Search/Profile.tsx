import { AspectRatio } from "../ui/aspect-ratio";

import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { suggestedArtists } from "@/Interface";
import { useCallback } from "react";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import useImage from "@/hooks/useImage";

function ProfileSearch({
  name,
  artistId,
  thumbnailUrl,
  fromSearch,
}: suggestedArtists) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const handleClick = useCallback(async () => {
    if (!fromSearch) {
      try {
        db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
          youtubeId: artistId,
          thumbnailUrl: thumbnailUrl,
          title: name,
          type: "profile",
          for: uid || "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [artistId, name, thumbnailUrl, fromSearch, uid]);

  const c = useImage(thumbnailUrl);

  return (
    <div
      onClick={handleClick}
      className="flex  animate-fade-right py-2 space-x-2 items-center"
    >
      <Link to={`/profile/${artistId}`}>
        <div className="overflow-hidden h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <img
              src={c || ""}
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
      <Link to={`/profile/${artistId}`}>
        <div className="flex  flex-col pl-1 text-start w-[67dvw]">
          <p className={`w-[60dvw] truncate`}>{name}</p>

          <p className="-mt-0.5  text-zinc-400 text-xs w-[40dvw]   truncate">
            Profile
          </p>
        </div>
      </Link>
      <Link to={`/artist/${artistId}`}>
        <GrNext />
      </Link>
    </div>
  );
}

export { ProfileSearch };
