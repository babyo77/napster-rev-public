import ProgressBar from "@ramonak/react-progress-bar";
import { Alert, AlertDescription } from "./components/ui/alert";
import { useDispatch } from "react-redux";
import { playlistSongs, spotifyTransfer } from "./Interface";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "./appwrite/appwriteConfig";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { SearchOneTrackApi } from "./API/api";
import axios from "axios";
import { setSpotifyTrack } from "./Store/Player";
import { useQueryClient } from "react-query";

export default function TransferHeader({ data }: { data: spotifyTransfer }) {
  const query = useQueryClient();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (data && data.tracks.length > 0) {
      db.createDocument(DATABASE_ID, PLAYLIST_COLLECTION_ID, ID.unique(), {
        name: data.creator,
        creator: data.name,
        link: "custom" + v4(),
        image: data.image,
        for: localStorage.getItem("uid"),
      }).then(async (m) => {
        let i = 0;
        const processTrack = async () => {
          if (i < data.tracks.length) {
            try {
              const res = await axios.get(
                `${SearchOneTrackApi}${data.tracks[i].track}`
              );
              const track = res.data as playlistSongs;
              await db.createDocument(
                DATABASE_ID,
                ADD_TO_LIBRARY,
                ID.unique(),
                {
                  index: i,
                  for: localStorage.getItem("uid"),
                  youtubeId: track.youtubeId,
                  artists: [track.artists[0].id, track.artists[0].name],
                  title: track.title,
                  thumbnailUrl: track.thumbnailUrl,
                  playlistId: m.$id,
                }
              );
            } catch (error) {
              console.log(error);
            }
            if (i == data.tracks.length - 1) {
              dispatch(setSpotifyTrack(null));
              query.refetchQueries("savedPlaylist");
              return;
            }
            setProgress(i + 1);
            i++;

            setTimeout(processTrack, 111);
          }
        };

        processTrack();
      });
    }
  }, [query, data, dispatch]);

  return (
    <>
      <div className=" fixed w-full px-2.5 z-40 animate-fade-down">
        <Alert className=" fade-in bg-zinc-900 top-3.5 border-none">
          <AlertDescription>
            <div className="flex w-full flex-col space-y-1.5 items-start">
              <p className="text-zinc-300   font-semibold text-xs animate-fade-right">
                {Math.floor((progress / data.tracks.length) * 100)}%
              </p>
              <ProgressBar
                className=" w-full border-none animate-fade-down"
                height="4px"
                isLabelVisible={false}
                bgColor="#1DD45F"
                maxCompleted={data.tracks.length || 0}
                completed={progress || 0}
              />
              <p className="text-zinc-300  font-semibold text-xs animate-fade-right">
                Transferred {progress}/{data.tracks.length || 0}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
