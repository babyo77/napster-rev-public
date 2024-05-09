import { AspectRatio } from "../ui/aspect-ratio";
import { useCallback } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import {
  SetPlaylistOrAlbum,
  play,
  setCurrentArtistId,
  setCurrentIndex,
  setPlaylist,
} from "@/Store/Player";
import { artists, playlistSongs } from "@/Interface";
import { Link } from "react-router-dom";
import { DATABASE_ID, ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import axios from "axios";
import { SuggestionSearchApi } from "@/API/api";
import { useQuery } from "react-query";
import SongsOptions from "../Library/SongsOptions";
import useImage from "@/hooks/useImage";

function FeedSong({
  title,
  artist,
  cover,
  id,
  audio,
  artistId,
  fromSearch,
  artistName,
}: {
  fromSearch?: boolean;
  audio: string;
  id: string;
  title: string;
  artist: artists[];
  cover: string;
  artistName?: string;
  artistId: string;
}) {
  const dispatch = useDispatch();
  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );
  const getSuggestedSongs = async () => {
    const r = await axios.get(`${SuggestionSearchApi}${id}`);
    return r.data as playlistSongs[];
  };
  const { data } = useQuery<playlistSongs[]>(
    ["suggestedFeed", id],
    getSuggestedSongs,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 60000,
    }
  );

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const handlePlay = useCallback(async () => {
    if (!id) return;

    if (!fromSearch) {
      try {
        db.createDocument(DATABASE_ID, INSIGHTS, ID.unique(), {
          youtubeId: id,
          title: title,
          thumbnailUrl: cover,
          artists: [artistId, artistName],
          type: "music",
          for: uid,
        });
      } catch (error) {
        console.log(error);
      }
    }
    const m: playlistSongs = {
      youtubeId: id,
      title: title,
      artists: artist,
      thumbnailUrl: cover,
    };

    dispatch(setPlaylist([m]));

    if (data) {
      dispatch(setPlaylist(data));
      dispatch(setCurrentIndex(0));
      dispatch(SetPlaylistOrAlbum("suggested"));
    }
    dispatch(setCurrentArtistId(artistId));
    dispatch(SetPlaylistOrAlbum("suggested"));
    if (!isPlaying) dispatch(play(true));
  }, [
    isPlaying,
    title,
    id,
    artist,
    uid,
    cover,
    dispatch,
    artistId,
    data,
    fromSearch,
    artistName,
  ]);

  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );
  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );
  const c = useImage(cover);

  return (
    <div className="flex  animate-fade-up flex-col py-2 space-y-2 ">
      <div className="overflow-hidden  space-y-2">
        <AspectRatio ratio={4 / 5} className=" rounded-xl overflow-hidden">
          <LazyLoadImage
            onClick={handlePlay}
            src={c ? c : "/cache.jpg"}
            width="100%"
            height="100%"
            effect="blur"
            alt="Image"
            loading="lazy"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/cache.jpg")
            }
            className="rounded-xl object-cover object-center h-[100%] w-[100%]"
          />
        </AspectRatio>
      </div>
      <div className=" flex justify-between ">
        <div className="flex space-y-0.5 px-1 flex-col  text-start w-[85dvw]">
          <p
            onClick={handlePlay}
            className={`w-[80dvw] ${
              playlist[currentIndex]?.youtubeId == audio &&
              currentIndex == 0 &&
              "text-red-500"
            }  truncate text-2xl leading-tight tracking-tighter font-semibold`}
          >
            {title}
          </p>
          <Link to={`/artist/${artistId}`} className="w-[70dvw]">
            <p className="  -mt-0.5 text-zinc-400 leading-tight text-sm w-[70dvw]   truncate">
              {artist[0]?.name || artistName}
            </p>
          </Link>
          {/* <div className="h-[.05rem] w-full bg-zinc-300/10 mt-1.5"></div> */}
        </div>
        <SongsOptions
          underline={true}
          music={{
            youtubeId: id,
            title: title,
            thumbnailUrl: cover,
            artists: [
              { id: artistId, name: artist[0]?.name || artistName || "" },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default FeedSong;
