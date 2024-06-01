import * as React from "react";
import { useNavigate } from "react-router-dom";
import { playlistSongs } from "@/Interface";
import { useQuery } from "react-query";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { SuggestionSearchApi, streamApi } from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { SetFeed } from "@/Store/Player";
import { useInView } from "react-intersection-observer";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import FeedSong from "./FeedSongs";
import { Skeleton } from "../ui/skeleton";
import { AspectRatio } from "../ui/aspect-ratio";
import AI from "@/AI/AI";

export function ListenNowComp() {
  const feed = useSelector((state: RootState) => state.musicReducer.Feed);

  const music = useSelector((state: RootState) => state.musicReducer.Feed);

  const [report, setReport] = React.useState<boolean>();
  const dispatch = useDispatch();

  const PlaybackCheck = async () => {
    const res = await axios.get(streamApi);
    return res.data;
  };

  const { data, isError, refetch } = useQuery("playbackCheck", PlaybackCheck, {
    staleTime: Infinity,
    retry: 0,
  });

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
        playlist.length > 0
          ? playlist[currentIndex].youtubeId.startsWith("https")
            ? "sem" +
              playlist[currentIndex].title +
              " " +
              playlist[currentIndex].artists[0].name
            : playlist[currentIndex].youtubeId
          : "rnd"
      }`
    );
    if (q.data.length > 0) {
      localStorage.setItem("feed", JSON.stringify(q.data.slice(0, 10)));
      dispatch(SetFeed(q.data.slice(0, 10)));
    }
    return q.data.slice(0, 10) as playlistSongs[];
  };

  const { refetch: refetchFeed } = useQuery<playlistSongs[]>(["Feed"], query, {
    enabled: false,
    staleTime: Infinity,
    onSuccess(data) {
      if (data.length == 0) refetchFeed();
    },
  });

  React.useEffect(() => {
    const savedFeed = localStorage.getItem("feed");
    if (savedFeed) {
      const parsed = JSON.parse(savedFeed);
      dispatch(SetFeed(parsed));
    } else {
      refetchFeed();
    }
  }, [dispatch, refetchFeed]);
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const [fetch, setFetch] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (inView && music && music.length > 0 && fetch) {
      setFetch(false);
      axios
        .get(
          `${SuggestionSearchApi}${
            music[Math.floor(Math.random() * music.length)].youtubeId
          }`
        )
        .then((q) => {
          const next = [...music, ...q.data];
          const uniqueArray = [...new Set(next)];
          dispatch(SetFeed(uniqueArray));
          setFetch(true);
        });
    }
  }, [inView, music, dispatch, fetch]);
  const handleRefresh = React.useCallback(async () => {
    await refetchFeed();
  }, [refetchFeed]);

  return (
    <>
      {data && data !== "url not provided" && (
        <div className=" fixed  w-full px-4 z-10">
          <Alert className=" hidden  bg-red-500 top-4 border-none">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <p>
                Restart app to connect to another server, or wait until it's
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
        <div className=" fixed   w-full px-4 z-10 ">
          <Alert className="  bg-red-500 top-4 border-none">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <p>
                Restart app to connect to another server, or wait until it's
                back online.{" "}
                <span onClick={handleReport}>
                  {report ? "@check again" : "@send report"}
                </span>
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <AI />
      {feed.length == 0 && (
        <div className="px-4 pb-44 space-y-[5rem] animate-fade-up">
          <AspectRatio ratio={4 / 4}>
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-[100%] rounded-lg" />
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-5 mt-2 w-52 rounded-lg" />
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-5 mt-2 w-44 rounded-lg" />
          </AspectRatio>

          <AspectRatio ratio={4 / 3}>
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-[100%] rounded-lg" />
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-5 mt-2 w-52 rounded-lg" />
            <Skeleton className="flex  animate-fade-up flex-col py-2 space-y-2 h-5 mt-2 w-44 rounded-lg" />
          </AspectRatio>
        </div>
      )}

      {feed && (
        <ReactPullToRefresh
          pullingContent={""}
          onRefresh={handleRefresh}
          className="px-4 pb-60"
        >
          <>
            {music.map((r, i) => (
              <div key={r.youtubeId + i} ref={ref}>
                <FeedSong
                  fromSearch={true}
                  artistId={r?.artists[0]?.id || ""}
                  audio={r.youtubeId}
                  artistName={r?.artists[0]?.name || "unknown"}
                  id={r.youtubeId}
                  title={r?.title || "unknown"}
                  artist={r?.artists}
                  cover={r.thumbnailUrl}
                />
              </div>
            ))}
          </>
        </ReactPullToRefresh>
      )}
    </>
  );
}

const ListenNow = React.memo(ListenNowComp);
export default ListenNow;
