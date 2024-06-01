import { ReelsStreamApi } from "@/API/api";
import { playlistSongs } from "@/Interface";
import useFormatDuration from "@/hooks/formatDuration";
import useImage from "@/hooks/useImage";
import socket from "@/socket";
import User from "@/user/User";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import ProgressBar from "@ramonak/react-progress-bar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LiveListening({
  app,
  id,
  embed,
  user,
}: {
  embed?: boolean;
  app?: boolean | undefined;
  id: string | undefined;
  user: User[] | undefined;
}) {
  const [listening, setListening] = useState<playlistSongs | null>();
  const [duration, setDuration] = useState<number>(0);
  const [Progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (app) return;
    socket.connect();
    function onConnect() {
      socket.emit("join", { id: id });
    }

    function setValue(data: playlistSongs) {
      if (data !== null) {
        setListening(data);
      }
    }

    function handleDuration(data: { id: string; duration: number }) {
      setDuration(data.duration);
    }
    function handleProgress(data: { id: string; progress: number }) {
      setProgress(data.progress);
    }

    socket.on("connect", onConnect);
    socket.on("message", setValue);
    socket.on("duration", handleDuration);
    socket.on("progress", handleProgress);
    return () => {
      socket.off("progress", handleProgress);
      socket.off("duration", handleDuration);
      socket.off("message", setValue);
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, [id, app]);

  const c = useImage(listening?.thumbnailUrl || "");

  const { formatDuration } = useFormatDuration();

  return (
    <>
      {user && !app && !embed && (
        <h2 className="px-5 mt-1 mb-2.5 animate-fade-right font-semibold leading-tight text-lg">
          {listening && "Listening To"}
        </h2>
      )}
      {/* <div className=" absolute z-30  tracking-tight right-2 text-[.5rem] text-zinc-200 leading-tight top-2">
        <p>Embed Napster </p>
      </div> */}
      {user && !app && (
        <div
          className={`flex border bg-zinc-100/5 space-x-2   overflow-hidden animate-fade-right items-center justify-between ${
            embed ? "" : "mx-3.5 mb-3 rounded-lg"
          } py-2.5  px-2.5 `}
        >
          <div className="flex w-full animate-fade-right items-center space-x-2">
            <Link
              target={embed ? "_blank" : "_self"}
              to={`/track/${
                listening && listening?.youtubeId?.replace(ReelsStreamApi, "")
              }`}
            >
              <div
                className={`overflow-hidden ${
                  embed ? "h-14  w-14  rounded-sm" : " h-16 w-16  rounded-md"
                } `}
              >
                <AspectRatio ratio={1 / 1}>
                  <img
                    height="100%"
                    width="100%"
                    src={c ? c : "/cache.jpg"}
                    alt="Image"
                    className={` ${
                      embed ? "rounded-sm " : "rounded-md"
                    } object-cover w-[100%] h-[100%]`}
                  />
                </AspectRatio>
              </div>
            </Link>
            <div
              style={{ color: "white" }}
              className="flex flex-col w-full  text-xl text-start"
            >
              <Link
                target={embed ? "_blank" : "_self"}
                to={`/track/${
                  listening && listening?.youtubeId?.replace(ReelsStreamApi, "")
                }`}
              >
                <p
                  className={`w-[69dvw] leading-tight    ${
                    embed ? "text-xs font-medium" : " text-lg font-semibold"
                  } truncate`}
                >
                  {listening?.title || "Not listening"}
                </p>
              </Link>
              <div
                style={{ color: "white" }}
                className="flex  items-center space-x-1"
              >
                <Link
                  target={embed ? "_blank" : "_self"}
                  to={`/artist/${
                    listening?.artists && listening?.artists[0]?.id
                  }`}
                >
                  <p
                    className={` ${
                      embed ? "text-[.6rem]" : "text-xs"
                    }  leading-tight truncate  max-w-[65vw]  font-normal  text-zinc-200`}
                  >
                    {(listening?.artists && listening?.artists[0]?.name) ||
                      (listening?.artists as unknown as string) ||
                      ""}
                  </p>
                </Link>
              </div>
              <div
                style={{ color: "white" }}
                className="flex  items-center space-x-1"
              ></div>
              {listening && (
                <>
                  <div className="w-full -mt-0.5">
                    <ProgressBar
                      className=" mt-1.5 w-full rounded-lg border-none "
                      height="3px"
                      animateOnRender={false}
                      transitionDuration="0"
                      barContainerClassName="bg-zinc-700  rounded-lg"
                      isLabelVisible={false}
                      bgColor={"#7d7d7d"}
                      maxCompleted={duration}
                      completed={Progress}
                    />
                  </div>
                  <div className=" flex w-full">
                    <p className=" flex items-center w-full font-normal text-zinc-400 justify-between text-[.58rem] -mt-1 -mb-2.5">
                      <span>{formatDuration(Progress || 0)}</span>
                      <span>{formatDuration(duration || 0)}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveListening;
