import { useQuery } from "react-query";
import { Skeleton } from "../components/ui/skeleton";
import { BROWSE_ALL, DATABASE_ID, db } from "@/appwrite/appwriteConfig";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
export interface Info {
  title: string;
  link: string[];
}

export interface BrowseItem extends Models.Document {
  name: string;
  gradient: string;
  info: { title: string; link: string[] }[];
  image: string;
}
function BrowseAllCard() {
  const browseAll = async () => {
    const res = await db.listDocuments(DATABASE_ID, BROWSE_ALL);
    return res.documents as BrowseItem[];
  };

  const { data: BrowseAll, isLoading } = useQuery<BrowseItem[]>(
    ["BrowseAll"],
    browseAll,
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );

  if (isLoading) {
    return (
      <>
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
        <Skeleton className="p-14 rounded-md" />
      </>
    );
  }

  return (
    <>
      {BrowseAll &&
        BrowseAll.map(({ name, gradient, info, image }) => (
          <Link
            key={name + gradient}
            to={"/browse_all"}
            state={{ title: name, info: info }}
            className=" relative overflow-hidden"
          >
            <img
              src={image || "/cache.jpg"}
              className="absolute z-10 -bottom-1.5 -right-3.5 rounded-md rotate-[37deg] h-20 w-20"
              alt=""
            />
            <div
              key={name + gradient}
              style={{ background: gradient }}
              className={`p-14 relative rounded-md`}
            >
              <p className=" absolute top-2 left-2 text-lg">{name}</p>
            </div>
          </Link>
        ))}
    </>
  );
}

export default BrowseAllCard;
