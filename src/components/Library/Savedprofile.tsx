import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import { profiles } from "@/Interface";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { DATABASE_ID, NEW_USER, db } from "@/appwrite/appwriteConfig";

function SavedProfile({ pid }: { pid: string }) {
  const getArtistDetails = useCallback(async () => {
    const user = await db.getDocument(DATABASE_ID, NEW_USER, pid);
    return user as unknown as profiles;
  }, [pid]);

  const { data, refetch } = useQuery<profiles>(
    ["profiles", pid],
    getArtistDetails,
    {
      retry: 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
      onSuccess(d) {
        d == null && refetch();
      },
    }
  );

  return (
    <div className="flex  animate-fade-right  space-x-2 items-center">
      <Link to={`/profile/${pid}`}>
        <div className="overflow-hidden h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              src={(data && data?.image) || "/cache.jpg"}
              width="100%"
              height="100%"
              effect="blur"
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
      <Link to={`/profile/${pid}`}>
        <div className="flex  flex-col pl-1 text-start w-[66dvw]">
          <p className={`w-[60dvw] text-lg font-medium truncate`}>
            {(data && data?.name) || ""}
          </p>

          <p className="-mt-0.5 text-zinc-400 text-xs w-[40dvw]   truncate">
            Profile
          </p>
        </div>
      </Link>
    </div>
  );
}

export { SavedProfile };
