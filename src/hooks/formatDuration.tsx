import { useCallback } from "react";

function useFormatDuration() {
  const formatDuration = useCallback((num: number | "--:--") => {
    if (typeof num !== "number") {
      return "--:--";
    }
    const minutes = Number(Math.floor(num / 60));
    const seconds = Number(Math.floor(num % 60));

    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }, []);
  return { formatDuration };
}

export default useFormatDuration;
