import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useQuery } from "react-query";
import { SearchPlaylist } from "@/Interface";
import axios from "axios";
import SkeletonP from "./SkeletonP";
import { getPlaylistDetails } from "@/API/api";
import { ALBUM_COLLECTION_ID } from "@/appwrite/appwriteConfig";
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
  const getAlbumDetail = async () => {
    const list = await axios.get(`${getPlaylistDetails}${link}`);
    return list.data as SearchPlaylist[];
  };

  const { isLoading } = useQuery<SearchPlaylist[]>(
    ["SavedAlbumDetails", id],
    getAlbumDetail,
    {
      retryOnMount: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  return (
    <div className="flex space-x-2.5 items-center justify-between">
      {isLoading && <SkeletonP />}
      {!isLoading && link && (
        <>
          <Link
            to={`/album/${link}`}
            className="flex space-x-2.5 items-center justify-between"
          >
            <div className="overflow-hidden h-14  w-14 space-y-2">
              <AspectRatio ratio={1 / 1}>
                <LazyLoadImage
                  height="100%"
                  width="100%"
                  effect="blur"
                  src={Image}
                  alt="Image"
                  className="rounded-lg object-cover w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col   text-start">
              <p className="w-[59vw] text-lg font-semibold fade-in truncate">
                {album}
              </p>

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
