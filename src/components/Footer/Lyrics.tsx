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
import {
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { TbMicrophone2 } from "react-icons/tb";
import ShareLyrics from "./Share";
// import { prominent } from "color.js";

function Lyrics({ closeRef }: { closeRef: RefObject<HTMLButtonElement> }) {
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
  const music = useSelector((state: RootState) => state.musicReducer.music);
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

  const {
    data: lyrics,
    refetch,
    isLoading,
  } = useQuery<[{ time: number | string; lyrics: string }]>(
    ["lyrics", playlist[currentIndex].youtubeId],
    getLyrics,
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 6000,
      refetchOnMount: false,
    }
  );

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

  useEffect(() => {
    if (duration) {
      refetch();
    }
  }, [refetch, duration]);

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
  return (
    <Drawer>
      <DrawerTrigger>
        <TbMicrophone2 className="h-6 w-6" />
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] pb-[3vh] rounded-none ">
        <div className="   w-full px-5 mt-[0.5vh] pb-[4vh] backdrop-blur-lg bg-transparent flex justify-between items-center ">
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
              <p className="text-xl truncate w-[45vw] fade-in">
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
                  <p className="text-sm fade-in text-start truncate w-[37vw]  text-red-500">
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
        <div className="flex relative overflow-scroll pb-3 flex-col px-5 space-y-3">
          {isLoading ? (
            <div className="flex h-[77dvh] justify-center items-center">
              <Loader loading={true} />
            </div>
          ) : (
            <>
              {lyrics ? (
                <div
                  ref={lyricsRef}
                  className=" transition-all h-[88dvh]  break-words duration-300 fade-in "
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
                          "blur(1.1px)",
                        fontSize: "1.875rem",
                        marginBottom:
                          (line.time <= progress &&
                            (index === lyrics.length - 1 ||
                              (lyrics[index + 1]?.time || 0) > progress) &&
                            "2rem") ||
                          "2rem",

                        transitionProperty: "all",
                        transitionDuration: "800ms",
                        fontWeight: "bold",
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

export default Lyrics;
