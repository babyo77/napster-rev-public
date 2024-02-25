import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import { homePagePlaylist } from "@/Interface";
const Charts: React.FC<{ data: homePagePlaylist[] }> = ({ data }) => {
  return (
    <>
      {data && (
        <>
          <div className="flex  flex-col px-4 pt-1 pb-2 ">
            <h1 className="text-start font-semibold text-xl">Charts</h1>
          </div>
          <div className="flex  space-x-4 px-4 overflow-x-auto  pb-1.5 no-scrollbar ">
            {data.map((p) => (
              <Link to={`/library/${p.url}`} key={p.url}>
                <div className="flex items-center mt-1  relative  ">
                  <div className=" h-36 w-36">
                    <LazyLoadImage
                      width="100%"
                      height="100%"
                      effect="blur"
                      src={p.image}
                      alt="Image"
                      className="rounded-lg object-cover h-[100%] w-[100%]"
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

export default Charts;
