import Songs from "./Songs";
import { Button } from "../ui/button";
import { FaPlay } from "react-icons/fa6";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { SearchPlaylist, playlistSongs, savedPlaylist } from "@/Interface";
import Loader from "../Loaders/Loader";
import { RxShuffle } from "react-icons/rx";
import { RiFocus3Line } from "react-icons/ri";
import {
  GetPlaylistHundredSongsApi,
  SearchPlaylistApi,
  getPlaylistDetails,
} from "@/API/api";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
  shuffle,
} from "@/Store/Player";
import React, { useCallback, useEffect, useState } from "react";
import { RootState } from "@/Store/Store";
import AddLibrary from "./AddLibrary";
import GoBack from "../Goback";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useInView } from "react-intersection-observer";
import {
  ADD_TO_LIBRARY,
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { EditCustomPlaylist } from "./EditCustomPlaylist";
import PlaylistShare from "./playlistShare";
import Share from "@/HandleShare/Share";
function LibraryComp() {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  const [search] = useSearchParams(location.search);
  const c = search.get("c");

  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );

  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const [isSaved, setIsSaved] = useState<savedPlaylist[]>();
  const loadSavedPlaylist = async () => {
    if (id && id.startsWith("custom") && uid) {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("$id", [id.replace("custom", "") || "none"]),
      ]);
      const p = r.documents as unknown as savedPlaylist[];

      setIsSaved(p);

      if (p.length > 0) return p;
      const q = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("$id", [
          uid.substring(uid.length - 4) + id.replace("custom", "") || "none",
        ]),
      ]);
      const pp = q.documents as unknown as savedPlaylist[];
      setIsSaved(pp);

      return pp;
    } else {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("for", [uid || ""]),
        Query.equal("link", [id || "none"]),
      ]);
      const p = r.documents as unknown as savedPlaylist[];
      setIsSaved(p);
      return p;
    }
  };
  const { refetch: isSavedRefetch } = useQuery<savedPlaylist[]>(
    ["checkIfSaved", id],
    loadSavedPlaylist,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const [offset, setOffset] = useState<string>();

  const [data, setData] = useState<playlistSongs[]>();
  const getPlaylist = async () => {
    if (id && id.startsWith("custom") && uid) {
      const r = await db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
        Query.orderDesc("$createdAt"),
        Query.equal("playlistId", [
          id.replace("custom", "").replace(uid.substring(uid.length - 4), ""),
        ]),
        Query.limit(150),
      ]);
      const lastId = r.documents[r.documents.length - 1].$id;

      setOffset(lastId);

      const modified = r.documents.map((doc) => ({
        $id: doc.$id,
        for: doc.for,
        youtubeId: doc.youtubeId,
        artists: [
          {
            id: doc.artists[0],
            name: doc.artists[1],
          },
        ],
        title: doc.title,
        thumbnailUrl: doc.thumbnailUrl,
      }));

      setData(modified);
      return modified as unknown as playlistSongs[];
    } else {
      const list = await axios.get(`${GetPlaylistHundredSongsApi}${id}`);
      setData(list.data);
      return list.data as playlistSongs[];
    }
  };

  const getPlaylistDetail = async () => {
    if (id && id.startsWith("custom")) {
      const list = await db.getDocument(
        DATABASE_ID,
        PLAYLIST_COLLECTION_ID,
        id.replace("custom", "")
      );
      const t = [
        {
          title: list.creator,
          name: list.name,
        },
      ];

      return t as unknown as SearchPlaylist[];
    } else {
      const list = await axios.get(`${getPlaylistDetails}${id}`);
      return list.data as SearchPlaylist[];
    }
  };

  const getPlaylistThumbnail = async () => {
    if (id && id.startsWith("custom")) {
      const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
        Query.equal("$id", [id.replace("custom", "")]),
        Query.limit(1),
      ]);

      const p = [
        {
          thumbnailUrl: r.documents[0].image,
        },
      ];

      return p as SearchPlaylist[];
    } else {
      const list = await axios.get(`${SearchPlaylistApi}${id}`);
      return list.data as SearchPlaylist[];
    }
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const { isLoading, isError, refetch, isRefetching } = useQuery<
    playlistSongs[]
  >(["playlist", id], getPlaylist, {
    retry: 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60 * 60000,
    onSuccess(data) {
      if (id && id.startsWith("custom")) return;
      data.length == 0 && refetch();
    },
  });

  const {
    data: pDetails,
    isLoading: pLoading,
    isError: pError,
    isRefetching: pIsRefetching,
  } = useQuery<SearchPlaylist[]>(["playlistDetails", id], getPlaylistDetail, {
    retry: 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60 * 60000,
  });
  const {
    data: playlistThumbnail,
    isLoading: playlistThumbnailLoading,
    isError: playlistThumbnailError,
    refetch: playlistThumbnailRefetch,
    isRefetching: playlistThumbnailIsRefetching,
  } = useQuery<SearchPlaylist[]>(
    ["getPlaylistThumbnail", id],
    getPlaylistThumbnail,
    {
      retry: 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 60000,
    }
  );

  useEffect(() => {
    refetch();

    dispatch(setIsLikedSong(false));
  }, [dispatch, refetch, id]);
  const handleShufflePlay = useCallback(async () => {
    if (data) {
      dispatch(shuffle(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));
      if (data.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id]);
  const handlePlay = useCallback(() => {
    if (data) {
      dispatch(setPlaylist(data));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum("library"));
      if (data.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, data, isPlaying, id]);

  const handleFocus = useCallback(() => {
    const toFocus = document.getElementById(playlist[currentIndex].youtubeId);
    toFocus?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex, playlist]);

  useEffect(() => {
    if (inView) {
      if (id && id.startsWith("custom") && offset && data) {
        db.listDocuments(DATABASE_ID, ADD_TO_LIBRARY, [
          Query.orderDesc("$createdAt"),
          Query.equal("playlistId", [id.replace("custom", "")]),
          Query.cursorAfter(offset),
        ]).then((r) => {
          const lastId = r.documents[r.documents.length - 1].$id;

          setOffset(lastId);

          const modified = r.documents.map((doc) => ({
            $id: doc.$id,
            for: doc.for,
            youtubeId: doc.youtubeId,
            artists: [
              {
                id: doc.artists[0],
                name: doc.artists[1],
              },
            ],
            title: doc.title,
            thumbnailUrl: doc.thumbnailUrl,
          }));

          setData((prev) => prev?.concat(modified));
        });
      }
    }
  }, [inView, id, uid, data, offset]);

  const isStandalone = useSelector(
    (state: RootState) => state.musicReducer.isIphone
  );

  const handleSave = useCallback(async () => {
    if (uid && id) {
      const q = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
        Query.equal("$id", [id.replace("custom", "")]),
      ]);
      const isSaved = q.documents as unknown as savedPlaylist[];

      await db.createDocument(
        DATABASE_ID,
        PLAYLIST_COLLECTION_ID,
        uid.substring(uid.length - 4) + isSaved[0].$id,
        {
          name: isSaved[0].name,
          creator: isSaved[0].creator,
          link: isSaved[0].link,
          for: uid,
          image: isSaved[0].image,
        }
      );
      isSavedRefetch();
    }
  }, [uid, isSavedRefetch, id]);
  return (
    <div className=" flex flex-col items-center">
      {isError && pError && playlistThumbnailError && (
        <div className=" relative  w-full">
          <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No playlist found
          </div>
          <NavLink to={"/library/"}>
            <IoIosArrowBack className="h-7 w-7  my-5 mx-4  backdrop-blur-md text-black bg-white/70 rounded-full p-1" />
          </NavLink>
        </div>
      )}
      {isRefetching && pIsRefetching && playlistThumbnailIsRefetching && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {isLoading && pLoading && playlistThumbnailLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {!data && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
      {data && (
        <>
          <div className="flex w-screen h-[25rem] pt-[6vh] justify-center  relative ">
            <GoBack />

            <div className="absolute top-4 z-10 right-3  flex-col space-y-0.5">
              {id?.startsWith("custom") && data && uid == data[0].for && (
                <EditCustomPlaylist
                  reload={playlistThumbnailRefetch}
                  thumbnailUrl={
                    (playlistThumbnail &&
                      playlistThumbnail[0]?.thumbnailUrl.replace(
                        "w120-h120",
                        "w1080-h1080"
                      )) ||
                    "https://i.pinimg.com/564x/38/2f/fe/382ffec40fdab343c9989b2373425a90.jpg"
                  }
                  id={id.replace("custom", "")}
                  name={(pDetails && pDetails[0]?.title) || ""}
                  creator={(pDetails && pDetails[0]?.name) || ""}
                />
              )}
              {isSaved && isSaved.length == 0 && !id?.startsWith("custom") && (
                <div className="">
                  <AddLibrary clone={true} id={id} />
                </div>
              )}
              {isSaved && isSaved.length == 0 && id?.startsWith("custom") && (
                <div className="" onClick={handleSave}>
                  <IoMdAdd className="h-8 w-8 animate-fade-left  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
                </div>
              )}

              {playingPlaylistUrl == id && (
                <div className="" onClick={handleFocus}>
                  <RiFocus3Line className="h-8 w-8  mb-2 animate-fade-left backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
                </div>
              )}

              {isStandalone ? (
                <div>
                  <PlaylistShare
                    cover={
                      c ||
                      (playlistThumbnail &&
                        playlistThumbnail[0]?.thumbnailUrl) ||
                      "https://i.pinimg.com/564x/38/2f/fe/382ffec40fdab343c9989b2373425a90.jpg"
                    }
                    maker={(pDetails && pDetails[0]?.name) || ""}
                    name={(pDetails && pDetails[0]?.title) || ""}
                  />{" "}
                </div>
              ) : (
                <Share />
              )}
            </div>
            <div className="h-56  w-56">
              <LazyLoadImage
                effect="blur"
                width="100%"
                height="100%"
                src={
                  c ||
                  (playlistThumbnail &&
                    playlistThumbnail[0]?.thumbnailUrl.replace(
                      "w120-h120",
                      "w1080-h1080"
                    )) ||
                  "https://i.pinimg.com/564x/38/2f/fe/382ffec40fdab343c9989b2373425a90.jpg"
                }
                alt="Image"
                loading="lazy"
                className="object-cover animate-fade-down rounded-xl h-[100%] w-[100%]"
              />
            </div>

            <div className=" absolute bottom-[1.5vh]  px-4 left-0  right-0">
              <h1 className="text-center animate-fade-down  font-semibold py-[1vh] truncate text-2xl capitalize">
                {(pDetails && pDetails[0]?.title) || "Mixes"}
              </h1>
              <div className="flex space-x-4 py-1 px-2 justify-center  items-center w-full">
                <Button
                  onClick={handlePlay}
                  type="button"
                  variant={"secondary"}
                  className="text-lg py-6 animate-fade-down  shadow-none bg-zinc-800 rounded-lg px-[13dvw]"
                >
                  <FaPlay className="mr-2" />
                  Play
                </Button>
                <Button
                  type="button"
                  onClick={handleShufflePlay}
                  variant={"secondary"}
                  className="text-lg py-6  animate-fade-down   shadow-none bg-zinc-800 rounded-lg px-[12dvw]"
                >
                  <RxShuffle className="mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>
          </div>
          <div className="py-3 -mt-[2vh] pb-[8.5rem]">
            {data.map((d, i) => (
              <div key={d.youtubeId + i} ref={ref}>
                <Songs
                  data={data}
                  reload={refetch}
                  p={id || ""}
                  forId={d.for}
                  where={"library"}
                  artistId={d.artists[0]?.id}
                  audio={d.youtubeId}
                  key={d.youtubeId + i}
                  id={i}
                  query={(id?.startsWith("custom") && "custom") || ""}
                  delId={d.$id}
                  title={d.title}
                  artist={d.artists[0]?.name}
                  cover={d.thumbnailUrl}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
const Library = React.memo(LibraryComp);
export default Library;
