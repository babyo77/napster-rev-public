import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { ArtistDetails, suggestedArtists } from "@/Interface";
import { useCallback } from "react";
import {
  ARTIST_INSIGHTS,
  DATABASE_ID,
  ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Permission, Role } from "appwrite";
import { useQuery } from "react-query";
import { GetArtistDetails } from "@/API/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import useImage from "@/hooks/useImage";

function ArtistSearch({ name, artistId, thumbnailUrl }: suggestedArtists) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const handleClick = useCallback(async () => {
    try {
      if (uid) {
        db.createDocument(
          DATABASE_ID,
          ARTIST_INSIGHTS,
          ID.unique(),
          {
            id: artistId,
            name: name,
            user: uid || "error",
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [artistId, name, uid]);

  const getArtistDetails = useCallback(async () => {
    const list = await axios.get(`${GetArtistDetails}${artistId}`);
    return list.data as ArtistDetails;
  }, [artistId]);

  const { data, refetch } = useQuery<ArtistDetails>(
    ["artist", artistId],
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

  const c = useImage(
    data
      ? data?.thumbnails[0]?.url.replace("w540-h225", "w1080-h1080")
      : thumbnailUrl
  );
  return (
    <div
      onClick={handleClick}
      className="flex  animate-fade-right  space-x-2 items-center"
    >
      <Link to={`/artist/${artistId}`}>
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
      {/* <Link to={`/artist/${artistId}`}>
        <GrNext />
      </Link> */}
    </div>
  );
}

export { ArtistSearch };
