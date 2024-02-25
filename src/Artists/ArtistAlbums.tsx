import { albums } from "@/Interface";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const ArtistAlbums: React.FC<albums> = ({
  albumId,
  thumbnailUrl,
  title,
  artistId,
}) => {
  return (
    <Link to={`/album/${albumId}?id=${artistId}`}>
      <div className="flex items-center justify-center mt-0.5  px-4">
        <div>
          <div className=" h-36 w-36">
            <LazyLoadImage
              width="100%"
              height="100%"
              effect="blur"
              src={thumbnailUrl}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/demo3.jpeg")
              }
              alt="Image"
              className="rounded-lg object-cover h-[100%] w-[100%]"
            />
          </div>
          <h1 className=" truncate pt-2 w-[7rem] overflow-hidden">{title}</h1>
        </div>
      </div>
    </Link>
  );
};

export default ArtistAlbums;
