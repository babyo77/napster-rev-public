import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { PiQueue } from "react-icons/pi";
import { IoAddSharp, IoShareOutline } from "react-icons/io5";

import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import Loader from "../Loaders/Loader";
import { LiaDownloadSolid } from "react-icons/lia";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import useDownload from "./download";
import useOptions from "./useoptions";
import { playlistSongs } from "@/Interface";
import { useState } from "react";

function SongsOptions({
  library,
  underline,
  music,
  like,
  edits,
  tunebox,
  id,
  reload,
}: {
  reload?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<playlistSongs[], unknown>>;
  like?: boolean;
  edits?: boolean;
  tunebox?: boolean;
  id?: string;
  music: playlistSongs;
  library?: boolean;
  underline?: boolean;
}) {
  const {
    handleAdd,
    handleLibrary,
    handlePlaylist,
    handleDelete,
    handleQueue,
    handleShare,
    isLoading,
    data,
    uid,
  } = useOptions({ music, like, edits, tunebox, id, reload });
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const { handleDownload, handleRemoveDownload, isDownload } = useDownload({
    music,
    setDownloaded,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={isDownload} className="m-0 p-0">
        <BiDotsHorizontalRounded className="h-6 w-6 text-zinc-300" />
        {!underline && (
          <div
            className={`h-[.05rem] w-[8vw] bg-zinc-300/10 ${
              edits ? "mt-[1.2rem]" : "mt-[1.1rem]"
            } -ml-2`}
          ></div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent border-none rounded-lg backdrop-blur-2xl mx-4 -mt-4">
        <DropdownMenuItem
          onClick={handleLibrary}
          className="flex items-center justify-between space-x-2"
        >
          <p className="text-base">Add to library</p>
          <IoAddSharp className="h-5 w-5" />
        </DropdownMenuItem>

        <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            onClick={handlePlaylist}
            className="flex items-center justify-between space-x-2"
          >
            <p className="text-base">Add to a Playlist...</p>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-transparent w-[37vw] border-none rounded-lg backdrop-blur-2xl  mr-2">
              {isLoading && (
                <div className="py-3 flex justify-center items-center">
                  <Loader loading={true} size="17" />
                </div>
              )}
              {data && data.length > 0 ? (
                data.map((d, i) => (
                  <div key={d.$id}>
                    {i !== 0 && (
                      <div className="h-[.05rem]  bg-zinc-300/10 "></div>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleAdd(d.$id || "null", true)}
                    >
                      <p className="truncate ">{d.creator}</p>
                    </DropdownMenuItem>
                  </div>
                ))
              ) : (
                <>
                  {!isLoading && (
                    <DropdownMenuItem
                      onClick={handleLibrary}
                      className="flex items-center justify-between space-x-1"
                    >
                      <p className="text-sm">Create new and add</p>
                      <IoAddSharp className="h-5 w-5" />
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
        <DropdownMenuItem
          onClick={handleQueue}
          className="flex items-center justify-between space-x-2"
        >
          <p className="text-base">Add to queue</p>
          <PiQueue className="h-5 w-5" />
        </DropdownMenuItem>
        <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
        <DropdownMenuItem
          onClick={handleShare}
          className="flex items-center justify-between space-x-2"
        >
          <p className="text-base">Share</p>
          <IoShareOutline className="h-5 w-5" />
        </DropdownMenuItem>

        {downloaded && downloaded ? (
          <>
            <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
            <DropdownMenuItem
              onClick={handleRemoveDownload}
              className="flex items-center justify-between space-x-2"
            >
              <p className="text-base">Remove Download</p>
              <IoIosRemoveCircleOutline className="h-5 w-5" />
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
            <DropdownMenuItem
              onClick={handleDownload}
              className="flex items-center justify-between space-x-2"
            >
              <p className="text-base">Download</p>
              <LiaDownloadSolid className="h-5 w-5" />
            </DropdownMenuItem>
          </>
        )}

        {library && uid && uid == music.for && (
          <>
            <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
            <DropdownMenuItem
              onClick={handleDelete}
              className="flex items-center -mb-0.5 -mt-0.5 justify-between space-x-2"
            >
              <p className="text-base">Remove</p>
              <IoIosRemoveCircleOutline className="h-5 w-5" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SongsOptions;
