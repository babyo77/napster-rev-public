import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

import "react-lazy-load-image-component/src/effects/blur.css";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { SearchOneTrackApi, TransferFromSpotifyApi } from "@/API/api";
import { useQuery, useQueryClient } from "react-query";
import Loader from "./Loaders/Loader";
import { playlistSongs, spotifyTransfer } from "@/Interface";
import ProgressBar from "@ramonak/react-progress-bar";

import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

function SpotifyTransfer({
  close,
}: {
  close: React.RefObject<HTMLButtonElement>;
}) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const [link, setLink] = useState<string>("");
  const [data, setData] = useState<spotifyTransfer | null>();
  const [complete, setComplete] = useState<boolean>(false);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  }, []);

  const query = useQueryClient();

  const getTracksInfo = async () => {
    const res = await axios.get(`${TransferFromSpotifyApi}${link}`);
    setData(res.data);
    return res.data as spotifyTransfer;
  };

  const { refetch, isError, isLoading } = useQuery<spotifyTransfer>(
    ["spotify", link],
    getTracksInfo,
    {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const Transfer = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      refetch();
    },
    [refetch]
  );
  useEffect(() => {
    if (data) {
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
              setData(null);
              setComplete(true);
              close.current?.click();
              navigate("/library/");
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
  }, [data, close, query, navigate]);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className=" rounded-xl  bg-green-600 py-2.5 mt-3  w-full text-base">
          Transfer from Spotify
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full border-none flex items-center flex-col justify-center h-dvh rounded-none">
        <AlertDialogHeader>
          {!data && !complete && !isLoading && (
            <DialogTitle className=" text-2xl font-semibold -mb-1">
              Paste Spotify Link
            </DialogTitle>
          )}
        </AlertDialogHeader>

        <div className=" min-h-20 w-full flex flex-col justify-center items-center">
          {isLoading && !isError ? (
            <Loader />
          ) : (
            <>
              {!data && !complete && (
                <form onSubmit={Transfer} className=" w-full space-y-2">
                  <Input
                    type="text"
                    required
                    placeholder="Paste playlist link or id"
                    value={link}
                    className="py-5 rounded-lg"
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    variant={"secondary"}
                    className=" w-full py-5  rounded-xl"
                  >
                    Transfer
                  </Button>
                </form>
              )}
              {!data && !complete && (
                <AlertDialogCancel className="w-full rounded-xl border-none mt-2 bg-none  p-0">
                  <Button
                    asChild
                    variant={"secondary"}
                    className=" w-full py-5 rounded-xl"
                  >
                    <p>Close</p>
                  </Button>
                </AlertDialogCancel>
              )}
            </>
          )}

          {data && data.tracks.length > 0 && (
            <div className="flex w-full flex-col space-y-3 items-center">
              <p className="text-zinc-300  font-semibold text-xl">
                {Math.floor((progress / data.tracks.length) * 100)}%
              </p>

              <ProgressBar
                className=" w-full border-none"
                height="7px"
                isLabelVisible={false}
                bgColor="#1DD45F"
                maxCompleted={data.tracks.length}
                completed={progress || 0}
              />
              <p className="text-zinc-300  font-semibold text-lg">
                Transferred {progress}/{data.tracks.length}
              </p>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { SpotifyTransfer };
