import React, { useCallback, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GetImage, GetTrack, sendNotificationApi } from "@/API/api";
import { playlistSongs } from "@/Interface";
import { FiSend } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { DATABASE_ID, ID, TUNEBOX, db } from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { SetSentQue, setLimit } from "@/Store/Player";
import Loader from "../Loaders/Loader";

function TuneSongComp({
  item,
  audioRef,
  notifyId,
}: {
  notifyId: string | undefined | null;
  item: playlistSongs;
  audioRef: React.RefObject<HTMLAudioElement>;
}) {
  const { id } = useParams();
  const [sent, setSent] = useState<boolean>(false);
  const [send, setSend] = useState<boolean>(false);
  const limit = useSelector((state: RootState) => state.musicReducer.limit);
  const sentQue = useSelector((state: RootState) => state.musicReducer.sentQue);
  const dispatch = useDispatch();
  const handleSend = useCallback(() => {
    if (id) {
      setSend(true);
      if (limit !== 5) {
        dispatch(setLimit(limit + 1));
        db.createDocument(DATABASE_ID, TUNEBOX, ID.unique(), {
          youtubeId: item.youtubeId,
          title: item.title,
          artists: [
            item.artists[0]?.id || "unknown",
            item.artists[0]?.name || "unknown",
          ],
          thumbnailUrl: item.thumbnailUrl,
          for: id,
        })
          .then(async () => {
            if (notifyId) {
              await axios.get(`${sendNotificationApi}${notifyId}`);
            }
            setSent(true);
            setSend(true);
            dispatch(SetSentQue([...sentQue, item.youtubeId]));
            console.log(sentQue);
          })
          .catch(() => {
            setSend(false);
          });
      }
    }
  }, [id, item, limit, dispatch, sentQue, notifyId]);

  const image = async () => {
    const response = await axios.get(GetImage + item.thumbnailUrl, {
      responseType: "arraybuffer",
    });
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return URL.createObjectURL(blob);
  };

  const { data: c } = useQuery(["image", item.thumbnailUrl], image, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const [loader, setLoader] = useState<boolean>(false);

  const handlePlay = useCallback(async () => {
    setLoader(true);
    const res = await axios.get(
      `${GetTrack}${item?.title} ${item?.artists[0]?.name}`
    );
    if (res.status == 404) {
      setLoader(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = res.data;
      audioRef.current.play();
      setLoader(false);
    }
  }, [item, audioRef]);
  return (
    <div className="flex animate-fade-right py-1 px-[35dvw]  max-md:px-5 w-[100dvw] justify-between items-center">
      <div onClick={handlePlay} className="  flex space-x-2">
        <div className="h-14 w-14 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              src={c ? c : "/cache.jpg"}
              width="100%"
              height="100%"
              effect="blur"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/liked.webp")
              }
              className="rounded-md relative object-cover h-[100%] w-[100%]"
            />
            {loader && (
              <div className=" bg-black/40 w-full h-full top-0 flex  items-center justify-center absolute">
                <Loader />
              </div>
            )}
          </AspectRatio>
        </div>
        <div className="flex space-y-0.5 flex-col pl-1 text-start  ">
          <p
            className={`max-md:w-[55dvw] w-[20dvw] text-base  truncate font-semibold `}
          >
            {item?.title}
          </p>

          <p className="-mt-0.5 text-zinc-200 text-sm max-md:w-[50dvw] w-[17dvw]  truncate">
            {item.artists[0].name || "Unknown Artist"}
          </p>
        </div>
      </div>
      <div className=" -ml-1 text-xl">
        {sentQue.includes(item.youtubeId) ? (
          <p className="text-zinc-200">Sent!</p>
        ) : (
          <>
            {send ? (
              <>
                {sent ? (
                  <p className=" text-zinc-400">Sent</p>
                ) : (
                  <FiSend className="text-zinc-400" />
                )}
              </>
            ) : (
              <FiSend onClick={handleSend} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

const TuneSong = React.memo(TuneSongComp);
export default TuneSong;
