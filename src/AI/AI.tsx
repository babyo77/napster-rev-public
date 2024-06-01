import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BsStars } from "react-icons/bs";
import { toast } from "@/components/ui/use-toast";
import { LuLoader } from "react-icons/lu";
import { MdOutlineArrowUpward, MdOutlineClear } from "react-icons/md";
import React, { useCallback, useRef, useState } from "react";
import { DATABASE_ID, ID, db } from "@/appwrite/appwriteConfig";
import { Input } from "@/components/ui/input";
import Expand from "./expand";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { aiApi } from "@/API/api";
import AIsong from "./AIsong";
import { playlistSongs } from "@/Interface";
import { useDispatch, useSelector } from "react-redux";
import { IoMic, IoPlaySharp } from "react-icons/io5";
import { motion } from "framer-motion";
import {
  SetPlaylistOrAlbum,
  setCurrentIndex,
  setPlayingPlaylistUrl,
  shuffle,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
export interface Songs {
  name: string;
}
export interface AIplaylist {
  title: string;
  songs: Songs[];
}

export default function AI() {
  const [loading, setLoading] = useState<boolean>(false);
  const [textPrompt, setTextPrompt] = useState<string>("");
  const [aiResponse, setResponse] = useState<string>("");
  const [aiPlaylist, setAiPlaylist] = useState<AIplaylist[] | null>(null);
  const [playlist, setPlaylistData] = useState<playlistSongs[] | []>([]);
  const [chatHistory, setChatHistory] = useState<unknown[]>([]);

  const dispatch = useDispatch();
  const handlePlay = useCallback(async () => {
    if (playlist.length > 0) {
      const data = playlist.filter((r) => r.youtubeId && r.artists);
      dispatch(shuffle(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(""));
      dispatch(SetPlaylistOrAlbum("suggested"));
      toast({
        duration: 2000,
        description: `Playing... 👻`,
      });
    }
  }, [dispatch, playlist]);

  const currentPlaylist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlaylist = useCallback(async () => {
    try {
      if (textPrompt.trim() == "") {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return;
      }
      setResponse("");
      setAiPlaylist(null);
      setPlaylistData([]);
      setLoading(true);
      if (!localStorage.getItem(localStorage.getItem("$d_id_") || "")) {
        setLoading(false);
        toast({
          className: "bottom-24",
          variant: "destructive",
          description: "Listen some music to use AI",
        });
        return;
      }
      if (localStorage.getItem("n")?.trim() !== "") {
        const payload = {
          text: textPrompt,
          name: localStorage.getItem("n"),
          history: chatHistory,
          currentListening: `${currentPlaylist[currentIndex]?.title} by ${currentPlaylist[currentIndex]?.artists[0]?.name}`,
          playlist: JSON.stringify(currentPlaylist.slice(1, 20)),
        };
        const res = await axios.post(`${aiApi}`, payload);

        if (res.data.startsWith("[") && res.data.endsWith("]")) {
          const data = await JSON.parse(res.data);

          setResponse("");
          await setAiPlaylist(data);
        } else {
          setAiPlaylist(null);

          if (res.data.includes("}")) {
            const start = res.data.indexOf("[");
            const end = res.data.lastIndexOf("]") + 1;
            const jsonString = res.data.substring(start, end);

            const playlist = JSON.parse(jsonString);

            setAiPlaylist(playlist);
            setTextPrompt("");
            setLoading(false);
            return;
          }
          const modifiedData = res.data.replace(/\[/g, "").replace(/:/g, "");
          setResponse(modifiedData);
        }

        setChatHistory([
          ...chatHistory,
          {
            role: "user",
            parts: [
              {
                text: textPrompt,
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: res.data,
              },
            ],
          },
        ]);

        setTextPrompt("");
        setLoading(false);
        if (chatHistory.length > 0) {
          try {
            await db.createDocument(
              DATABASE_ID,
              "6649edfb002354f99aac",
              ID.unique(),
              {
                for: localStorage.getItem("uid"),
                prompt: JSON.stringify(chatHistory),
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        setLoading(false);
        toast({
          className: "bottom-24",
          variant: "destructive",
          description: "Setup your account! Settings -> Account",
        });
      }
    } catch (error) {
      toast({
        className: "bottom-0",
        duration: 2000,
        variant: "destructive",
        description: `Something went wrong`,
      });
      setLoading(false);
    }
  }, [textPrompt, chatHistory, currentIndex, currentPlaylist]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleSetPrompt = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      const text = e.currentTarget.textContent;
      if (text && buttonRef.current) {
        await setTextPrompt(text);
        buttonRef.current.click();
      }
    },
    []
  );

  const expandRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (expandRef.current && aiPlaylist) {
        expandRef.current.click();
      }
      if (expandRef.current && aiResponse.length > 400) {
        expandRef.current.click();
      }
    },
    [aiPlaylist, aiResponse]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextPrompt(e.target.value);
  }, []);

  const charVariant = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 },
  };
  return (
    <Drawer>
      <DrawerTrigger className="w-full text-left mt-0">
        <div className="bg-neutral-950 flex border items-center space-x-1.5 px-2 py-2.5 border-neutral-900 mx-4 rounded-lg mb-1.5  justify-between font-semibold">
          <div className="pl-2.5">
            <p className="text-base font-medium">AI Playlist - Beta</p>
            <p className="text-xs text-zinc-400 -mt-0.5">
              Turn your prompt to playlists with AI
            </p>
          </div>
          <div className=" bg-neutral-950 text-zinc-300 flex items-center justify-center p-2.5 rounded-full w-fit">
            <BsStars className="h-7 w-7 text-red-500" />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerHeader></DrawerHeader>
        {aiPlaylist && (
          <div className="px-5 w-full  -mt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight leading-tight">
                {aiPlaylist[0]?.title}
              </h1>
            </div>
            <div className="flex flex-col mt-2.5 space-y-3.5 max-h-[78dvh] overflow-y-scroll">
              {aiPlaylist[0]?.songs?.map(({ name }, i) => (
                <AIsong
                  setPlaylistData={setPlaylistData}
                  key={name + i}
                  name={name}
                />
              ))}
            </div>
          </div>
        )}
        {loading ? (
          <>
            <div className="px-5  text-white flex flex-col space-y-4">
              <div>
                <BsStars className="h-8 w-8 animate-pulse text-red-500" />
              </div>
              <div className=" space-y-2">
                <Skeleton className="h-6 w-full rounded-lg" />
                <Skeleton className="h-6 w-[80dvw] rounded-lg" />
                <Skeleton className="h-6 w-[50dvw] rounded-lg" />
              </div>
            </div>
          </>
        ) : (
          <>
            {aiResponse.length == 0 ? (
              <>
                {!aiPlaylist && (
                  <div className="px-5  space-y-0.5">
                    <p className="text-3xl text-zinc-200 font-bold tracking-tight leading-tight">
                      What do you want to
                      <br />
                      <span className="-mt-1">hear today?</span>
                    </p>
                    <p className=" text-neutral-400 font-medium leading-tight text-sm ">
                      Let's make a playlist together.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="px-5  max-h-[78dvh] overflow-y-scroll text-white flex flex-col space-y-4">
                <div className=" text-zinc-200 text-lg tracking-tight font-normal rounded-lg   text-pretty">
                  <BsStars className="h-8 w-8 text-red-500 mb-1" />{" "}
                  <motion.p
                    initial="hidden"
                    whileInView="reveal"
                    transition={{ staggerChildren: 0.02 }}
                    className=" tracking-tight break-words leading-6 font-medium"
                  >
                    {aiResponse
                      .split(/(?=[\s\S])/u)
                      .map((char: string, i: number) => (
                        <motion.span
                          variants={charVariant}
                          key={i}
                          transition={{ duration: 0.35 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                  </motion.p>
                </div>
              </div>
            )}
          </>
        )}

        <DrawerFooter>
          {textPrompt.length == 0 && !aiPlaylist && !loading && !aiResponse && (
            <>
              <div className="px-1 space-y-2.5 text-zinc-200 ">
                <div>
                  <p className="text-xl  font-semibold leading-tight">
                    Try Asking
                  </p>
                </div>
              </div>
              <div className="  w-full  flex space-x-3 mb-2">
                <div
                  onClick={handleSetPrompt}
                  className="  relative py-4 pt-10 capitalize text-base text-neutral-400 px-4 text-start rounded-xl bg-neutral-900 text-pretty"
                >
                  <p>
                    Going for a party, give me a playlist with some Indian hip
                    hop.
                  </p>
                  <BsStars className="top-3 absolute text-red-500 h-6 w-6" />
                </div>
                <div
                  onClick={handleSetPrompt}
                  className="  relative py-4 pt-10 capitalize text-base text-neutral-400 px-4 text-start rounded-xl bg-neutral-900 text-pretty"
                >
                  <p>
                    Need some energetic Indian hip hop tracks for my workout
                    playlist.{" "}
                  </p>
                  <BsStars className="top-3 absolute text-red-500 h-6 w-6" />
                </div>
              </div>
            </>
          )}
          <div className="flex space-x-2  items-center justify-center">
            <div className="w-full relative">
              <Input
                required
                ref={inputRef}
                disabled={loading}
                onFocus={handleClick}
                onChange={handleChange}
                value={textPrompt}
                className=" resize-none h-11 disabled:bg-neutral-800 bg-neutral-900 text-lg px-11 pr-10 py-2 font-normal  border-none rounded-full leading-tight"
              ></Input>

              <Expand
                ref={expandRef}
                loading={loading}
                handlePlaylist={handlePlaylist}
                text={textPrompt}
                setPrompt={setTextPrompt}
              />

              <IoMic
                onClick={() =>
                  toast({
                    description: "Not available",
                  })
                }
                className={`
             text-zinc-700
                 absolute top-2 left-2.5 h-7 w-7`}
              />
            </div>
            <button
              ref={buttonRef}
              onClick={handlePlaylist}
              disabled={loading}
              className=" bg-neutral-900 p-2 rounded-full"
            >
              {loading ? (
                <LuLoader className="h-7 w-7 animate-spin text-red-700" />
              ) : (
                <MdOutlineArrowUpward className="h-7 w-7 text-red-500 hover:text-zinc-400" />
              )}
            </button>

            {aiResponse.length > 0 && (
              <button
                onClick={() => (
                  setAiPlaylist(null),
                  setResponse(""),
                  setTextPrompt(""),
                  setPlaylistData([])
                )}
                className=" absolute  right-4 mb-1  bottom-20  bg-neutral-900 p-2 rounded-full"
              >
                <MdOutlineClear className="h-7 w-7 text-zinc-400" />
              </button>
            )}
            {aiPlaylist && (
              <button
                onClick={() => (
                  setAiPlaylist(null),
                  setResponse(""),
                  setTextPrompt(""),
                  setPlaylistData([])
                )}
                className=" absolute  right-4 mb-2  bottom-32  bg-neutral-900 p-2 rounded-full"
              >
                <MdOutlineClear className="h-7 w-7 text-zinc-400" />
              </button>
            )}
            {aiPlaylist && (
              <button
                onClick={handlePlay}
                className=" absolute  right-4  mb-1  bottom-20 bg-neutral-900 p-2 rounded-full"
              >
                <IoPlaySharp className="h-7 pl-1 w-7 text-zinc-400" />
              </button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
