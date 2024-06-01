import axios from "axios";
import { useQuery } from "react-query";
import { getPlaylistDetails } from "@/API/api";
import { SearchPlaylist } from "@/Interface";
function useSavedAlbum({ link, id }: { link: string | undefined; id: string }) {
  const getAlbumDetail = async () => {
    const list = await axios.get(`${getPlaylistDetails}${link}`);
    return list.data as SearchPlaylist[];
  };

  const { isLoading } = useQuery<SearchPlaylist[]>(
    ["SavedAlbumDetails", id],
    getAlbumDetail,
    {
      retryOnMount: false,
      retry: 0,

      staleTime: 60 * 60000,
    }
  );
  return { isLoading };
}

export default useSavedAlbum;
