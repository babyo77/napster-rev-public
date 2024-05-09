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
import { useCallback } from "react";
import { playlistSongs, savedPlaylist } from "@/Interface";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoAddSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Permission, Query, Role } from "appwrite";
import { useQuery } from "react-query";
import Loader from "../Loaders/Loader";
import { LiaDownloadSolid } from "react-icons/lia";
import { downloadApi } from "@/API/api";
import ShareLyrics from "./Share";
import { RootState } from "@/Store/Store";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";

interface option extends DropdownMenuTriggerProps {
  id?: string;
  music: playlistSongs;
}
function Options({ music, id, ...props }: option) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const { toast } = useToast();

  const handleAdd = useCallback(
    async (playlistId: string, show?: boolean) => {
      if (uid) {
        const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
          Query.orderDesc("$createdAt"),
          Query.equal("for", [uid]),
          Query.equal("youtubeId", [music.youtubeId]),
          Query.equal("playlistId", [playlistId]),
          Query.limit(999),
        ]);

        if (r.total > 0) {
          return;
        }
        if (uid) {
          db.createDocument(
            DATABASE_ID,
            ADD_TO_LIBRARY,
            ID.unique(),
            {
              for: uid,
              youtubeId: music.youtubeId,
              artists: [music.artists[0].id, music.artists[0].name],
              title: music.title,
              thumbnailUrl: music.thumbnailUrl,
              playlistId: playlistId,
              index: r.total + 1,
            },
            [
              Permission.update(Role.user(uid)),
              Permission.delete(Role.user(uid)),
            ]
          ).then(() => {
            toast({
              title: "Added to playlist",
            });
            if (show) return;
          });
        }
      }
    },
    [music, uid, toast]
  );

  const handleLibrary = useCallback(async () => {
    if (uid) {
      db.createDocument(
        DATABASE_ID,
        PLAYLIST_COLLECTION_ID,
        ID.unique(),
        {
          name: music.title,
          creator: music.artists[0].name || "unknown",
          link: "custom" + uuidv4(),
          image: music.thumbnailUrl,
          for: uid,
        },
        [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
      ).then((d) => {
        handleAdd(d.$id);
        toast({
          title: "Added to new Library",
        });
      });
    }
  }, [music, handleAdd, uid, toast]);
  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.notEqual("$id", [id?.replace("custom", "") || ""]),
      Query.startsWith("link", "custom"),
      Query.equal("for", [uid || "default"]),
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
    link.href = music.youtubeId.startsWith("http")
      ? `${music.youtubeId}&file=${music.title}`
      : `${downloadApi}${music.youtubeId}&file=${music.title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [music.youtubeId, music.title]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
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
            <p className="text-base">Share Song</p>
            <ShareLyrics size className="h-3 w-3" />
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
        <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
        <DropdownMenuItem
          onClick={handleDownload}
          className="flex items-center justify-between space-x-2"
        >
          <p className="text-base">Download</p>
          <LiaDownloadSolid className="h-5 w-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Options;
