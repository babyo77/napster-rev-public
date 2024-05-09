import { likedSongs } from "@/Interface";
import SearchSong from "./SearchSong";
import { ArtistSearch } from "./artistSearch";
import { AlbumSearchComp } from "./albumSearch";
import { PlaylistSearchComp } from "./playlistSearch";
import { ProfileSearch } from "./Profile";

function RecentSearchesComp({ r }: { r: likedSongs }) {
  if (r.type === "music") {
    return (
      <SearchSong
        fromSearch={true}
        //@ts-expect-error:custom
        artistId={r.artists[0]}
        //@ts-expect-error:custom
        artistName={r.artists[1]}
        audio={r.youtubeId}
        id={r.youtubeId}
        key={r.youtubeId}
        title={r.title}
        artist={r.artists}
        cover={r.thumbnailUrl}
      />
    );
  }
  if (r.type === "artist") {
    return (
      <ArtistSearch
        fromSearch={true}
        key={r.title + r.youtubeId}
        name={r.title}
        artistId={r.youtubeId}
        thumbnailUrl={r.thumbnailUrl}
      />
    );
  }
  if (r.type === "profile") {
    return (
      <ProfileSearch
        fromSearch={true}
        key={r.title + r.youtubeId}
        name={r.title}
        artistId={r.youtubeId}
        thumbnailUrl={r.thumbnailUrl}
      />
    );
  }
  if (r.type === "playlist") {
    return (
      <PlaylistSearchComp
        fromSearch={true}
        key={r.thumbnailUrl + r.youtubeId}
        playlistId={r.youtubeId.replace("VL", "").replace("MPSP", "")}
        thumbnailUrl={r.thumbnailUrl}
        title={r.title}
      />
    );
  }
  if (r.type === "album") {
    return (
      <AlbumSearchComp
        fromSearch={true}
        key={r.youtubeId + r.title}
        title={r.title}
        albumId={r.youtubeId}
        thumbnailUrl={r.thumbnailUrl}
      />
    );
  }
}

export default RecentSearchesComp;
