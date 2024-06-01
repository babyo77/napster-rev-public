import { Skeleton } from "@/components/ui/skeleton";
import useLibrary from "@/hooks/useLibrary";
import { Link } from "react-router-dom";

function BrowsePlaylistCard({ id }: { id: string }) {
  const { pDetails, isLoading, c2 } = useLibrary({ id });
  if (pDetails && pDetails[0].title.trim() == "") {
    return;
  }
  return (
    <>
      {isLoading ? (
        <div className="flex items-center flex-col space-y-2  justify-center mt-0.5 pl-3">
          <Skeleton className="h-40 w-40 -mt-1 rounded-none mb-0.5" />
          <Skeleton className=" truncate rounded-none  pt-2 animate-fade-right w-full overflow-hidden h-5"></Skeleton>
        </div>
      ) : (
        <Link to={`/library/${id}`}>
          <div className="flex items-center  justify-center mt-0.5 pl-3">
            <div>
              <div className=" h-40 w-40">
                <img
                  width="100%"
                  height="100%"
                  src={c2 ? c2 : "/cache.jpg"}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                    (e.currentTarget.src = "/cache.jpg")
                  }
                  alt="Image"
                  className="-lg animate-fade-right object-cover h-[100%] w-[100%]"
                />
              </div>
              <h1 className=" truncate pt-2 animate-fade-right w-[8.1rem] overflow-hidden">
                {(pDetails && pDetails[0].title) || "Unknown"}
              </h1>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default BrowsePlaylistCard;
