import { Link, useLocation } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";
import { useQuery } from "react-query";
import { SearchPlaylist, savedPlaylist } from "@/Interface";
import axios from "axios";
import SkeletonP from "./SkeletonP";
import { SearchPlaylistApi } from "@/API/api";
import useImage from "@/hooks/useImage";
import React from "react";
import useLibrary from "@/hooks/useLibrary";
function SavedLibraryCardComp({
  author,
  link,
  f,
  id,
  data,
  className,
}: {
  className?: boolean;
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

      staleTime: 60 * 60000,
    }
  );
  const location = useLocation();
  const c = useImage((p && p[0]?.thumbnailUrl) || data?.image || "");
  const c1 = useImage(data?.image || "");
  const { uid } = useLibrary({
    id: data.link.startsWith("custom") ? "custom" + data.$id : link,
  });
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
            <div
              className={`overflow-hidden  space-y-2 ${
                className ? "h-[3.7rem] w-[3.7rem]" : "h-[3.7rem] w-[3.7rem] "
              } -md`}
            >
              <AspectRatio ratio={1 / 1} className=" -md">
                <img
                  height="100%"
                  width="100%"
                  src={c}
                  alt="Image"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                    (e.currentTarget.src = "/cache.jpg")
                  }
                  className="-md object-cover object-center w-[100%] h-[100%]"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col   text-start">
              <p
                className={` ${
                  className ? "text-lg w-[70vw]" : "text-lg w-[59vw]"
                }   truncate`}
              >
                {author || data.creator || "NapsterDrx."}
              </p>
              <p className="-mt-0.5  text-xs w-[50vw] text-zinc-400 truncate">
                {p[0]?.title || data.name}
              </p>
            </div>
          </Link>
          {location.pathname !== `/profile/${uid}` && (
            <>
              {location.pathname !== `/playlist/${uid}` && (
                <>{uid == f && <EditInfo id={id} f={f} />}</>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {data && (
            <>
              <Link
                to={`/library/${"custom" + data.$id}`}
                className="flex space-x-2.5 items-center justify-between"
              >
                <div className="overflow-hidden h-[3.7rem] -sm w-[3.7rem] space-y-2">
                  <AspectRatio ratio={1 / 1}>
                    <img
                      height="100%"
                      width="100%"
                      src={c1 || ""}
                      alt="Image"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => (e.currentTarget.src = "/cache.jpg")}
                      className="-sm object-cover w-[100%] h-[100%]"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col   text-start">
                  <p className="w-[59vw]  text-lg     truncate">
                    {data.creator || "NapsterDrx."}
                  </p>
                  <p className="-mt-0.5  text-xs w-[50vw] text-zinc-400 truncate">
                    {data.name || "Unknown"}
                  </p>
                </div>
              </Link>

              {location.pathname !== `/profile/${uid}` && (
                <>
                  {location.pathname !== `/playlist/${uid}` && (
                    <>{uid == f && <EditInfo id={id} f={f} />}</>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

const SavedLibraryCard = React.memo(SavedLibraryCardComp);
export default SavedLibraryCard;
