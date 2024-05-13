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
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragHandle } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import useImage from "@/hooks/useImage";
import Options from "@/components/Footer/Options";
function UpNextSongs({
  title,
  artist,
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
  playlist,
  editQue,
  music,
  handleAdd,
}: {
  editQue: boolean;
  handleAdd: boolean;
  music: playlistSongs;
  forId?: string;
  playlist: playlistSongs[];
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
  const q = useQueryClient();
  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );

  const queue = useSelector((state: RootState) => state.musicReducer.queue);

  const handlePlay = useCallback(async () => {
    const data = q.getQueryData<playlistSongs[]>([
      (query !== "custom" && query) || "playlist",
      p,
    ]);
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
  }, [dispatch, id, q, p, isPlaying, artistId, query, liked, where, playlist]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleDelete = useCallback(() => {
    //@ts-expect-error:added custom id
    const index = playlist.findIndex((i) => i.id == id);
    playlist.splice(index, 1);
    dispatch(setPlaylist(playlist));
  }, [id, playlist, dispatch]);

  const c = useImage(cover);
  return (
    <div
      {...attributes}
      style={style}
      className={` ${
        isDragging ? "bg-zinc-900 -md" : ""
      } flex  py-2 space-x-2  px-1.5 items-center`}
    >
      {!album ? (
        <div
          id={audio}
          onClick={handlePlay}
          className="overflow-hidden h-12 w-12 space-y-2"
        >
          <AspectRatio ratio={1 / 1}>
            <LazyLoadImage
              src={c || ""}
              width="100%"
              height="100%"
              effect="blur"
              alt="Image"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/cache.jpg")
              }
              className="-md object-cover h-[100%] w-[100%]"
            />
          </AspectRatio>
        </div>
      ) : (
        <p className="flex  text-xl font-semibold w-[7vw]">{id + 1}</p>
      )}

      <div
        onClick={handlePlay}
        id={audio}
        className="flex  flex-col pl-1 space-y-0.5 text-start w-[69dvw] "
      >
        <p
          className={`w-[60dvw]   ${
            queue[currentIndex]?.youtubeId == audio && "text-red-500"
          }  truncate capitalize`}
        >
          {title.replace("______________________________________", "untitled")}
        </p>
        {link && artistId ? (
          <Link to={`/artist/${artistId}`} className="w-[40vw]">
            <p className="-mt-0.5 h-[1rem] capitalize text-xs  text-zinc-400 w-[40dvw]  truncate">
              {artist || "Unknown"}
            </p>
          </Link>
        ) : (
          <p className="-mt-0.5 text-xs  text-zinc-400 w-[40dvw]  truncate">
            {artist || "Unknown"}
          </p>
        )}
      </div>
      <div>
        {queue[currentIndex]?.youtubeId == audio ? (
          <div className=" transition-all duration-500">
            {isPlaying ? (
              <img
                src="/bars.gif"
                className="h-5 w-5 transition-all duration-500"
                alt="paused"
              />
            ) : (
              <img
                src="/bars.svg"
                className="h-5 w-5 transition-all duration-500"
                alt="playing"
              />
            )}
          </div>
        ) : (
          <>
            {handleAdd && <Options className="bg-none" music={music} />}
            {editQue ? (
              <div onClick={handleDelete}>
                <RxCross2 className="h-6 w-6 text-zinc-500" />
              </div>
            ) : (
              <>
                {!handleAdd && (
                  <div ref={setNodeRef} {...listeners}>
                    <MdDragHandle className=" touch-none h-6 w-6" />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UpNextSongs;
