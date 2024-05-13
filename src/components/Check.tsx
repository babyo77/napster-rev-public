import { useCallback, useEffect, useState } from "react";
import App from "@/App";
import { Desktop } from "./Desktop";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  SetQueue,
  Setuid,
  setCurrentIndex,
  setIsIphone,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
import Loader from "./Loaders/Loader";
import authService, {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  EDITS,
  INSIGHTS,
  LAST_PLAYED,
  LIKE_SONG,
  TUNEBOX,
  db,
} from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import { AlbumSongs, lastPlayed, likedSongs, playlistSongs } from "@/Interface";
import axios from "axios";
import {
  GetAlbumSongs,
  GetPlaylistHundredSongsApi,
  SuggestionSearchApi,
  streamApi,
} from "@/API/api";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import useSaved from "@/hooks/saved";

function Check() {
  const dispatch = useDispatch();
  const [check, setCheck] = useState<boolean>(true);
  const [isStandalone, setIsStandalone] = useState<boolean>(true);

  const [online, setOnline] = useState<boolean>();
  const [isiPad, setIsIpad] = useState<boolean>();
  const [isDesktop, setDesktop] = useState<boolean>();

  useEffect(() => {
    const isDesktop = window.innerWidth > 786;
    const isiPad = navigator.userAgent.match(/iPad/i) !== null;
    const online = navigator.onLine;
    setIsIpad(isiPad);
    setOnline(online);
    setDesktop(isDesktop);
  }, []);

  const isStandaloneWep = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const [lastPlayed, setLastPlayed] = useState(false);
  const getLastPlayed = async () => {
    const lastPlayed = await db.getDocument(
      DATABASE_ID,
      LAST_PLAYED,
      uid || ""
    );
    if (lastPlayed) {
      setLastPlayed(false);
    }
    return lastPlayed as unknown as lastPlayed;
  };

  const { data } = useQuery<lastPlayed>("lastPlayedSongs", getLastPlayed, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const getPlaylist = async () => {
    if (data && data.playlisturl.startsWith("custom")) {
      const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
        Query.orderDesc("$createdAt"),
        Query.equal("for", [uid || ""]),
        Query.equal("playlistId", [data.playlisturl.replace("custom", "")]),
        Query.limit(500),
      ]);
      const modified = r.documents.map((doc) => ({
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

      const s = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);
      if (data.index > modified.length - 1) {
        dispatch(setCurrentIndex(0));
      }
      if (data?.index !== 0) {
        dispatch(setPlaylist(modified));
      } else {
        if (s.data[0].youtubeId == data.curentsongid) {
          const n = modified.slice(1);
          dispatch(setPlaylist([s.data[0], ...n]));
        } else {
          dispatch(setPlaylist([s.data[0], ...modified]));
        }
      }
      if (modified.length == 0) {
        dispatch(setCurrentIndex(0));
        dispatch(SetPlaylistOrAlbum("suggested"));
        dispatch(setPlaylist(s.data));
      }
      return modified as playlistSongs[];
    } else {
      const list = await axios.get(
        `${GetPlaylistHundredSongsApi}${data?.playlisturl}`
      );

      const r = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);
      if (data?.index !== 0) {
        dispatch(setPlaylist(list.data));
      } else {
        if (r.data[0].youtubeId == data.curentsongid) {
          const n = list.data.slice(1);
          dispatch(setPlaylist([r.data[0], ...n]));
        } else {
          dispatch(setPlaylist([r.data[0], ...list.data]));
        }
      }

      return list.data as playlistSongs[];
    }
  };
  const getAlbum = async () => {
    if (data) {
      const list = await axios.get(`${GetAlbumSongs}${data?.playlisturl}`);
      const r = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);

      if (data.index !== 0) {
        dispatch(setPlaylist(list.data));
      } else {
        if (r.data[0].youtubeId == data.curentsongid) {
          const n = list.data.slice(1);
          dispatch(setPlaylist([r.data[0], ...n]));
        } else {
          dispatch(setPlaylist([r.data[0], ...list.data]));
        }
      }

      return list.data as AlbumSongs[];
    } else {
      return [];
    }
  };

  const { refetch, data: playlistSongs } = useQuery<playlistSongs[]>(
    ["playlist", data?.playlisturl],
    getPlaylist,
    {
      retry: 5,
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );
  const { refetch: album } = useQuery<AlbumSongs[]>(
    ["albumSongs", data?.playlisturl],
    getAlbum,
    {
      retry: 5,
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  const getPlaylistDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, LIKE_SONG, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(500),
    ]);
    const s = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);
    const modified = r.documents.map((doc) => ({
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

    if (data) {
      if (data.index > modified.length - 1) {
        dispatch(setCurrentIndex(0));
      }
      if (data.index !== 0) {
        dispatch(setPlaylist(modified));
      } else {
        if (s.data[0].youtubeId == data.curentsongid) {
          const n = modified.slice(1);

          dispatch(setPlaylist([s.data[0], ...n]));
        } else {
          dispatch(setPlaylist([s.data[0], ...modified]));
        }
      }
    }
    return modified as unknown as likedSongs[];
  };
  const getEditDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, EDITS, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(500),
    ]);

    const modified = r.documents.map((doc) => ({
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
    if (data) {
      if (data.index > modified.length - 1) {
        dispatch(setCurrentIndex(0));
      }
      if (data.index !== 0) {
        dispatch(setPlaylist(modified));
      } else {
        dispatch(setPlaylist([...modified]));
      }
    }
    return modified as unknown as likedSongs[];
  };

  const getTuneBoxDetails = async () => {
    const r = await db.listDocuments(DATABASE_ID, TUNEBOX, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(500),
    ]);
    const s = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);
    const modified = r.documents.map((doc) => ({
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
    if (data) {
      if (data.index > modified.length - 1) {
        dispatch(setCurrentIndex(0));
      }
      if (data.index !== 0) {
        dispatch(setPlaylist(modified));
      } else {
        if (s.data[0].youtubeId == data.curentsongid) {
          const n = modified.slice(1);

          dispatch(setPlaylist([s.data[0], ...n]));
        } else {
          dispatch(setPlaylist([s.data[0], ...modified]));
        }
      }
    }
    return modified as unknown as likedSongs[];
  };

  const { refetch: likedSong } = useQuery<likedSongs[]>(
    ["likedSongsDetailsP", data?.playlisturl],
    getPlaylistDetails,
    {
      retry: 5,
      enabled: false,
      refetchOnMount: false,
      staleTime: 1000,
      refetchOnWindowFocus: false,
    }
  );
  const { refetch: editSong } = useQuery<likedSongs[]>(
    ["editSongsDetailsM", data?.playlisturl],
    getEditDetails,
    {
      retry: 5,
      enabled: false,
      refetchOnMount: false,
      staleTime: 1000,
      refetchOnWindowFocus: false,
    }
  );
  const { refetch: tuneboxSong } = useQuery<likedSongs[]>(
    ["tuneboxSongsDetailsM", data?.playlisturl],
    getTuneBoxDetails,
    {
      retry: 5,
      enabled: false,
      refetchOnMount: false,
      staleTime: 1000,
      refetchOnWindowFocus: false,
    }
  );

  const getSuggestedSongs = async () => {
    const r = await axios.get(`${SuggestionSearchApi}${data?.curentsongid}`);
    dispatch(setPlaylist(r.data));

    return r.data as playlistSongs[];
  };

  const { refetch: suggested } = useQuery<playlistSongs[]>(
    ["suggestedSongs", data?.curentsongid],
    getSuggestedSongs,
    {
      retry: 5,
      enabled: false,
      refetchOnMount: false,
      staleTime: 5 * 6000,
      refetchOnWindowFocus: false,
    }
  );
  const playlist = useSelector((state: RootState) => state.musicReducer.queue);

  const loadRecentSearch = async () => {
    const r = await db.listDocuments(DATABASE_ID, INSIGHTS, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(11),
    ]);
    const p = r.documents as unknown as likedSongs[];
    return p;
  };
  const { status: RecentSearch } = useQuery<likedSongs[]>(
    "recentSearch",
    loadRecentSearch,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  useSaved();

  const setData = useCallback(() => {
    if (data && uid && online) {
      dispatch(setPlayingPlaylistUrl(data.playlisturl));
      dispatch(SetPlaylistOrAlbum(data.navigator));
      dispatch(setCurrentIndex(data.index));

      if (data.navigator == "library") {
        refetch();
      } else if (data.navigator == "playlist") {
        refetch();
      } else if (data.navigator == "playlists") {
        refetch();
      } else if (data.navigator == "album") {
        album();
      } else if (data.navigator == "liked") {
        likedSong();
      } else if (data.navigator == "edits") {
        editSong();
      } else if (data.navigator == "tunebox") {
        tuneboxSong();
      } else if (data.navigator == "suggested") {
        dispatch(setCurrentIndex(0));
        suggested();
      }
    }
  }, [
    uid,
    online,
    dispatch,
    data,
    editSong,
    refetch,
    likedSong,
    suggested,
    tuneboxSong,
    album,
  ]);
  useEffect(() => {
    const divId = localStorage.getItem("$d_id_");
    if (!divId) {
      localStorage.setItem("$d_id_", v4());
    }
    if (divId && online) {
      const savedPlaylistData = localStorage.getItem(divId);
      const savedIndex = localStorage.getItem("$cu_idx");
      const savedNavigator = localStorage.getItem("_nv_nav");

      if (
        savedPlaylistData &&
        savedPlaylistData.length > 0 &&
        savedIndex &&
        savedIndex &&
        savedNavigator
      ) {
        const playlist = JSON.parse(savedPlaylistData);

        new Audio(`${streamApi}${playlist[0].youtubeId}`).load();
        dispatch(setPlaylist(playlist));
        dispatch(SetQueue(playlist));
        dispatch(SetPlaylistOrAlbum(savedNavigator));
        dispatch(setCurrentIndex(parseInt(savedIndex)));
      } else {
        setData();
      }
    } else {
      setData();
    }

    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    dispatch(setIsIphone(isStandalone));
    setIsStandalone(isStandalone);

    setCheck(false);
  }, [dispatch, online, setData]);
  useEffect(() => {
    if (data) {
      dispatch(setPlayingPlaylistUrl(data.playlisturl));
    }
  }, [data, dispatch]);
  useEffect(() => {
    try {
      authService.getAccount().then((account) => {
        if (account) {
          localStorage.setItem("uid", account.$id);
          dispatch(Setuid(account.$id));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    console.log(RecentSearch);
  }, [RecentSearch]);

  useEffect(() => {
    if (playlist.length == 1 && online) {
      axios.get(`${SuggestionSearchApi}${data?.curentsongid}`).then((s) => {
        dispatch(setPlaylist(s.data));
        dispatch(SetQueue(s.data));
      });
    }
  }, [playlist, data, dispatch, online]);
  const nav = useNavigate();
  useEffect(() => {
    if (online && !online) {
      nav("/offline/");
    }
  }, [nav, online]);
  if (isDesktop || isiPad) {
    return <Desktop />;
  }
  if (isStandalone) {
    return <App />;
  }
  if (!isStandaloneWep) {
    return <App />;
  }

  return (
    <>
      {check && online && !lastPlayed && !playlistSongs ? (
        <div className="load flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <Desktop />
      )}
    </>
  );
}

export default Check;
