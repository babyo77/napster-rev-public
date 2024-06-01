import { useCallback } from "react";

import { playlistSongs, savedPlaylist } from "@/Interface";
import { useDispatch, useSelector } from "react-redux";
import { setNextQueue, setPlaylist } from "@/Store/Player";
import { RootState } from "@/Store/Store";

import { v4 as uuidv4 } from "uuid";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  EDITS,
  ID,
  LIKE_SONG,
  PLAYLIST_COLLECTION_ID,
  TUNEBOX,
  db,
} from "@/appwrite/appwriteConfig";
import { Permission, Query, Role } from "appwrite";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
  useQueryClient,
} from "react-query";

import { toast } from "../ui/use-toast";
import { ReelsStreamApi } from "@/API/api";
export default function useOptions({
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
    toast({
      description: "Added to Queue",
    });
  }, [music, dispatch, playlist, currentIndex, nextQueue]);
  const q = useQueryClient();

  const handleAdd = useCallback(
    async (playlistId: string, show?: boolean) => {
      try {
        const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
          Query.orderDesc("$createdAt"),
          Query.equal("for", [uid || "default"]),
          Query.equal("youtubeId", [music.youtubeId]),
          Query.equal("playlistId", [playlistId]),
          Query.limit(500),
        ]);

        if (r.total > 0) {
          toast({
            description: "Already in playlist",
          });
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
          ).then(async () => {
            try {
              await q.refetchQueries(["playlist", "custom" + playlistId]);
            } catch (error) {
              console.log(error);
            }

            if (show) {
              toast({
                description: "Added to playlist",
              });
            } else {
              try {
                await q.refetchQueries("savedPlaylist");
              } catch (error) {
                console.log(error);
              }
              toast({
                title: "Added to new Library",
              });
            }
          });
        }
      } catch (error) {
        toast({
          description: "error adding to playlist",
        });
      }
    },
    [music, uid, q]
  );

  const handleLibrary = useCallback(async () => {
    try {
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
        ).then(async (d) => {
          handleAdd(d.$id);
        });
      }
    } catch (error) {
      toast({
        description: "error adding to new Library",
      });
    }
  }, [music, handleAdd, uid]);
  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      // Query.notEqual("$id", [id?.replace("custom", "") || ""]),
      Query.startsWith("link", "custom"),
      Query.equal("for", [uid || "default"]),
      Query.limit(500),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data, isLoading, refetch } = useQuery(
    "savedPlaylistToAdd",
    loadSavedPlaylist,
    {
      enabled: false,
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const handlePlaylist = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    try {
      const ok = confirm("Are you sure you want to delete");
      if (ok && reload) {
        toast({
          description: "Removed",
        });
        if (edits) {
          await q.setQueryData(["editSongDetails", id], (data) =>
            (data as unknown as playlistSongs[]).filter(
              (playlist) => playlist.$id && playlist.$id !== music.$id
            )
          );
          await db.deleteDocument(DATABASE_ID, EDITS, music.$id || "");
          reload();
          return;
        } else if (tunebox) {
          await q.setQueryData(["tuneboxSongsDetails", id], (data) =>
            (data as unknown as playlistSongs[]).filter(
              (playlist) => playlist.$id && playlist.$id !== music.$id
            )
          );
          await db.deleteDocument(DATABASE_ID, TUNEBOX, music.$id || "");
          reload();
          return;
        } else if (like) {
          await q.setQueryData(["likedSongsDetails", id], (data) =>
            (data as unknown as playlistSongs[]).filter(
              (playlist) => playlist.$id && playlist.$id !== music.$id
            )
          );
          await db.deleteDocument(DATABASE_ID, LIKE_SONG, music.$id || "");
          reload();
        } else {
          await q.setQueryData(["playlist", id], (data) =>
            (data as unknown as playlistSongs[]).filter(
              (playlist) => playlist.$id && playlist.$id !== music.$id
            )
          );
          await db.deleteDocument(DATABASE_ID, ADD_TO_LIBRARY, music.$id || "");
          reload();
        }
      }
    } catch (error) {
      toast({
        //@ts-expect-error:message
        title: error.message,
      });
    }
  }, [music, like, reload, edits, tunebox, q, id]);
  const handleShare = useCallback(() => {
    navigator.share({
      url: !music.youtubeId.startsWith(ReelsStreamApi)
        ? `${window.location.origin}/track/${music.youtubeId}`
        : music.youtubeId.replace(
            ReelsStreamApi,
            window.location.origin + "/share-play"
          ),
    });
  }, [music]);
  return {
    handleAdd,
    handleDelete,
    handleLibrary,
    handlePlaylist,
    handleQueue,
    handleShare,
    data,
    isLoading,
    uid,
  };
}
