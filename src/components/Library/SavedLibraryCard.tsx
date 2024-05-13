import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import EditInfo from "./EditInfo";
import { useQuery } from "react-query";
import { SearchPlaylist, savedPlaylist } from "@/Interface";
import axios from "axios";
import SkeletonP from "./SkeletonP";
import { SearchPlaylistApi } from "@/API/api";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import useImage from "@/hooks/useImage";
import React from "react";
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
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  const c = useImage((p && p[0]?.thumbnailUrl) || data?.image || "");
  const c1 = useImage(data?.image || "");
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
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
                className ? "h-[3.3rem] w-[3.3rem]" : "h-14 w-14 "
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
                } font-medium fade-in truncate`}
              >
                {author || data.creator || "NapsterDrx."}
              </p>
              <p className="-mt-0.5  text-xs w-[50vw] text-zinc-400 truncate">
                {p[0]?.title || data.name}
              </p>
            </div>
          </Link>
          {uid == f && <EditInfo id={id} f={f} />}
        </>
      ) : (
        <>
          {data && (
            <>
              <Link
                to={`/library/${"custom" + data.$id}`}
                className="flex space-x-2.5 items-center justify-between"
              >
                <div className="overflow-hidden h-14 -sm w-14 space-y-2">
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
                  <p className="w-[59vw]  text-lg   fade-in truncate">
                    {data.creator || "NapsterDrx."}
                  </p>
                  <p className="-mt-0.5  text-xs w-[50vw] truncate">
                    {data.name || "Unknown"}
                  </p>
                </div>
              </Link>
              {uid == f && <EditInfo id={data.$id || ""} f={f} />}
            </>
          )}
        </>
      )}
    </div>
  );
}

const SavedLibraryCard = React.memo(SavedLibraryCardComp);
export default SavedLibraryCard;
