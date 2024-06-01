import { suggestedArtists } from "@/Interface";
import useImage from "@/hooks/useImage";

import { Link } from "react-router-dom";

const SuggestedArtist: React.FC<suggestedArtists> = ({
  thumbnailUrl,
  name,
  artistId,
}) => {
  const image = useImage(thumbnailUrl);
  return (
    <Link to={`/artist/${artistId}`}>
      <div
        id={artistId}
        className="flex items-center  mt-1 overflow-scroll pb-40 space-x-3 px-3"
      >
        <div>
          <div className=" h-20 w-20 mb-1">
            <img
              width="100%"
              height="100%"
              src={image ? image : "/cache.jpg"}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/cache.jpg")
              }
              alt="Image"
              className="rounded-full animate-fade-right object-cover h-[100%] w-[100%]"
            />
          </div>
          <h1 className="text-center animate-fade-right text-xs mt-3 w-[5rem] truncate">
            {name}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default SuggestedArtist;
