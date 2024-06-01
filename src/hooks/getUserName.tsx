import { savedPlaylist } from "@/Interface";
import {
  DATABASE_ID,
  NEW_USER,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import User from "@/user/User";
import { Query } from "appwrite";
import { useQuery } from "react-query";

export default function GetUserName({ id }: { id: string | undefined }) {
  const getUser = async () => {
    const user = await db.listDocuments(DATABASE_ID, NEW_USER, [
      Query.equal("user", [id ? id : ""]),
      Query.limit(1),
    ]);

    return user.documents as unknown as User[];
  };

  const { data: user, isLoading: userLoading } = useQuery<User[]>(
    ["user", id],
    getUser,
    {
      staleTime: Infinity,
      retry: 5,
    }
  );
  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || ""]),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data: savedPlaylist } = useQuery(
    ["savedPublicPlaylists", id],
    loadSavedPlaylist,
    {
      staleTime: Infinity,
    }
  );
  return { user, userLoading, savedPlaylist };
}
