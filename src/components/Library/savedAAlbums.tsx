import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";

import SkeletonP from "./SkeletonP";

import { ALBUM_COLLECTION_ID } from "@/appwrite/appwriteConfig";
import useImage from "@/hooks/useImage";
import useSavedAlbum from "@/hooks/useSavedAlbum";
function SavedAlbumCard({
  author,
  link,
  f,
  id,
  album,
  Image,
}: {
  Image?: string;
  album?: string;
  id: string;
  author?: string;
  link?: string;
  f: string;
}) {
  const { isLoading } = useSavedAlbum({ link, id });
  const c = useImage(Image || "");

  return (
    <div className="flex space-x-2.5 animate-fade-right items-center justify-between">
      {isLoading && <SkeletonP />}
      {!isLoading && link && (
        <>
          <Link
            to={`/album/${link}`}
            className="flex space-x-2.5 items-center justify-between"
          >
            <div className="overflow-hidden h-14 -md w-14 space-y-2">
              <AspectRatio ratio={1 / 1}>
                <img
                  height="100%"
                  width="100%"
                  src={c || ""}
                  alt="Image"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                    (e.currentTarget.src = "/cache.jpg")
                  }
                  className="-md object-cover w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col   text-start">
              <p className="w-[59vw] text-lg font-medium  truncate">{album}</p>

              <p className="-mt-0.5 text-zinc-400 text-xs w-[50vw] truncate">
                {author}
              </p>
            </div>
          </Link>
          <EditInfo id={id} f={f} collection={ALBUM_COLLECTION_ID} />
        </>
      )}
    </div>
  );
}

export default SavedAlbumCard;
