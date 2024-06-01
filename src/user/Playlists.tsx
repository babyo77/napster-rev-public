import { savedPlaylist } from "@/Interface";
import {
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import GoBack from "@/components/Goback";
import SavedLibraryCard from "@/components/Library/SavedLibraryCard";
import Loader from "@/components/Loaders/Loader";
import { Query } from "appwrite";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

function Playlists() {
  const { id } = useParams();

  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || ""]),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data: savedPlaylist, isLoading } = useQuery(
    ["savedPublicPlaylists", id],
    loadSavedPlaylist,
    {
      staleTime: Infinity,
    }
  );
  return (
    <>
      <GoBack />
      {isLoading ? (
        <div className=" h-dvh flex items-center justify-center">
          <Loader color="white" />
        </div>
      ) : (
        <>
          <div className="flex  py-16 flex-col px-5">
            <div className=" space-y-3">
              {savedPlaylist &&
                savedPlaylist.map((saved, id) => (
                  <SavedLibraryCard
                    className
                    key={saved.link + id}
                    id={saved.$id || ""}
                    data={saved}
                    author={saved.creator}
                    link={saved.link}
                    f={saved.for}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Playlists;
