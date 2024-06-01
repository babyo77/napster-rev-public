import { RootState } from "@/Store/Store";
import { useCallback } from "react";
import { useSelector } from "react-redux";

function useHandleFocus() {
  const currentIndex = useSelector(
    (state: RootState) => state.musicReducer.currentIndex
  );

  const playlist = useSelector(
    (state: RootState) => state.musicReducer.playlist
  );

  const handleFocus = useCallback(() => {
    const toFocus = document.getElementById(playlist[currentIndex].youtubeId);
    toFocus?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex, playlist]);

  return { handleFocus };
}

export default useHandleFocus;
