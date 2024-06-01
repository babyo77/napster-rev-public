import { albums } from "@/Interface";
import useImage from "@/hooks/useImage";

import { Link } from "react-router-dom";

const ArtistAlbums: React.FC<albums> = ({
  albumId,
  thumbnailUrl,
  title,
  artistId,
}) => {
  const image = useImage(thumbnailUrl);

  return (
    <Link to={`/album/${albumId}?id=${artistId}`}>
      <div className="flex items-center  justify-center mt-0.5  px-3">
        <div>
          <div className=" h-36 w-36">
            <img
              width="100%"
              height="100%"
              src={image ? image : "/cache.jpg"}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/cache.jpg")
              }
              alt="Image"
              className="-lg animate-fade-right object-cover h-[100%] w-[100%]"
            />
          </div>
          <h1 className=" truncate pt-2 animate-fade-right w-[8.1rem] overflow-hidden">
            {title}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default ArtistAlbums;
