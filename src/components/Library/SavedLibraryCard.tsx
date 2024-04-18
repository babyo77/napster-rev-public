import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useQuery } from "react-query";
import { SearchPlaylist, savedPlaylist } from "@/Interface";
import axios from "axios";
import SkeletonP from "./SkeletonP";
import { SearchPlaylistApi } from "@/API/api";
function SavedLibraryCard({
  author,
  link,
  f,
  id,
  data,
}: {
  data: savedPlaylist;
  id: string;
  author?: string;
  link?: string;
  f: string;
}) {
  const getPlaylistDetail = async () => {
    const list = await axios.get(`${SearchPlaylistApi}${link}`);
    return list.data as SearchPlaylist[];
  };

  const { data: p, isLoading } = useQuery<SearchPlaylist[]>(
    ["SavedPlaylistDetails", id],
    getPlaylistDetail,
    {
      retryOnMount: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  return (
    <div className="flex animate-fade-right space-x-2.5 items-center justify-between">
      {p ? (
        <>
          {isLoading && <SkeletonP />}
          <Link
            to={`/library/${
              data.link.startsWith("custom") ? "custom" + data.$id : link
            }`}
            className="flex space-x-2.5 items-center justify-between"
          >
            <div className="overflow-hidden h-14  w-14 space-y-2">
              <AspectRatio ratio={1 / 1}>
                <LazyLoadImage
                  height="100%"
                  width="100%"
                  effect="blur"
                  src={
                    p[0]?.thumbnailUrl ||
                    data.image ||
                    "https://i.pinimg.com/564x/e0/ad/78/e0ad78737e2dc7c31b4190aafaa870bf.jpg"
                  }
                  alt="Image"
                  className="rounded-lg object-cover w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col   text-start">
              <p className="w-[59vw]  text-lg font-semibold fade-in truncate">
                {author || data.creator || "NapsterDrx."}
              </p>
              <p className="-mt-0.5  text-xs w-[50vw] text-zinc-400 truncate">
                {p[0]?.title || data.name}
              </p>
            </div>
          </Link>
          <EditInfo id={id} f={f} />
        </>
      ) : (
        <>
          {data && (
            <>
              <Link
                to={`/library/${"custom" + data.$id}`}
                className="flex space-x-2.5 items-center justify-between"
              >
                <div className="overflow-hidden h-14  w-14 space-y-2">
                  <AspectRatio ratio={1 / 1}>
                    <LazyLoadImage
                      height="100%"
                      width="100%"
                      effect="blur"
                      src={data.image || "/favicon.jpeg"}
                      alt="Image"
                      className="rounded-md object-cover w-[100%] h-[100%]"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col   text-start">
                  <p className="w-[59vw]  text-lg   fade-in truncate">
                    {data.creator || "NapsterDrx."}
                  </p>
                  <p className="-mt-0.5  text-xs w-[50vw] truncate">
                    {data.name || "Unknown"}
                  </p>
                </div>
              </Link>
              <EditInfo id={data.$id || ""} f={f} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SavedLibraryCard;
