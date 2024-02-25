import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useQuery } from "react-query";
import { SearchPlaylist } from "@/Interface";
import { SearchPlaylistApi } from "@/API/api";
import axios from "axios";
import SkeletonP from "./SkeletonP";
function SavedLibraryCard({
  author,
  link,
  f,
  id,
}: {
  id: string;
  author?: string;
  link?: string;
  f: string;
}) {
  const getPlaylistDetails = async () => {
    const list = await axios.get(`${SearchPlaylistApi}${link}`);
    return list.data as SearchPlaylist[];
  };

  const { data: p, isLoading } = useQuery<SearchPlaylist[]>(
    ["SavedPlaylistDetails", id],
    getPlaylistDetails,
    {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  return (
    <div className="flex space-x-2.5 items-center justify-between">
      {isLoading && <SkeletonP />}
      {p && (
        <>
          <Link
            to={`/library/${link}`}
            className="flex space-x-2.5 items-center justify-between"
          >
            <div className="overflow-hidden h-[3.2rem]  w-[3.2rem] space-y-2">
              <AspectRatio ratio={1 / 1}>
                <LazyLoadImage
                  height="100%"
                  width="100%"
                  effect="blur"
                  src={p[0]?.thumbnailUrl || "/favicon.webp"}
                  alt="Image"
                  className="rounded-md object-cover w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col  text-xl text-start">
              <p className="w-[59vw]     fade-in truncate">
                {p[0]?.title || "Unknown"}
              </p>
              <p className="-mt-0.5  text-sm w-[50vw] truncate">
                {author || "NapsterDrx."}
              </p>
            </div>
          </Link>
          <EditInfo id={id} f={f} />
        </>
      )}
    </div>
  );
}

export default SavedLibraryCard;
