import GoBack from "@/components/Goback";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import BrowsePlaylistCard from "./BrowsePlaylistCard";
interface StateProp {
  title: string;
  link: string[];
}
function BrowseAll() {
  const location = useLocation();
  const [data] = useState<StateProp[]>(() => JSON.parse(location.state.info));

  return (
    <>
      <div className="absolute top-3 z-10 right-4 flex-col space-y-0.5">
        <div className="w-fit -mr-2">
          <p className=" mb-2 text-zinc-100 animate-fade-left backdrop-blur-md bg-black/0 rounded-lg p-1.5 px-2 w-fit text-2xl font-medium leading-tight">
            {location.state.title}
          </p>
        </div>
      </div>
      <GoBack />

      <div className="pt-16 mt-1.5 pb-40 space-y-7">
        {data.map((data, i) => (
          <div key={data.title + i} className="flex  flex-col space-y-2">
            <div className="px-4">
              <p className=" text-xl leading-tight font-semibold tracking-tight">
                {data.title}
              </p>
            </div>
            <div className=" flex items-center overflow-x-scroll">
              {data.link.map((link, i) => (
                <BrowsePlaylistCard key={link + i} id={link} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BrowseAll;
