import { AspectRatio } from "../ui/aspect-ratio";
import { useCallback } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentArtistId,
  setCurrentIndex,
  setIsLikedSong,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import { playlistSongs } from "@/Interface";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import { Link } from "react-router-dom";
import SongsOptions from "./SongsOptions";
import axios from "axios";

function Songs({
  title,
  artist,
  delId,
  cover,
  id,
  audio,
  p,
  artistId,
  query,
  liked,
  where,
  link = true,
  album,
  reload,
  forId,
  data,
}: {
  forId?: string;
  data: playlistSongs[];
  reload?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<playlistSongs[], unknown>>;
  delId?: string;
  album?: boolean;
  where: string;
  liked?: boolean;
  link?: boolean;
  artistId: string;
  query?: string;
  p: string;
  audio: string;
  id: number;
  title: string;
  artist: string;
  cover: string;
}) {
  const dispatch = useDispatch();
  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const handlePlay = useCallback(async () => {
    if (data && data.length > 0) {
      if (liked) {
        dispatch(setIsLikedSong(true));
      }
      dispatch(isLoop(false));
      dispatch(setPlayingPlaylistUrl(p));
      dispatch(setCurrentArtistId(artistId));
      dispatch(setPlaylist(data));
      dispatch(SetPlaylistOrAlbum(where));
      dispatch(setCurrentIndex(id));
    } else if (p == "suggested") {
      if (liked) {
        dispatch(setIsLikedSong(true));
      }
      dispatch(isLoop(false));
      dispatch(setPlayingPlaylistUrl(p));
      dispatch(setCurrentArtistId(artistId));
      dispatch(setPlaylist(playlist));
      dispatch(SetPlaylistOrAlbum(where));
      dispatch(setCurrentIndex(id));
    }
    if (!isPlaying) dispatch(play(true));
  }, [dispatch, id, p, isPlaying, artistId, liked, where, playlist, data]);

  const image = async () => {
    const response = await axios.get(cover, { responseType: "arraybuffer" });
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return URL.createObjectURL(blob);
  };

  const { data: c } = useQuery(["image", cover], image, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  return (
    <div id={audio} className="flex fade-in py-2 space-x-2 items-center">
      {!album ? (
        <div className="overflow-hidden h-12 w-12 space-y-2">
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              onClick={handlePlay}
              src={c || ""}
              width="100%"
              height="100%"
              effect="blur"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/liked.webp")
              }
              className="rounded-md object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
      ) : (
        <p className="flex  text-xl font-semibold w-[7vw]">{id + 1}</p>
      )}

      <div className="flex  flex-col pl-1 space-y-0.5 text-start w-[70dvw] ">
        <p
          onClick={handlePlay}
          className={`w-[60dvw]   ${
            playlist[currentIndex]?.youtubeId == audio && "text-red-500"
          }  truncate capitalize`}
        >
          {title.replace("______________________________________", "untitled")}
        </p>
        {link ? (
          <Link to={`/artist/${artistId}`} className="w-[40vw]">
            <p className="-mt-0.5 h-[1rem] capitalize text-xs  text-zinc-400 w-[40dvw]  truncate">
              {artist}
            </p>
          </Link>
        ) : (
          <p className="-mt-0.5   text-xs  text-zinc-400 w-[40dvw]  truncate">
            {artist}
          </p>
        )}
        <div className="h-[.05rem] w-full bg-zinc-300/10 mt-1.5"></div>
      </div>
      <SongsOptions
        key={audio + cover + title}
        id={p}
        reload={reload}
        like={query == "likedSongsDetails" && true}
        music={{
          for: forId,
          $id: delId,
          youtubeId: audio,
          title: title,
          thumbnailUrl: cover,
          artists: [
            {
              id: artistId,
              name: artist,
            },
          ],
        }}
        library={
          (query == "likedSongsDetails" && true) || (query == "custom" && true)
        }
      />
    </div>
  );
}

export default Songs;
