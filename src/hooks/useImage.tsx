import axios from "axios";
import { useQuery } from "react-query";

export default function useImage(cover: string) {
  const image = async () => {
    const response = await axios.get(cover, {
      responseType: "arraybuffer",
    });
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return URL.createObjectURL(blob);
  };

  const { data } = useQuery(["image", cover], image, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return data ? data : "/cache.jpg";
}
