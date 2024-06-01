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

import { playlistSongs } from "@/Interface";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoAddSharp } from "react-icons/io5";

import Loader from "../Loaders/Loader";
import { LiaDownloadSolid } from "react-icons/lia";
import ShareLyrics from "./Share";

import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";
import useDownload from "../Library/download";

import useOptions from "../Library/useoptions";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useCallback, useRef, useState } from "react";

interface option extends DropdownMenuTriggerProps {
  id?: string;
  music: playlistSongs;
}
function Options({ music, id, ...props }: option) {
  const { handleAdd, handleLibrary, handlePlaylist, isLoading, data } =
    useOptions({ music, id });
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const { handleDownload, handleRemoveDownload, isDownload } = useDownload({
    music,
    setDownloaded,
  });
  const shareSong = useRef<HTMLButtonElement>(null);
  const handleClick = useCallback(() => {
    if (shareSong.current) {
      shareSong.current.click();
    }
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={isDownload}
        className="m-0 p-1.5 flex  justify-center items-center bg-zinc-900 rounded-full"
        {...props}
      >
        <BiDotsHorizontalRounded className="h-6 w-6 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-transparent  border-none rounded-lg backdrop-blur-2xl mx-4  ">
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

          <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
          <div className="flex items-center justify-between space-x-2 pl-2 pb-1 pr-0.5">
            <p onClick={handleClick} className="text-base">
              Share Song
            </p>
            <ShareLyrics ref={shareSong} size className="h-3 w-3" />
          </div>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-transparent w-fit border-none rounded-lg backdrop-blur-2xl  mr-2">
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
                      <p className="truncate w-[27vw]">{d.creator}</p>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Options;
