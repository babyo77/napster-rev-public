import { useCallback, useEffect, useState } from "react";
import App from "@/App";
import { Desktop } from "./Desktop";
import { useDispatch, useSelector } from "react-redux";
import {
  SetFeed,
  SetFeedMode,
  SetLastPlayed,
  SetPlaylistOrAlbum,
  SetQueue,
  SetReels,
  SetSeek,
  setCurrentIndex,
  setIsIphone,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
import Loader from "./Loaders/Loader";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  EDITS,
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
  ReelsApi,
  SuggestionSearchApi,
} from "@/API/api";
import { Query } from "appwrite";

function Check() {
  const dispatch = useDispatch();
  const [check, setCheck] = useState<boolean>(true);
  const [isStandalone, setIsStandalone] = useState<boolean>();
  const [graphic, setGraphic] = useState<boolean>();
  const [hardwareConcurrency, setHardwareConcurrency] = useState<number | null>(
    null
  );
  const [online, setOnline] = useState<boolean>();
  const [isiPad, setIsIpad] = useState<boolean>();
  const [isIPhone, setIphone] = useState<boolean>();
  const [isDesktop, setDesktop] = useState<boolean>();

  useEffect(() => {
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    const isDesktop = window.innerWidth > 786;
    const isiPad = navigator.userAgent.match(/iPad/i) !== null;
    const online = navigator.onLine;
    setIsIpad(isiPad);
    setOnline(online);
    setDesktop(isDesktop);
    setIphone(isIPhone);
  }, []);

  const isStandaloneWep = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const checkGpuCapabilities = () => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : null;

      return renderer;
    }

    return null;
  };

  const getLastPlayed = async () => {
    const lastPlayed = await db.getDocument(
      DATABASE_ID,
      LAST_PLAYED,
      uid || ""
    );
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
        Query.equal("for", [localStorage.getItem("uid") || ""]),
        Query.equal("playlistId", [data.playlisturl.replace("custom", "")]),
        Query.limit(999),
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
      if (data.index > modified.length) {
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
      Query.equal("for", [localStorage.getItem("uid") || ""]),
      Query.limit(999),
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
      if (data.index > modified.length) {
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
      Query.equal("for", [localStorage.getItem("uid") || ""]),
      Query.limit(999),
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
      if (data.index > modified.length) {
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
      Query.equal("for", [localStorage.getItem("uid") || ""]),
      Query.limit(999),
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
      if (data.index > modified.length) {
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

  const query = async () => {
    const currentIndex = Math.floor(Math.random() * playlist.length);
    const q = await axios.get(
      `${SuggestionSearchApi}${
        playlist[currentIndex]?.youtubeId.startsWith("https")
          ? "sem" +
            playlist[currentIndex].title +
            " " +
            playlist[currentIndex].artists[0].name
          : playlist[currentIndex]?.youtubeId || "rnd"
      }`
    );
    dispatch(SetFeed(q.data));
    return q.data as playlistSongs[];
  };

  const { refetch: refetchFeed } = useQuery<playlistSongs[]>(["Feed"], query, {
    refetchOnWindowFocus: false,
    staleTime: 60 * 60000,
    refetchOnMount: false,

    onError() {
      refetchFeed();
    },
    onSuccess(data) {
      data.length == 0 && refetchFeed();
      data[0].youtubeId == null && refetchFeed();
    },
  });

  const getReels = useCallback(async () => {
    const rnDno = Math.floor(Math.random() * playlist.length - 1);
    const r = await axios.get(
      `${ReelsApi}${
        playlist[rnDno]?.title.replace("/", "") +
        " " +
        playlist[rnDno]?.artists[0]?.name.replace("/", "")
      }`
    );

    dispatch(SetReels(r.data));
    return r.data as playlistSongs[];
  }, [dispatch, playlist]);

  const { status } = useQuery<playlistSongs[]>(["reels"], getReels, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const music = useSelector((state: RootState) => state.musicReducer.music);

  useEffect(() => {
    if (data && uid && online) {
      dispatch(SetFeedMode(true));
      dispatch(SetLastPlayed(true));
      dispatch(setPlayingPlaylistUrl(data.playlisturl));
      dispatch(SetPlaylistOrAlbum(data.navigator));
      dispatch(setCurrentIndex(data.index));
      dispatch(SetSeek(data.seek));

      if (data.navigator == "library") {
        refetch();
      }
      if (data.navigator == "album") {
        album();
      }
      if (data.navigator == "liked") {
        likedSong();
      }
      if (data.navigator == "edits") {
        editSong();
      }
      if (data.navigator == "tunebox") {
        tuneboxSong();
      }
      if (data.navigator == "suggested") {
        dispatch(setCurrentIndex(0));
        suggested();
      }
    } else {
      dispatch(SetFeedMode(true));
    }
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const hardwareConcurrency = navigator.hardwareConcurrency || null;
    dispatch(setIsIphone(isStandalone));
    setHardwareConcurrency(hardwareConcurrency);
    setIsStandalone(isStandalone);
    setGraphic(checkGpuCapabilities());
    setCheck(false);
  }, [
    dispatch,
    data,
    editSong,
    refetch,
    likedSong,
    suggested,
    tuneboxSong,
    album,
    music,
    uid,
    online,
  ]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    if (playlist.length == 1 && online) {
      axios.get(`${SuggestionSearchApi}${data?.curentsongid}`).then((s) => {
        dispatch(setPlaylist(s.data));
        dispatch(SetQueue(s.data));
      });
    }
  }, [playlist, data, dispatch, online]);

  if (isDesktop || isiPad) {
    return <Desktop />;
  }
  if (isStandalone) {
    return <App />;
  }
  if (
    !isStandaloneWep &&
    hardwareConcurrency &&
    hardwareConcurrency >= 4 &&
    graphic
  ) {
    return <App />;
  }

  return (
    <>
      {check && online && !data && !playlistSongs ? (
        <div className="load flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <>{isIPhone ? <Desktop /> : <Desktop />}</>
      )}
    </>
  );
}

export default Check;
