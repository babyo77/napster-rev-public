import { FaUserCircle } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SpotifyTransfer } from "../SpotifyTransfer";
import React, { useCallback, useRef } from "react";
import { Token } from "../Token";
import { DialogClose } from "../ui/dialog";
import { RootState } from "@/Store/Store";
import { useDispatch, useSelector } from "react-redux";
import { Account } from "./Account";
import authService, {
  DATABASE_ID,
  NEW_USER,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { setUser } from "@/Store/Player";
import { PiUserSwitch } from "react-icons/pi";
import { IoHelpBuoySharp } from "react-icons/io5";
import { MdOutlineDownloading } from "react-icons/md";
import { SponsorsComp } from "../Sponsors";
import { useNavigate } from "react-router-dom";
import { LinkAccount } from "./linkAccount";
import SleepTimer from "./sleeptimer";

function SettingsComp() {
  const close = useRef<HTMLButtonElement>(null);

  const handleSwitch = useCallback(async () => {
    const id = prompt("Enter your token");
    if (id) {
      const pass = prompt("Enter your password");
      if (id && pass) {
        try {
          await authService.logout("current");
          await authService.login(`${id}@napster.com`, pass);
          localStorage.clear();
          localStorage.setItem("uid", id);
          localStorage.setItem("pp", pass);
          window.location.reload();
        } catch (error) {
          //@ts-expect-error:ignore
          alert(error.message.replace("email", "token"));
          window.location.reload();
        }
      }
    }
  }, []);
  const navigate = useNavigate();
  const handleLoadPlaylist = useCallback(() => {
    const l = prompt("Enter Shared Playlist Link");
    if (l && l?.trim() != "") {
      if (l.startsWith(window.location.origin)) {
        navigate(l.replace(window.location.origin, ""));
      } else {
        alert("invalid link");
      }
    }
  }, [navigate]);

  const track = useSelector(
    (state: RootState) => state.musicReducer.spotifyTrack
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const dispatch = useDispatch();
  const handleImage = async () => {
    if (uid) {
      const result = await db.listDocuments(DATABASE_ID, NEW_USER, [
        Query.equal("user", [uid]),
      ]);
      if (
        result.documents[0].image.length > 0 &&
        result.documents[0].name.length > 0
      ) {
        if (result.documents[0].spotifyId) {
          dispatch(setUser(true));
        }

        return result.documents;
      }
    }
  };

  const { data: imSrc } = useQuery("dpImage", handleImage, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  return (
    <Drawer>
      <DrawerTrigger>
        {imSrc && imSrc[0].image.length > 0 ? (
          <Avatar className="animate-fade-left h-9 w-9 p-0 m-0 -mr-0.5">
            <AvatarImage
              className="rounded-full object-cover h-[100%] w-[100%]"
              src={imSrc[0].image}
            ></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <FaUserCircle className="h-7 w-7 animate-fade-left text-zinc-100" />
        )}
      </DrawerTrigger>
      <DrawerContent className="px-2 h-dvh rounded-none tracking-tight leading-tight">
        <DrawerHeader className="animate-fade-up">
          <DrawerTitle className="text-zinc-400 animate-fade-up font-bold">
            Settings
          </DrawerTitle>
        </DrawerHeader>
        <Account className="text-start px-4" image={imSrc && imSrc[0].image} />
        <LinkAccount
          snap={imSrc && imSrc[0].snap}
          twitter={imSrc && imSrc[0].twitter}
          insta={imSrc && imSrc[0].insta}
          other={imSrc && imSrc[0].other}
          paytm={
            imSrc &&
            imSrc[0].paytm
              .replace("upi://pay?pa=", "")
              .replace("@paytm&pn=PaytmUser", "")
          }
        />
        <SleepTimer />
        {/iPhone/i.test(navigator.userAgent) && (
          <div className="animate-fade-up">
            <p
              onClick={handleLoadPlaylist}
              className=" rounded-xl py-2.5 mt-3 animate-fade-up  flex text-start   px-4  text-base items-center space-x-1 bg-neutral-950"
            >
              <MdOutlineDownloading className="h-6 w-6" />
              <span>Load Playlist</span>
            </p>
          </div>
        )}
        <SponsorsComp />
        {!track && <SpotifyTransfer close={close} />}
        <div className="animate-fade-up">
          <p
            onClick={() =>
              (window.location.href = "mailto:yfw111realone@gmail.com")
            }
            className=" animate-fade-up bg-neutral-950 rounded-xl py-2.5 mt-3  flex px-4 text-base items-center space-x-1"
          >
            <IoHelpBuoySharp className="h-5 w-5" />
            <span>Feedback & Suggestion</span>
          </p>
        </div>
        <DialogClose ref={close}></DialogClose>
        <DrawerFooter className="animate-fade-up items-center w-full px-0">
          <div className="flex space-x-2 w-full items-center">
            <Token />
            <div className="w-full ">
              <p
                onClick={handleSwitch}
                className="  font-medium bg-neutral-950 rounded-xl animate-fade-up  py-2.5 mt-3 flex justify-center  text-base items-center space-x-1"
              >
                <PiUserSwitch className="h-5 w-5" />
                <span>Switch Account</span>
              </p>
            </div>
          </div>
          <span className="text-xs text-zinc-300 animate-fade-up">
            Version - 1.2.17 beta
          </span>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const Settings = React.memo(SettingsComp);
export default Settings;
