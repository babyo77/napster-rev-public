import { suggestedArtists } from "@/Interface";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const SuggestedArtist: React.FC<suggestedArtists> = ({
  thumbnailUrl,
  name,
  artistId,
}) => {
  return (
    <Link to={`/artist/${artistId}`}>
      <div
        id={artistId}
        className="flex items-center fade-in mt-1 overflow-scroll pb-40 space-x-3 px-3"
      >
        <div>
          <div className=" h-20 w-20 mb-1">
            <LazyLoadImage
              width="100%"
              height="100%"
              effect="blur"
              src={thumbnailUrl}
              alt="Image"
              className="rounded-full object-cover h-[100%] w-[100%]"
            />
          </div>
          <h1 className="text-center text-xs mt-3 w-[5rem] truncate">{name}</h1>
        </div>
      </div>
    </Link>
  );
};

export default SuggestedArtist;
