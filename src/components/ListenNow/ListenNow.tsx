import * as React from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  DATABASE_ID,
  LISTEN_NOW_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { homePagePlaylist } from "@/Interface";
import { useQuery } from "react-query";
import Artist from "./Artist";
import Charts from "./Charts";
import { Query } from "appwrite";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Header from "../Header/Header";
import NapsterSuggested from "./NapsterSuggested";

export function ListenNowComp() {
  const [report, setReport] = React.useState<boolean>();

  const PlaybackCheck = async () => {
    const res = await axios.get(
      "https://unconscious-elianora-babyo7.koyeb.app/"
    );
    return res.data;
  };

  const { data, isError, refetch } = useQuery("playbackCheck", PlaybackCheck, {
    refetchOnMount: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 0,
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
          "https://api.telegram.org/bot6178294062:AAEi72UVOgyEm_RhZqilO_ANsKcRcW06C-0/sendMessage?chat_id=5356614395&text=plyback server is down"
        );
        setReport(true);
      } catch (error) {
        console.log(error);
      }
    }
    refetch();
  };
  return (
    <>
      {data && data !== "url not provided" && (
        <div className=" fixed  w-full px-4">
          <Alert className=" fade-in bg-red-500 top-4 ">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <span>
                music will not play for a while{" "}
                <p onClick={handleReport}>
                  {report ? "@check again" : "@report here"}
                </p>
              </span>
            </AlertDescription>
          </Alert>
        </div>
      )}
      {isError && (
        <div className=" fixed  w-full px-4">
          <Alert className=" fade-in bg-red-500 top-4 ">
            <AlertTitle>Playback Server is Down !</AlertTitle>
            <AlertDescription>
              <p>
                music will not play for a while{" "}
                <span onClick={handleReport}>
                  {report ? "@check again" : "@report here"}
                </span>
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Header title="Listen Now" />

      {!chart && !artist && !suggested && (
        <>
          <div className="flex px-4  space-x-4 items-center w-full mt-3">
            <Skeleton className="w-[40vw] h-4 rounded-md bg-zinc-500" />
          </div>
          <div className="flex px-4 justify-center space-x-4 items-center w-full mt-5">
            <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
            <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
          </div>
          <div className="flex px-4  space-x-4 items-center w-full mt-5">
            <Skeleton className="w-[24vw] h-4 rounded-md bg-zinc-500" />
          </div>
          <div className="flex px-4 justify-center space-x-4 items-center w-full mt-5">
            <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
            <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
          </div>
          <div className="flex px-4  space-x-4 items-center w-full mt-5">
            <Skeleton className="w-[27vw] h-4 rounded-md bg-zinc-500" />
          </div>

          <div className="flex px-4  space-x-4 items-start w-full mt-5">
            <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
            <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
            <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
          </div>
        </>
      )}
      {chart && artist && suggested && (
        <>
          {suggested && suggested.length > 0 && (
            <NapsterSuggested data={suggested} />
          )}

          <Charts data={chart} />
          <Artist data={artist} />
        </>
      )}
    </>
  );
}

const ListenNow = React.memo(ListenNowComp);
export default ListenNow;
