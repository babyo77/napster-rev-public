import { homePagePlaylist } from "@/Interface";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import "react-lazy-load-image-component/src/effects/blur.css";

function Artist({ data }: { data: homePagePlaylist[] }) {
  return (
    <>
      {!data && (
        <div className="flex px-4  space-x-4 items-start w-full mt-5">
          <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
          <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
          <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
        </div>
      )}
      {data && (
        <>
          <div className="flex  flex-col px-4 py-2 ">
            <h1 className="text-start font-semibold text-xl">Top Artist</h1>
          </div>
          <div className="flex  space-x-3 px-4 overflow-x-auto pb-1  items-center">
            {data.map((artist) => (
              <Link to={`/artist/${artist.url}`} key={artist.url}>
                <div className="flex fade-in items-center mt-0.5 overflow-x-scroll  ">
                  <div>
                    <div className=" h-20 w-20 mb-1">
                      <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="blur"
                        src={artist.image}
                        alt="Image"
                        className="rounded-full object-cover h-[100%] w-[100%]"
                      />
                    </div>
                    <h1 className="text-center text-sm truncate  w-20">
                      {artist.type}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Artist;
