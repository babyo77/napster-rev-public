import { Input } from "../ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { playlistSongs } from "@/Interface";
import { SearchApi, getSpotifyProfile } from "@/API/api";
import { useQuery } from "react-query";
import Loader from "../Loaders/Loader";
import TuneSong from "./tuneSong";
import { Link, useParams } from "react-router-dom";
import { DATABASE_ID, NEW_USER, db } from "@/appwrite/appwriteConfig";
import { Models, Query } from "appwrite";
import { MdOutlineSpatialAudio } from "react-icons/md";
import { FaItunesNote } from "react-icons/fa";

interface User extends Models.Document {
  name: string;
  image: string;
  notify: string;
}
function Box() {
  const searchQuery = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const [data, setData] = useState<playlistSongs[]>([]);
  const query = async () => {
    const query = searchQuery.current;
    if (query && query.value.length > 0) {
      const q = await axios.get(`${SearchApi}${searchQuery.current.value}`);
      setData(q.data);
      return q.data as playlistSongs[];
    } else {
      return [];
    }
  };

  const { isLoading, refetch } = useQuery<playlistSongs[]>(
    ["searchSong", searchQuery.current?.value],
    query,
    {
      enabled: false,
    }
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleChange = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.src = "";
    }
    if (searchQuery.current && searchQuery.current.value.length < 0) {
      setData([]);
    }
    const t = setTimeout(() => {
      if (searchQuery.current && searchQuery.current.value.length > 0) {
        setData([]);
        refetch();
      } else {
        setData([]);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [refetch]);

  const getUser = async () => {
    const user = await db.listDocuments(DATABASE_ID, NEW_USER, [
      Query.equal("user", [id ? id : ""]),
      Query.limit(1),
    ]);

    const res = await axios.get(
      `${getSpotifyProfile}${user.documents[0].spotifyId}`
    );
    const code = res.data;
    return code as User[];
  };
  const { data: user, isLoading: userLoading } = useQuery<User[]>(
    ["user", id],
    getUser,
    {
      retry: 5,
    }
  );

  const getKey = useCallback(async () => {
    const res = await db.listDocuments(DATABASE_ID, "65da232e478bcf5bbbad", [
      Query.equal("for", [id || ""]),
      Query.limit(1),
    ]);
    return res.documents;
  }, [id]);
  const { data: notify } = useQuery("notify", getKey, {});

  return (
    <div
      className={`  max-md:px-4 py-11 flex transition-all duration-300 px-[35dvw] flex-col h-dvh justify-center space-y-1.5 items-center`}
    >
      <audio src="" hidden ref={audioRef} autoPlay></audio>
      {userLoading && data.length == 0 ? (
        <div className=" h-dvh flex items-center justify-center">
          <Loader color="white" />
        </div>
      ) : (
        <>
          {user && user[0] ? (
            <>
              <div className="flex animate-fade-down bg-neutral-800/20 w-full border rounded-2xl  justify-between items-center p-3 space-x-1.5 pr-3">
                <div className=" flex items-center space-x-2">
                  <div>
                    <Link to={`/user/${id}`}>
                      <img
                        alt="user"
                        className=" rounded-full object-cover h-12 w-12"
                        src={user[0].image || "/newfavicon.jpg"}
                        width={50}
                        height={50}
                        loading="lazy"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => (e.currentTarget.src = "/cache.jpg")}
                      />
                    </Link>
                  </div>
                  <Link to={`/user/${id}`}>
                    <div className=" flex flex-col items-start">
                      <h2 className="font-semibold capitalize tracking-tight leading-tight max-md:max-w-[30dvw] truncate ">
                        {user[0].name}
                      </h2>
                      <div className="flex text-sm space-x-1 leading-tight tracking-tight items-center">
                        <h1 className="font-medium leading-tight tracking-tight">
                          Send me Tracks
                        </h1>
                        <div>
                          <FaItunesNote />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex text-xl space-x-1.5 items-center">
                  <MdOutlineSpatialAudio className="h-7 w-7" />
                </div>
              </div>

              <div className="flex w-full  -space-x-2 animate-fade-up">
                <div className="border  bg-none rounded-lg rounded-r-none border-r-0 px-2 border-neutral-800/80">
                  <IoSearchOutline className=" mt-2 h-5 w-5" />
                </div>
                <Input
                  type="text"
                  ref={searchQuery}
                  onChange={handleChange}
                  placeholder="Search track and send"
                  className="  px-2 relative  font-medium bg-none placeholder:text-white/70   border-neutral-800/80 tracking-tight leading-tight rounded-lg rounded-l-none border-l-0 text-zinc-200 "
                />
              </div>
              <div key={user[0].$id}>
                {isLoading && (
                  <div className=" py-11 flex items-center justify-center">
                    <Loader color="white" />
                  </div>
                )}
                {data &&
                  !isLoading &&
                  data.length > 0 &&
                  data
                    .slice(0, 5)
                    .map((item) => (
                      <TuneSong
                        notifyId={notify ? notify[0]?.notify : null}
                        audioRef={audioRef}
                        key={item.youtubeId + item.thumbnailUrl}
                        item={item}
                      />
                    ))}
              </div>
            </>
          ) : (
            <div className=" h-dvh flex items-center justify-center">
              <p>
                Sorry, this page isn't available.{" "}
                <Link to={"/"} className="underline text-red-500">
                  Go back
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Box;
