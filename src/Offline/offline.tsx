import { playlistSongs } from "@/Interface";
import { SetQueue, setPlaylist } from "@/Store/Player";
import { toast } from "@/components/ui/use-toast";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Offline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const mp3Files = selectedFiles.filter((file) =>
        file.name.endsWith(".mp3")
      );
      const playlist = mp3Files.map((track) => ({
        youtubeId: URL.createObjectURL(track),
        title: track.name.replace(".mp3", ""),
        artists: "",
        thumbnailUrl: "/assets/newfavicon.jpg",
      }));

      if (playlist.length > 0) {
        dispatch(SetQueue(playlist as unknown as playlistSongs[]));
        dispatch(setPlaylist(playlist as unknown as playlistSongs[]));
        navigate("/suggested/");
      } else {
        toast({
          variant: "destructive",
          description: "couldn't find any .mp3 files",
        });
      }
    }
  };

  const loadLocal = useCallback(async () => {
    const cache = await caches.open("audio");

    const keys = await cache.keys();
    const matchingKeys = keys.filter((key) => key.url.includes("metadata-"));
    const playlist = [];
    for (const key of matchingKeys) {
      const res = await cache.match(key);
      if (res) {
        const music = await res.json();

        const audioResponse = await cache.match(music.youtubeId);
        const thumbResponse = await cache.match(music.thumbnailUrl);

        if (audioResponse && thumbResponse) {
          const audioBlob = await audioResponse.blob();
          const thumbBlob = await thumbResponse.blob();
          const audioURL = URL.createObjectURL(audioBlob);
          const thumbnailURL = URL.createObjectURL(thumbBlob);
          const data = {
            youtubeId: audioURL,
            title: music.title,
            artists: music.artists,
            thumbnailUrl: thumbnailURL,
          };
          playlist.push(data);
        } else {
          console.log("Audio or thumbnail not found in cache");
        }
      }
    }

    const refine = playlist.filter((p) => p.youtubeId && p.artists);

    if (refine.length > 0) {
      dispatch(SetQueue(refine as unknown as playlistSongs[]));
      dispatch(setPlaylist(refine as unknown as playlistSongs[]));

      navigate("/suggested/");
    } else {
      toast({
        description: "No Download available",
      });
    }
  }, [dispatch, navigate]);

  return (
    <div className=" flex justify-center flex-col items-center space-y-2 h-[95dvh] w-full">
      <label
        onClick={loadLocal}
        className=" bg-neutral-900 px-4 py-2 rounded-lg"
      >
        Load Downloaded
      </label>
      <label htmlFor="file" className=" bg-neutral-900 px-5 py-2 rounded-lg">
        Load From Local
      </label>
      <input
        type="file"
        accept=".mp3"
        id="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Offline;
