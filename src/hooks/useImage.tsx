// import axios from "axios";
// import { useQuery } from "react-query";

export default function useImage(cover: string) {
  // const image = async () => {
  //   if (cover == "/cache.jpg" || cover.trim() == "") return;
  //   try {
  //     const response = await axios.get(cover, {
  //       responseType: "arraybuffer",
  //     });
  //     const blob = new Blob([response.data], {
  //       type: response.headers["content-type"],
  //     });
  //     return URL.createObjectURL(blob);
  //   } catch (error) {
  //     console.error("image error: " + error);
  //   }
  // };

  // const { data } = useQuery(["image", cover], image, {
  //   staleTime: Infinity,
  // });

  return cover;
}
