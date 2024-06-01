import Share from "@/HandleShare/Share";
import { savedPlaylist, savedProfile } from "@/Interface";
import {
  DATABASE_ID,
  FAV_PROFILES,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import SavedLibraryCard from "@/components/Library/SavedLibraryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Query, Models, Permission, Role, ID } from "appwrite";
import { useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { prominent } from "color.js";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiTwitterXFill, RiUserUnfollowFill } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io5";
import { FaSnapchat } from "react-icons/fa";
import { BsGlobeAmericas } from "react-icons/bs";
import GoBack from "@/components/Goback";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { MdAttachMoney } from "react-icons/md";

import useGetUser from "@/hooks/getUser";
import LiveListening from "./LiveListening";

interface User extends Models.Document {
  name: string;
  image: string;
  snap: string;
  insta: string;
  other: string;
  twitter: string;
  paytm: string;
  bio: string;
}
function User({ app }: { app?: boolean }) {
  const { id } = useParams();

  const { user, userLoading } = useGetUser({ id });
  const [color, setColor] = useState<string[]>([]);

  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || ""]),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data: savedPlaylist } = useQuery(
    ["savedPublicPlaylists", id],
    loadSavedPlaylist,
    {
      staleTime: Infinity,
    }
  );
  const [isFavArtist, setIsFavArtist] = useState<boolean>();

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  useEffect(() => {
    if (user) {
      prominent(user[0]?.image, {
        amount: 12,
        format: "hex",
      }).then((c) => {
        setColor(c as string[]);
      });
    }
  }, [user]);

  const loadIsFav = async () => {
    const r = await db.listDocuments(DATABASE_ID, FAV_PROFILES, [
      Query.equal("for", [uid || ""]),
      Query.equal("pid", [id || ""]),
    ]);
    const p = r.documents as unknown as savedProfile[];
    if (p.length == 0) {
      setIsFavArtist(false);
    } else {
      setIsFavArtist(true);
    }
    return p;
  };

  const { data: isFav, refetch: refetchFav } = useQuery<savedProfile[]>(
    ["checkFavArtist", id],
    loadIsFav,
    {
      keepPreviousData: true,
    }
  );
  const { toast } = useToast();
  const q = useQueryClient();
  const removeFromFav = useCallback(async () => {
    if (isFav) {
      setIsFavArtist(false);

      await db
        .deleteDocument(DATABASE_ID, FAV_PROFILES, isFav[0].$id)
        .catch((error) => {
          toast({
            description: error.type,
          });
          setIsFavArtist(true);
        });
      refetchFav();
    }
    await q.fetchQuery("savedProfiles");
  }, [isFav, refetchFav, toast, q]);

  const addToFav = useCallback(async () => {
    setIsFavArtist(true);
    if (uid) {
      await db
        .createDocument(
          DATABASE_ID,
          FAV_PROFILES,
          ID.unique(),
          {
            pid: id,
            for: uid,
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        )
        .catch((error) => {
          toast({
            description: error.type,
          });
          setIsFavArtist(false);
        });
      refetchFav();
    } else {
      setIsFavArtist(false);
    }
    await q.fetchQuery("savedProfiles");
  }, [uid, refetchFav, id, toast, q]);

  return (
    <>
      {app && <GoBack />}
      <Toaster />
      <div className="absolute top-4 z-10 right-3 animate-fade-left flex-col space-y-0.5">
        {user && user.length > 0 && (
          <>
            {id !== uid && (
              <>
                {isFavArtist ? (
                  <RiUserUnfollowFill
                    onClick={removeFromFav}
                    className="h-8 w-8 animate-fade-left backdrop-blur-md mb-2   bg-black/30 rounded-full p-1.5"
                  />
                ) : (
                  <AiOutlineUserAdd
                    onClick={addToFav}
                    className="h-8 w-8 mb-2 backdrop-blur-md   bg-black/30 rounded-full p-1.5"
                  />
                )}
              </>
            )}
            {user[0].paytm &&
              user[0].paytm.length > 0 &&
              user[0].paytm !== "upi://pay?pa=@paytm&pn=PaytmUser" && (
                <a href={user[0].paytm} target="blank">
                  <MdAttachMoney className="h-8 w-8  mb-2 backdrop-blur-md   bg-black/30 rounded-full p-1.5" />
                </a>
              )}

            <Share />
          </>
        )}
      </div>

      <div
        style={{
          backgroundImage: `linear-gradient(to top, black, ${color[1]}`,
        }}
        className={`w-full  flex justify-start items-center px-5 ${
          app ? "pt-[8vh] pb-4" : "pt-[5vh] pb-4"
        }   transition-all duration-300`}
      >
        <div className=" flex  items-center space-x-1.5 justify-start text-start">
          {userLoading ? (
            <Skeleton className="h-24 w-24 object-cover rounded-full" />
          ) : (
            <div>
              <img
                src={user ? user[0]?.image || "/cache.jpg" : "/cache.jpg"}
                className="h-24 w-24 animate-fade-right object-cover rounded-full"
              />
            </div>
          )}
          <div>
            {userLoading ? (
              <div></div>
            ) : (
              <>
                {user && user.length > 0 && (
                  <div className=" flex flex-col space-y-1.5">
                    <div>
                      <h1 className=" truncate -mb-1 animate-fade-right max-w-[50dvw] px-1  font-semibold text-2xl  leading-tight tracking-tight">
                        {user[0]?.name || ""}
                      </h1>
                    </div>

                    <div className="flex animate-fade-right space-x-1.5 text-sm ml-1">
                      {user[0].insta && (
                        <a target="blank" href={user[0].insta}>
                          <IoLogoInstagram />
                        </a>
                      )}
                      {user[0].twitter && (
                        <a target="blank" href={user[0].twitter}>
                          <RiTwitterXFill />
                        </a>
                      )}
                      {user[0].snap && (
                        <a target="blank" href={user[0].snap}>
                          <FaSnapchat />
                        </a>
                      )}
                      {user[0].other && (
                        <a target="blank" href={user[0].other}>
                          <BsGlobeAmericas />
                        </a>
                      )}
                    </div>
                    {user[0].bio && (
                      <div>
                        <p className=" text-[0.7rem] text-zinc-300 leading-tight tracking-tight ml-1 -mt-1 font-medium">
                          {user[0].bio}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {userLoading ? (
        <div></div>
      ) : (
        <>
          {savedPlaylist && savedPlaylist.length > 0 && (
            <h2 className="px-5 mt-6 mb-2.5 animate-fade-right font-semibold leading-tight text-xl">
              Playlists
            </h2>
          )}
          <div className="flex  flex-col px-5">
            <div className=" space-y-3">
              {savedPlaylist &&
                savedPlaylist
                  .slice(0, 4)
                  .map((saved, id) => (
                    <SavedLibraryCard
                      className
                      key={saved.link + id}
                      id={saved.$id || ""}
                      data={saved}
                      author={saved.creator}
                      link={saved.link}
                      f={saved.for}
                    />
                  ))}
            </div>
            {savedPlaylist && savedPlaylist.length > 0 && (
              <div className="w-full flex justify-center items-center font-normal">
                <Link to={app ? `/playlist/${id}` : `/playlists/${id}`}>
                  <Button
                    variant={"outline"}
                    className=" animate-fade-right mt-4 text-xs font-normal rounded-full"
                  >
                    See all Playlists
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
      <LiveListening app={app} id={id} user={user} />
    </>
  );
}

export default User;
