import { playlistSongs } from "@/Interface";
import { SetQueue, setPlaylist } from "@/Store/Player";
import React from "react";
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
      console.log(playlist);

      dispatch(SetQueue(playlist as unknown as playlistSongs[]));
      dispatch(setPlaylist(playlist as unknown as playlistSongs[]));
      navigate("/suggested/");
    }
  };

  return (
    <div className=" flex justify-center items-center h-[95dvh] w-full">
      <label htmlFor="file" className=" bg-zinc-800 px-4 py-3 rounded-xl">
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
