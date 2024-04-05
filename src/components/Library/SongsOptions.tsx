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
import { useCallback } from "react";
import { playlistSongs, savedPlaylist } from "@/Interface";
import { useDispatch, useSelector } from "react-redux";
import { setNextQueue, setPlaylist } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { IoAddSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  ID,
  LIKE_SONG,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import Loader from "../Loaders/Loader";
import { LiaDownloadSolid } from "react-icons/lia";
import { downloadApi } from "@/API/api";
import { BiDotsHorizontalRounded } from "react-icons/bi";

function SongsOptions({
  library,
  underline,
  music,
  like,
  id,
  reload,
}: {
  reload?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<playlistSongs[], unknown>>;
  like?: boolean;
  id?: string;
  music: playlistSongs;
  library?: boolean;
  underline?: boolean;
}) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const dispatch = useDispatch();
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const nextQueue = useSelector(
    (state: RootState) => state.musicReducer.nextQueue
  );
  const handleQueue = useCallback(() => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(currentIndex + nextQueue, 0, music);
    dispatch(setNextQueue(nextQueue + 1));
    dispatch(setPlaylist(newPlaylist));
  }, [music, dispatch, playlist, currentIndex, nextQueue]);

  const handleAdd = useCallback(
    async (playlistId: string, show?: boolean) => {
      const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
        Query.orderDesc("$createdAt"),
        Query.equal("for", [localStorage.getItem("uid") || "default"]),
        Query.equal("youtubeId", [music.youtubeId]),
        Query.equal("playlistId", [playlistId]),
        Query.limit(999),
      ]);

      if (r.total > 0) {
        return;
      }
      if (localStorage.getItem("uid")) {
        db.createDocument(DATABASE_ID, ADD_TO_LIBRARY, ID.unique(), {
          for: localStorage.getItem("uid"),
          youtubeId: music.youtubeId,
          artists: [music.artists[0].id, music.artists[0].name],
          title: music.title,
          thumbnailUrl: music.thumbnailUrl,
          playlistId: playlistId,
          index: r.total + 1,
        }).then(() => {
          if (show) return;
        });
      }
    },
    [music]
  );

  const handleLibrary = useCallback(async () => {
    if (localStorage.getItem("uid")) {
      db.createDocument(DATABASE_ID, PLAYLIST_COLLECTION_ID, ID.unique(), {
        name: music.title,
        creator: music.artists[0].name || "unknown",
        link: "custom" + uuidv4(),
        image: music.thumbnailUrl,
        for: localStorage.getItem("uid"),
      }).then((d) => {
        handleAdd(d.$id);
        alert("Added to new Library");
      });
    }
  }, [music, handleAdd]);
  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.notEqual("$id", [id?.replace("custom", "") || ""]),
      Query.startsWith("link", "custom"),
      Query.equal("for", [localStorage.getItem("uid") || "default"]),
      Query.limit(999),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data, isLoading, refetch } = useQuery(
    "savedPlaylistToAdd",
    loadSavedPlaylist,
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const handlePlaylist = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.style.display = "none";
    link.target = "_blank";
    link.href = `${downloadApi}${music.youtubeId}&file=${music.title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [music.youtubeId, music.title]);
  const handleDelete = useCallback(async () => {
    const ok = confirm("Are you sure you want to delete");
    if (ok && reload) {
      if (like) {
        await db.deleteDocument(DATABASE_ID, LIKE_SONG, music.$id || "");
        reload();
      } else {
        await db.deleteDocument(DATABASE_ID, ADD_TO_LIBRARY, music.$id || "");
        reload();
      }
    }
  }, [music, like, reload]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="m-0 p-0">
        <BiDotsHorizontalRounded className="h-6 w-6 text-zinc-300" />
        {!underline && (
          <div className="h-[.05rem] w-[8vw] bg-zinc-300/10 mt-[1.1rem] -ml-2"></div>
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
          onClick={handleDownload}
          className="flex items-center justify-between space-x-2"
        >
          <p className="text-base">Download</p>
          <LiaDownloadSolid className="h-5 w-5" />
        </DropdownMenuItem>

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
