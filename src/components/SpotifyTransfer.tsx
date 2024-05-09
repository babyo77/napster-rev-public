import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

import "react-lazy-load-image-component/src/effects/blur.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { TransferFromSpotifyApi } from "@/API/api";
import { useQuery } from "react-query";
import Loader from "./Loaders/Loader";
import { spotifyTransfer } from "@/Interface";
import { useDispatch, useSelector } from "react-redux";
import { setSpotifyTrack } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { BiImport } from "react-icons/bi";

function SpotifyTransfer({
  close,
  className,
}: {
  className?: string;
  close: React.RefObject<HTMLButtonElement>;
}) {
  const track = useSelector(
    (state: RootState) => state.musicReducer.spotifyTrack
  );

  const dispatch = useDispatch();
  const [link, setLink] = useState<string>("");
  const [data, setData] = useState<spotifyTransfer | null>();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  }, []);

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

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (data && ref.current && close.current) {
      dispatch(setSpotifyTrack(data));
      ref.current.click();
      close.current.click();
    }
  }, [data, dispatch, close]);
  return (
    <Drawer>
      <DrawerTrigger className=" w-full animate-fade-up">
        <p
          className={` ${
            className ? " justify-center bg-neutral-900" : "px-4"
          } animate-fade-up border rounded-xl flex items-center space-x-1 bg-neutral-900 py-2.5 mt-3  w-full text-base`}
        >
          <BiImport className="h-5 w-5" />
          <span>Import from Spotify</span>
        </p>
      </DrawerTrigger>
      <DrawerContent className="w-full border-none flex items-center flex-col justify-center h-dvh rounded-none">
        <div className="h-dvh items-center border-none px-5 justify-center flex flex-col w-full  rounded-2xl">
          <DrawerHeader>
            {!data && !track && !isLoading && (
              <DialogTitle className=" text-2xl tracking-tighter leading-tight animate-fade-down font-semibold -mb-1">
                Paste Spotify Link
              </DialogTitle>
            )}
          </DrawerHeader>

          <div className=" min-h-20 w-full flex flex-col justify-center items-center">
            {isLoading && !isError ? (
              <Loader />
            ) : (
              <>
                {!data && !track && (
                  <form onSubmit={Transfer} className=" w-full space-y-2">
                    <Input
                      type="text"
                      required
                      placeholder="Paste playlist link or id"
                      value={link}
                      className="py-5 rounded-lg animate-fade-down"
                      onChange={handleChange}
                    />

                    <Button
                      type="submit"
                      variant={"secondary"}
                      className=" w-full py-5 border bg-neutral-900 animate-fade-up  rounded-xl"
                    >
                      Import
                    </Button>
                  </form>
                )}

                <DrawerClose
                  ref={ref}
                  className="w-full rounded-xl border mt-2 bg-none  p-0"
                >
                  <Button
                    asChild
                    variant={"secondary"}
                    className=" w-full py-5 bg-neutral-900 animate-fade-up rounded-xl"
                  >
                    <p>Close</p>
                  </Button>
                </DrawerClose>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { SpotifyTransfer };
