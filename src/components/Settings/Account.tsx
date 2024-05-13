import "react-lazy-load-image-component/src/effects/blur.css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useCallback, useRef, useState } from "react";
import authService, {
  DATABASE_ID,
  NEW_USER,
  db,
} from "@/appwrite/appwriteConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { Models, Permission, Query, Role } from "appwrite";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../Loaders/Loader";
import { DialogTitle } from "../ui/dialog";
import axios from "axios";
import { getUserApi } from "@/API/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Avatar, AvatarImage } from "../ui/avatar";
import { setUser } from "@/Store/Player";
import { RiLinkM } from "react-icons/ri";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { IoSyncOutline } from "react-icons/io5";
import useImage from "@/hooks/useImage";

interface user extends Models.Document {
  user: string;
  name: string;
  spotifyId: string;
  image: string;
}

interface verify {
  image: string;
  verify: string;
  name: string;
  playlists: string[];
}

function AccountComp({
  tunebox,
  className,
  image,
}: {
  image?: string;
  tunebox?: boolean;
  className?: string;
}) {
  function ScreenSizeCheck() {
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    return isIPhone;
  }
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const q = useQueryClient();
  const [sync, setSync] = useState<boolean>(false);
  const getUser = useCallback(async () => {
    if (uid) {
      setSync(true);
      const result = await db.listDocuments(DATABASE_ID, NEW_USER, [
        Query.equal("user", [uid]),
      ]);

      if (!result.documents[0]) {
        const newUserResult: user = await db.createDocument(
          DATABASE_ID,
          NEW_USER,
          uid,
          {
            user: uid,
            ios: ScreenSizeCheck(),
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        );
        setSync(false);
        return newUserResult;
      } else {
        if (
          result.documents[0].image.length > 0 &&
          result.documents[0].name.length > 0
        ) {
          const res = await axios.get(
            `${getUserApi}${result.documents[0].spotifyId}`
          );
          const code: verify = res.data;

          await db.updateDocument(
            DATABASE_ID,
            NEW_USER,
            result.documents[0].$id,
            {
              image: code.image,
              name: code.name,
            }
          );
          await authService.updateName(code.name).catch(() => {
            setSync(false);
          });
        }
        setSync(false);
        q.refetchQueries("dpImage");
        return result.documents[0] as user;
      }
    } else {
      setSync(false);

      return null;
    }
  }, [uid, q]);

  const { data, isLoading, refetch } = useQuery<user | null>(
    ["user", uid],
    getUser,
    {
      refetchOnWindowFocus: false,
      staleTime: 60000,
      onSuccess(data) {
        data == undefined && refetch();
      },
    }
  );

  const profile = useRef<HTMLInputElement>(null);
  const [verify, setVerify] = useState<string>();
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = profile.current;
      if (id) {
        const val = id.value;
        const user = val.match(/\/user\/([^?]+)/);
        setVerify(user ? user[1] : val);
      }
    },
    []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleVerify = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${getUserApi}${verify}`);
      const code: verify = res.data;
      if (code.verify.toLowerCase() === "napster" && data) {
        await db.updateDocument(DATABASE_ID, NEW_USER, data.$id, {
          image: code.image,
          name: code.name,
          spotifyId: verify,
        });
        q.refetchQueries("dpImage");
        dispatch(setUser(true));
        await refetch();
        setVerify("");
        setLoading(false);
      } else {
        setLoading(false);
        alert("verification failed! Try again");
      }
    } catch (error) {
      alert("verification failed or invalid Link");
      setLoading(false);
    }
  }, [data, verify, refetch, q, dispatch]);

  const handleRemove = async () => {
    if (data) {
      const isOK = confirm("Are you sure you want to remove");
      if (isOK) {
        await db.updateDocument(DATABASE_ID, NEW_USER, data.$id, {
          image: "",
          name: "",
          spotifyId: "",
        });
        await refetch();
        setVerify("");
        setLoading(false);
      }
    }
  };

  const handleShare = useCallback(() => {
    navigator.share({
      url: `${window.location.origin}/user/${uid}`,
    });
  }, [uid]);

  const c = useImage(image ? image : "/cache.jpg");
  return (
    <Drawer>
      <DrawerTrigger className=" w-full animate-fade-up">
        <p
          className={`rounded-xl bg-neutral-950 py-2 animate-fade-up flex text-base ${className} space-x-2 items-center flex`}
        >
          <Avatar className=" h-7  w-7 p-0 m-0 -mr-0.5">
            <AvatarImage
              className="rounded-full object-cover h-[100%] w-[100%]"
              src={c || "/cachejpg"}
            ></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{tunebox ? "Setup Account to Continue " : "Account"}</span>
        </p>
      </DrawerTrigger>
      <DrawerContent className="w-full border-none flex items-center flex-col justify-center h-dvh rounded-none">
        <div className="h-dvh items-center border-none px-5 justify-center flex flex-col w-full  rounded-2xl">
          <div className=" min-h-20 w-full flex flex-col justify-center items-center">
            {isLoading && <Loader />}

            {data &&
              data.image &&
              data.image.trim() !== "" &&
              data.name &&
              data.name.trim() !== "" && (
                <>
                  <Avatar className="w-40 h-40 animate-fade-down ">
                    <LazyLoadImage
                      effect="blur"
                      src={data?.image}
                      className=" rounded-full object-cover h-[100%] w-[100%]"
                    />
                  </Avatar>
                  <h1 className=" font-semibold break-all text-center animate-fade-up text-4xl mt-2">
                    {data.name}
                  </h1>
                  <div className=" absolute top-7 px-4 text-xl flex w-full justify-between items-center">
                    <div
                      onClick={() => refetch()}
                      className={`${
                        sync ? "animate-spin" : ""
                      }  transition-all duration-500 text-zinc-400`}
                    >
                      <IoSyncOutline />
                    </div>

                    <div className="  text-zinc-400">
                      <RiLinkM onClick={handleShare} />
                    </div>
                  </div>
                </>
              )}
            {data &&
              !verify &&
              data.image.length == 0 &&
              data.name.length == 0 && (
                <>
                  <DrawerHeader>
                    <DialogTitle className=" text-2xl animate-fade-down font-semibold -mb-1">
                      Setup Your Account
                    </DialogTitle>
                  </DrawerHeader>
                  <form onSubmit={handleSubmit} className=" w-full space-y-2">
                    <Input
                      ref={profile}
                      type="text"
                      required
                      placeholder="Paste your spotify Profile link or id"
                      className="py-5 rounded-lg animate-fade-down"
                    />

                    <Button
                      type="submit"
                      variant={"secondary"}
                      className=" w-full py-5 animate-fade-up border bg-neutral-950 rounded-xl"
                    >
                      Continue
                    </Button>
                  </form>

                  <DrawerClose className="w-full rounded-xl border-none mt-2 bg-none  p-0">
                    <Button
                      asChild
                      variant={"secondary"}
                      className=" w-full py-5 animate-fade-up border bg-neutral-950 rounded-xl"
                    >
                      <p>Close</p>
                    </Button>
                  </DrawerClose>
                </>
              )}

            {verify && !loading && (
              <>
                <h2 className="text-zinc-100 animate-fade-down text-2xl font-bold mb-1 ">
                  Verify it's Your Account
                </h2>
                <div className="prose flex flex-col  animate-fade-up  font-semibold items-start text-zinc-300">
                  <ul className="text-base">
                    <li>Open Spotify on your device.</li>
                    <li>Go to Your Playlists</li>
                    <li>Tap "Create Playlist" and name it "Napster".</li>

                    <li>Tap "Save" or "Create".</li>
                  </ul>
                </div>
                <Button
                  onClick={handleVerify}
                  variant={"secondary"}
                  asChild
                  className=" animate=fade-up w-full border bg-neutral-950 py-5 mt-3 text-lg animate-fade-up rounded-xl"
                >
                  <p>Verify</p>
                </Button>
                <Button
                  onClick={() => (refetch(), setVerify(""))}
                  variant={"secondary"}
                  asChild
                  className=" w-full py-5 mt-1.5 text-lg border bg-neutral-950 animate-fade-up rounded-xl"
                >
                  <p>Cancel</p>
                </Button>
              </>
            )}
            {loading && <Loader />}
          </div>
        </div>
        {data &&
          data.image &&
          data.image.length > 0 &&
          data.name &&
          data.name.length > 0 && (
            <DrawerFooter className=" text-red-500">
              <p onClick={handleRemove} className="animate-fade-up">
                Remove
              </p>
            </DrawerFooter>
          )}
      </DrawerContent>
    </Drawer>
  );
}
const Account = React.memo(AccountComp);
export { Account };
