import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import { homePagePlaylist } from "@/Interface";
import { Skeleton } from "../ui/skeleton";
const NapsterSuggested: React.FC<{ data: homePagePlaylist[] }> = ({ data }) => {
  return (
    <>
      {!data && (
        <div className="flex px-4 justify-center space-x-4 items-center w-full mt-5">
          <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
          <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
        </div>
      )}
      {data && (
        <>
          <div className="flex  flex-col px-4 pb-2 ">
            <h1 className="text-start font-semibold text-xl">You might like</h1>
          </div>
          <div className="flex  space-x-3.5 px-4 overflow-x-auto  pb-2 no-scrollbar ">
            {data.map((p) => (
              <Link to={`/library/${p.url}?c=${p.image}`} key={p.url}>
                <div className="flex  fade-in  items-center mt-1  relative  ">
                  <div className=" h-48 w-32">
                    <LazyLoadImage
                      width="100%"
                      height="100%"
                      effect="blur"
                      src={p.image}
                      alt="Image"
                      className="rounded-lg object-cover  h-[100%] w-[100%]"
                    />
                  </div>
                  <div className=" bottom-3 right-2.5  absolute">
                    <FaCirclePlay className="h-7 w-7" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default NapsterSuggested;
