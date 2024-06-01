import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import axios from "axios";
import { playlistSongs } from "@/Interface";
import { useQuery } from "react-query";
import { SearchApi, SuggestionSearchApi } from "@/API/api";
import SkeletonP from "@/components/Library/SkeletonP";
import useImage from "@/hooks/useImage";
import { SetStateAction, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import {
  SetPlaylistOrAlbum,
  setCurrentIndex,
  setPlayingPlaylistUrl,
  setPlaylist,
} from "@/Store/Player";
import { toast } from "@/components/ui/use-toast";

function AIsong({
  name,
  setPlaylistData,
}: {
  name: string;
  setPlaylistData: React.Dispatch<SetStateAction<[] | playlistSongs[]>>;
}) {
  const query = useCallback(async () => {
    if (name) {
      const q = await axios.get(`${SearchApi}${name}`);
      const r = q.data.filter(
        (r: playlistSongs) => r.youtubeId && r.artists && r.thumbnailUrl
      ) as playlistSongs[];

      const suggestion = await axios.get(
        `${SuggestionSearchApi}${r[0].youtubeId}`
      );
      const newSuggestions = (suggestion.data as playlistSongs[])
        .slice(1, suggestion.data.length)
        .filter(
          (r: playlistSongs) => r.youtubeId && r.artists && r.thumbnailUrl
        ) as playlistSongs[];

      setPlaylistData((prev) => [...prev, r[0]]);

      return [r[0], ...newSuggestions];
    } else {
      return [];
    }
  }, [name, setPlaylistData]);

  const { data, isLoading } = useQuery<playlistSongs[]>(
    ["search", name],
    query,
    {}
  );
  const dispatch = useDispatch();
  const playlist = useSelector((state: RootState) => state.musicReducer.queue);
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );

  const handlePlay = useCallback(async () => {
    if (data) {
      dispatch(setPlaylist(data));
      dispatch(SetPlaylistOrAlbum("suggested"));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(""));
      toast({
        duration: 2000,
        description: `Playing... 👻`,
      });
    }
  }, [dispatch, data]);
  const image = useImage(data ? data[0]?.thumbnailUrl : "/cache.jpg");

  if (isLoading) {
    return <SkeletonP hidden />;
  }
  return (
    <>
      {data && (
        <div
          onClick={handlePlay}
          className="w-full flex items-center space-x-2"
        >
          <div className="overflow-hidden h-14 w-14 space-y-2">
            {" "}
            <AspectRatio ratio={1 / 1} className=" -md overflow-hidden">
              <img
                width="100%"
                height="100%"
                alt="Image"
                src={image ? image : "/cache.jpg"}
                loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                  (e.currentTarget.src = "/cache.jpg")
                }
                className="-md object-cover h-[100%] w-[100%]"
              />
            </AspectRatio>
          </div>
          <div>
            <p
              className={`w-[70dvw] ${
                playlist[currentIndex]?.youtubeId == data[0]?.youtubeId
                  ? "text-red-500"
                  : "text-zinc-100"
              } truncate text-lg tracking-tight leading-tight`}
            >
              {data[0]?.title}
            </p>
            <p className="w-[50dvw] truncate tracking-tight leading-tight text-sm text-zinc-400">
              {data[0]?.artists[0]?.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AIsong;
