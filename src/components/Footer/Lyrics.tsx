import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import Options from "./Options";
import axios from "axios";
import { GetLyrics } from "@/API/api";
import { useQuery } from "react-query";
import Loader from "../Loaders/Loader";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import { transliterate as tr } from "transliteration";
import React, {
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ShareLyrics from "./Share";
// import { prominent } from "color.js";

function LyricsComp({
  closeRef,
  music,
}: {
  closeRef: RefObject<HTMLButtonElement>;
  music: HTMLAudioElement | undefined;
}) {
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );
  const progress = useSelector(
    (state: RootState) => state.musicReducer.progress
  );
  const duration = useSelector(
    (state: RootState) => state.musicReducer.duration
  );

  const formatDuration = useCallback((seconds: number | "--:--") => {
    if (seconds == "--:--") return seconds;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }, []);

  const getLyrics = useCallback(async () => {
    const query = `${playlist[currentIndex].title
      .replace("(sped up nightcore)", "sped up")
      .replace("/", "")} ${playlist[currentIndex].artists[0].name.replace(
      "/",
      ""
    )} `;

    // console.log(query.replace(/  +/g, " "));

    const lyrics = await axios.get(
      `${GetLyrics}${query.replace(/  +/g, " ")}?d=${formatDuration(
        music?.duration || duration
      )}`
    );

    const lines = lyrics.data.lyrics.split("\n");

    const parsedLyrics = lines
      .map((line: string) => {
        const matches = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (matches) {
          const minutes = parseInt(matches[1]);
          const seconds = parseFloat(matches[2]);
          const lyrics = tr(matches[3].trim(), {
            replaceAfter: [["N", "n"]],
          });
          const time = minutes * 60 + seconds;
          return { time, lyrics };
        }
        return null;
      })
      .filter((line: string) => line !== null);

    return parsedLyrics as [{ time: number | string; lyrics: string }];
  }, [playlist, currentIndex, music, formatDuration, duration]);

  const { data: lyrics, isLoading } = useQuery<
    [{ time: number | string; lyrics: string }]
  >(["lyrics", playlist[currentIndex].youtubeId], getLyrics, {
    refetchOnWindowFocus: false,
    staleTime: 60 * 6000,
    refetchOnMount: false,
  });

  const lyricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lyricsRef.current) {
      const lines = Array.from(
        lyricsRef.current.children
      ) as HTMLParagraphElement[];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const time = parseFloat(line.dataset.time || "0");
        const nextTime = parseFloat(lines[i + 1]?.dataset.time || "0");

        if (
          (time as number | "--:--") <= progress &&
          (nextTime as number | "--:--") > progress
        ) {
          line.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  }, [progress]);

  const handleClick: MouseEventHandler<HTMLParagraphElement> = useCallback(
    (t) => {
      if (music) {
        music.currentTime = parseFloat(t.currentTarget.dataset.time || "0");
        if (music.paused) {
          music.play();
        }
      }
    },
    [music]
  );
  const [online, setOnline] = useState<boolean>();

  useEffect(() => {
    const online = !navigator.onLine;
    setOnline(online);
  }, []);
  return (
    <Drawer>
      <DrawerTrigger disabled={online}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0,0,256,256"
          className="h-7 w-7 m-0 p-0"
        >
          <g
            fillRule="nonzero"
            stroke="none"
            strokeWidth="1"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            strokeDasharray=""
            strokeDashoffset="0"
            fontFamily="none"
            fontWeight="none"
            fontSize="none"
            textAnchor="none"
            style={{ mixBlendMode: "normal" }}
            className={`${
              lyrics && lyrics.length > 0
                ? "fill-zinc-300 m-0 p-0"
                : "fill-zinc-500 m-0 p-0"
            } `}
          >
            <g transform="scale(8.53333,8.53333)">
              <path d="M5,3c-1.105,0 -2,0.895 -2,2v15c0,1.105 0.895,2 2,2h4v4c0,0.552 0.448,1 1,1c0.3377,0 0.62165,-0.17897 0.80273,-0.43555l0.01563,0.00586l3.43164,-4.57031h10.75c1.105,0 2,-0.895 2,-2v-15c0,-1.105 -0.895,-2 -2,-2zM11.5,9c1.381,0 2.5,1.119 2.5,2.5v0.5c0,2.214 -1.10041,4.26909 -2.94141,5.49609l-0.50391,0.33594l-1.10938,-1.66406l0.50391,-0.33594c0.698,-0.465 1.23684,-1.10394 1.58984,-1.83594c-0.014,0 -0.02606,0.00391 -0.03906,0.00391c-1.381,0 -2.5,-1.119 -2.5,-2.5c0,-1.381 1.119,-2.5 2.5,-2.5zM18.5,9c1.381,0 2.5,1.119 2.5,2.5v0.5c0,2.214 -1.10041,4.26909 -2.94141,5.49609l-0.50391,0.33594l-1.10938,-1.66406l0.50391,-0.33594c0.698,-0.465 1.23684,-1.10394 1.58984,-1.83594c-0.014,0 -0.02606,0.00391 -0.03906,0.00391c-1.381,0 -2.5,-1.119 -2.5,-2.5c0,-1.381 1.119,-2.5 2.5,-2.5z"></path>
            </g>
          </g>
        </svg>
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] pb-[3vh] rounded-none ">
        <div className="   w-full px-5 mt-[0.5vh] pb-[2vh] backdrop-blur-lg bg-transparent flex justify-between items-center ">
          <div className="flex space-x-3 ">
            <div className=" h-14 w-14 overflow-hidden rounded-lg">
              <LazyLoadImage
                height="100%"
                width="100%"
                src={
                  playlist[currentIndex].thumbnailUrl ||
                  "https://i.pinimg.com/564x/d4/40/76/d44076613b20dd92a8e4da29a8df538e.jpg"
                }
                alt="Image"
                effect="blur"
                className="object-cover transition-all duration-300 rounded-lg w-[100%] h-[100%] "
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xl truncate w-[47vw] fade-in">
                {playlist[currentIndex].title}
              </p>

              <Link
                className="text-start -mt-1"
                to={`/artist/${playlist[currentIndex].artists[0]?.id}`}
              >
                <DrawerClose
                  onClick={() => closeRef.current?.click()}
                  className="p-0 m-0"
                >
                  <p className="text-sm fade-in text-start truncate w-[37vw]  text-zinc-400">
                    {playlist[currentIndex].artists[0]?.name}
                  </p>
                </DrawerClose>
              </Link>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <ShareLyrics lyrics={lyrics && lyrics} />
              <Options id={playingPlaylistUrl} music={playlist[currentIndex]} />
            </div>
          </div>
        </div>
        <div className="flex relative overflow-scroll  flex-col px-5 space-y-3">
          {isLoading ? (
            <div className="flex h-[77dvh] justify-center items-center">
              <Loader loading={true} />
            </div>
          ) : (
            <>
              {lyrics ? (
                <div
                  ref={lyricsRef}
                  className=" transition-all h-[92dvh]  tracking-tight break-words duration-300 fade-in "
                >
                  {lyrics.map((line, index) => (
                    <p
                      onClick={handleClick}
                      key={index}
                      data-time={line.time}
                      style={{
                        filter:
                          (line.time <= progress &&
                            (index === lyrics.length - 1 ||
                              (lyrics[index + 1]?.time || 0) > progress) &&
                            "none") ||
                          "blur(0.7px)",
                        fontSize: "1.875rem",
                        marginBottom:
                          (line.time <= progress &&
                            (index === lyrics.length - 1 ||
                              (lyrics[index + 1]?.time || 0) > progress) &&
                            "1.5rem") ||
                          "1.5rem",

                        transitionProperty: "all",
                        transitionDuration: "800ms",
                        fontWeight: 700,
                        opacity:
                          line.time <= progress &&
                          (index === lyrics.length - 1 ||
                            (lyrics[index + 1]?.time || 0) > progress)
                            ? 1
                            : 0.7,
                        color:
                          line.time <= progress &&
                          (index === lyrics.length - 1 ||
                            (lyrics[index + 1]?.time || 0) > progress)
                            ? "#f4f4f5"
                            : "#71717a",
                      }}
                    >
                      {line.lyrics == null ? "🎵" : line.lyrics}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex h-[77dvh] justify-center items-center">
                  <p className="text-2xl fade-in break-words">
                    You'll have to guess the lyrics for this one.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
const Lyrics = React.memo(LyricsComp);
export default Lyrics;
