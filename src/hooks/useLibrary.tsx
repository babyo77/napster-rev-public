import GetUserName from "./getUserName";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import axios from "axios";
import { SearchPlaylist, playlistSongs, savedPlaylist } from "@/Interface";
import {
  GetPlaylistHundredSongsApi,
  SearchPlaylistApi,
  SuggestionSearchApi,
  getPlaylistDetails,
} from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
  shuffle,
} from "@/Store/Player";
import { useCallback, useEffect, useState } from "react";
import { RootState } from "@/Store/Store";
import { Permission, Query, Role } from "appwrite";
import useImage from "./useImage";
function useLibrary({ id }: { id: string | undefined }) {
  const dispatch = useDispatch();

  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );

  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const isStandalone = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );

  const [isSaved, setIsSaved] = useState<savedPlaylist[]>();

  const loadSavedPlaylist = useCallback(async () => {
    if (id && id.startsWith("custom") && uid) {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("$id", [id.replace("custom", "") || "none"]),
      ]);
      const p = r.documents as unknown as savedPlaylist[];

      setIsSaved(p);

      if (p?.length > 0) return p;
      const q = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("$id", [
          uid.substring(uid?.length - 4) + id.replace("custom", "") || "none",
        ]),
      ]);
      const pp = q.documents as unknown as savedPlaylist[];
      setIsSaved(pp);

      return pp;
    } else {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("link", [id || "none"]),
      ]);
      const p = r.documents as unknown as savedPlaylist[];
      setIsSaved(p);
      return p;
    }
  }, [id, uid]);
  const { refetch: isSavedRefetch } = useQuery<savedPlaylist[]>(
    ["checkIfSaved", id],
    loadSavedPlaylist,
    {
      staleTime: 4000,
      keepPreviousData: true,
    }
  );

  const getPlaylist = useCallback(async () => {
    if (id && id.startsWith("custom") && uid) {
      const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
        Query.orderDesc("$createdAt"),
        Query.equal("playlistId", [
          id.replace("custom", "").replace(uid.substring(uid?.length - 4), ""),
        ]),
        Query.limit(50),
      ]);

      const modified = r.documents.map((doc) => ({
        $id: doc.$id,
        for: doc.for,
        youtubeId: doc.youtubeId,
        artists: [
          {
            id: doc.artists[0],
            name: doc.artists[1],
          },
        ],
        title: doc.title,
        thumbnailUrl: doc.thumbnailUrl,
      }));

      // setData(modified);
      return modified as unknown as playlistSongs[];
    } else {
      const list = await axios.get(`${GetPlaylistHundredSongsApi}${id}`);
      // setData(list.data);
      return list.data as playlistSongs[];
    }
  }, [id, uid]);

  const { isLoading, isError, data, refetch, isRefetching } = useQuery<
    playlistSongs[]
  >(["playlist", id], getPlaylist, {
    staleTime: Infinity,
    refetchOnMount: false,
    keepPreviousData: true,
  });

  const getPlaylistDetail = useCallback(async () => {
    if (id && id.startsWith("custom")) {
      const list = await db.getDocument(
        DATABASE_ID,
        PLAYLIST_COLLECTION_ID,
        id.replace("custom", "")
      );
      const t = [
        {
          title: list.creator,
          name: list.name,
          for: list.for,
        },
      ];

      return t as unknown as SearchPlaylist[];
    } else {
      const list = await axios.get(`${getPlaylistDetails}${id}`);
      return list.data as SearchPlaylist[];
    }
  }, [id]);

  const getPlaylistThumbnail = useCallback(async () => {
    if (id && id.startsWith("custom")) {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
        Query.equal("$id", [id.replace("custom", "")]),
        Query.limit(1),
      ]);

      const p = [
        {
          thumbnailUrl: r.documents[0].image,
        },
      ];

      return p as SearchPlaylist[];
    } else {
      const list = await axios.get(`${SearchPlaylistApi}${id}`);
      return list.data as SearchPlaylist[];
    }
  }, [id]);
  const {
    data: playlistThumbnail,
    isLoading: playlistThumbnailLoading,
    isError: playlistThumbnailError,
    refetch: playlistThumbnailRefetch,
    isRefetching: playlistThumbnailIsRefetching,
  } = useQuery<SearchPlaylist[]>(
    ["getPlaylistThumbnail", id],
    getPlaylistThumbnail,
    {
      refetchOnMount: false,
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const {
    data: pDetails,
    isLoading: pLoading,
    isError: pError,
    isRefetching: pIsRefetching,
  } = useQuery<SearchPlaylist[]>(["playlistDetails", id], getPlaylistDetail, {
    refetchOnMount: false,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  useEffect(() => {
    dispatch(setIsLikedSong(false));
  }, [dispatch, id]);
  const handleShufflePlay = useCallback(async () => {
    if (data) {
      dispatch(shuffle(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));
      if (data?.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id]);

  const getSuggestedSongs = async () => {
    const r = await axios.get(
      `${SuggestionSearchApi}${
        data && data[0]?.youtubeId?.startsWith("http")
          ? data[0].title
          : data && data[0]?.youtubeId
      }`
    );
    return data && data[0]?.youtubeId?.startsWith("http")
      ? [data[0], ...r.data]
      : (r.data as playlistSongs[]);
  };
  const { data: isSingle } = useQuery<playlistSongs[]>(
    ["songsSuggestion", data && data[0]?.youtubeId],
    getSuggestedSongs,
    {
      staleTime: 2 * 6000,
    }
  );

  const handlePlay = useCallback(() => {
    if (data) {
      if (isSingle) {
        dispatch(setPlaylist(isSingle));
      } else {
        dispatch(setPlaylist(data));
      }
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));

      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id, isSingle]);

  const handleSave = useCallback(async () => {
    if (uid && id) {
      setIsSaved([{ name: "", creator: "", for: "", link: "" }]);
      const q = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("$id", [id.replace("custom", "")]),
      ]);
      const isSaved = q.documents as unknown as savedPlaylist[];

      await db.createDocument(
        DATABASE_ID,
        PLAYLIST_COLLECTION_ID,
        uid.substring(uid?.length - 4) + isSaved[0].$id,
        {
          name: isSaved[0].name,
          creator: isSaved[0].creator,
          link: isSaved[0].link,
          for: uid,
          image: isSaved[0].image,
        },
        [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
      );
      isSavedRefetch();
    }
  }, [uid, isSavedRefetch, id]);
  const { user } = GetUserName({ id: pDetails && pDetails[0].for });
  const c2 = useImage(
    (playlistThumbnail &&
      playlistThumbnail[0]?.thumbnailUrl.replace("w120-h120", "w544-h544")) ||
      "/cache.jpg"
  );

  return {
    c2,
    user,
    pDetails,
    pLoading,
    pError,
    playingPlaylistUrl,
    playlist,
    playlistThumbnail,
    playlistThumbnailError,
    playlistThumbnailIsRefetching,
    playlistThumbnailLoading,
    playlistThumbnailRefetch,
    handleSave,
    handleShufflePlay,
    handlePlay,
    isPlaying,
    isRefetching,
    isSaved,
    isSavedRefetch,
    isStandalone,
    isLoading,
    pIsRefetching,
    isError,
    refetch,
    data,
    uid,
  };
}

export default useLibrary;
