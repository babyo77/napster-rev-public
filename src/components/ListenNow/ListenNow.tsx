import * as React from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  DATABASE_ID,
  LISTEN_NOW_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { useNavigate } from "react-router-dom";

import { homePagePlaylist, playlistSongs } from "@/Interface";
import { useQuery } from "react-query";
import Artist from "./Artist";
import Charts from "./Charts";
import NewCharts from "./neewChart";
import { Query } from "appwrite";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Header from "../Header/Header";
import NapsterSuggested from "./NapsterSuggested";
import { SuggestionSearchApi, streamApi } from "@/API/api";
import Loader from "../Loaders/Loader";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { SetFeed } from "@/Store/Player";
import { useInView } from "react-intersection-observer";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import FeedSong from "./FeedSongs";

export function ListenNowComp() {
  const checked = useSelector(
    (state: RootState) => state.musicReducer.feedMode
  );

  const music = useSelector((state: RootState) => state.musicReducer.Feed);

  const [report, setReport] = React.useState<boolean>();
  const dispatch = useDispatch();

  const PlaybackCheck = async () => {
    const res = await axios.get(streamApi);
    return res.data;
  };

  const { data, isError, refetch } = useQuery("playbackCheck", PlaybackCheck, {
    refetchOnMount: false,
    staleTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const getChart = async () => {
    const q = await db.listDocuments(DATABASE_ID, LISTEN_NOW_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("type", ["playlist"]),
    ]);
    const data: homePagePlaylist[] =
      q.documents as unknown as homePagePlaylist[];
    return data;
  };

  const getArtist = async () => {
    const q = await db.listDocuments(DATABASE_ID, LISTEN_NOW_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.notEqual("type", ["playlist"]),
      Query.notEqual("type", ["napster"]),
    ]);
    const data: homePagePlaylist[] =
      q.documents as unknown as homePagePlaylist[];
    return data;
  };

  const getSuggested = async () => {
    const q = await db.listDocuments(DATABASE_ID, LISTEN_NOW_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("type", ["napster"]),
    ]);
    const data: homePagePlaylist[] =
      q.documents as unknown as homePagePlaylist[];
    return data;
  };

  const { data: chart } = useQuery<homePagePlaylist[]>("chart", getChart, {
    refetchOnMount: false,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });

  const { data: artist } = useQuery<homePagePlaylist[]>("artist", getArtist, {
    refetchOnMount: false,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });

  const { data: suggested } = useQuery<homePagePlaylist[]>(
    "suggested",
    getSuggested,
    {
      refetchOnMount: false,
      staleTime: 5 * 60000,
      refetchOnWindowFocus: false,
    }
  );

  const handleReport = () => {
    if (!report) {
      try {
        axios.get(
          `https://api.telegram.org/bot6178294062:AAEi72UVOgyEm_RhZqilO_ANsKcRcW06C-0/sendMessage?chat_id=5356614395&text=plyback server is down${streamApi}reported by ${localStorage.getItem(
            "uid"
          )}`
        );
        setReport(true);
      } catch (error) {
        console.log(error);
      }
    }
    refetch();
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    const online = navigator.onLine;
    if (!online) {
      navigate("/offline/");
    }
  }, [navigate]);

  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const query = async () => {
    const currentIndex = Math.floor(Math.random() * playlist.length);
    const q = await axios.get(
      `${SuggestionSearchApi}${
        playlist[currentIndex].youtubeId.startsWith("https")
          ? "sem" +
            playlist[currentIndex].title +
            " " +
            playlist[currentIndex].artists[0].name
          : playlist[currentIndex].youtubeId
      }`
    );
    dispatch(SetFeed(q.data));
    return q.data as playlistSongs[];
  };

  const { refetch: refetchFeed, isLoading } = useQuery<playlistSongs[]>(
    ["Feed"],
    query,
    {
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
    }
  );

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "500px",
  });

  React.useEffect(() => {
    if (inView && music && music.length > 0) {
      axios
        .get(`${SuggestionSearchApi}${music[music.length - 1].youtubeId}`)
        .then((q) => {
          dispatch(SetFeed(music.concat(q.data.slice(1, 7))));
        });
    }
  }, [inView, music, dispatch]);
  const handleRefresh = React.useCallback(async () => {
    await refetchFeed();
  }, [refetchFeed]);

  return (
    <>
      {data && data !== "url not provided" && (
        <div className=" fixed fade-in w-full px-4 z-10">
          <Alert className=" fade-in bg-red-500 top-4 border-none">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <p>
                Restart the app to connect to another server, or wait until it's
                back online.{" "}
                <span onClick={handleReport}>
                  {report ? "@check again" : "@send report"}
                </span>
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      {isError && (
        <div className=" fixed fade-in  w-full px-4 z-10 ">
          <Alert className=" fade-in bg-red-500 top-4 border-none">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <p>
                Restart the app to connect to another server, or wait until it's
                back online.{" "}
                <span onClick={handleReport}>
                  {report ? "@check again" : "@send report"}
                </span>
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Header title="Home" />

      {!chart && !artist && !suggested && !checked && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex   items-center space-x-2">
          <Loader />
        </div>
      )}
      {isLoading && checked && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex   items-center space-x-2">
          <Loader />
        </div>
      )}

      {checked && music && (
        <ReactPullToRefresh
          pullingContent={""}
          onRefresh={handleRefresh}
          className="px-4"
        >
          <>
            {music
              .filter(
                (r, i, s) =>
                  i === s.findIndex((t) => t.youtubeId == r.youtubeId)
              )
              .map((r, i) => (
                <div key={r.youtubeId + i} ref={ref}>
                  <FeedSong
                    fromSearch={true}
                    artistId={r.artists[0]?.id || ""}
                    audio={r.youtubeId}
                    artistName={r.artists[0].name}
                    id={r.youtubeId}
                    title={r.title}
                    artist={r.artists}
                    cover={r.thumbnailUrl}
                  />
                </div>
              ))}
          </>
        </ReactPullToRefresh>
      )}
      {!checked && (
        <div className="h-[80dvh] pb-28 overflow-scroll">
          {suggested && suggested.length > 0 && (
            <NapsterSuggested data={suggested} />
          )}
          {chart && artist && suggested && (
            <>
              <div className="">
                <Artist data={artist} />
                <Charts data={chart} />

                <NewCharts data={chart} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

const ListenNow = React.memo(ListenNowComp);
export default ListenNow;
