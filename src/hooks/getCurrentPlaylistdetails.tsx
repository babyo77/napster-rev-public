import { savedPlaylist } from "@/Interface";
import { RootState } from "@/Store/Store";
import {
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

export default function useCurrentPlaylist({ id }: { id: string }) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const loadCurrentPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("$id", [id?.replace("custom", "") || ""]),
      Query.startsWith("link", "custom"),
      Query.equal("for", [uid || "default"]),
      Query.limit(1),
    ]);

    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data: currentPlaylist } = useQuery(
    ["currentPlaylist", id],
    loadCurrentPlaylist,
    {
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );
  return { currentPlaylist };
}
