interface playlistSongs {
  $id?: string;
  youtubeId: string;
  for?: string;
  title: string;
  artists: artists[];
  thumbnailUrl: string;
}

interface homePagePlaylist {
  image: string;
  url: string;
  type: string;
}

interface savedProfile {
  $id: string;
  for: string;
  pid: string;
}
interface Sponsors {
  type: string;
  name: string;
  discord: string;
  image: string;
  snapchat: string;
  instagram: string;
  twitter: string;
}

interface spotifyTransfer {
  name: string;
  image: string;
  creator: string;
  tracks: [{ track: string }];
}

interface artists {
  name: string;
  id: string;
}

interface recentSearch {
  $id: string;
  song: string;
  user: string;
}

interface lyrics {
  title: string;
  lyrics: string;
}

interface SearchPlaylist {
  name?: string;
  fromSearch?: boolean;
  playlistId: string;
  for?: string;
  title: string;
  totalSongs?: number;
  thumbnailUrl: string;
}

interface AlbumSongs {
  youtubeId: string;
  artists: artists[];
  title: string;
  album: string;
  thumbnailUrl: string;
}
interface trending {
  song: string;
}

interface albums {
  artistId?: string;
  title: string;
  type: string;
  albumId: string;
  year: string;
  thumbnailUrl: string;
}

interface searchAlbumsInterface {
  fromSearch?: boolean;
  albumId: string;
  title: string;
  thumbnailUrl: string;
}
interface suggestedArtists {
  fromSearch?: boolean;
  artistId: string;
  name: string;
  thumbnailUrl: string;
}

interface profiles {
  user: string;
  ios?: string;
  name?: string;
  image?: string;
  spotifyId?: string;
}

interface thumbnails {
  url: string;
}
interface ArtistDetails {
  artistId: string;
  name: string;
  albums: albums[];
  singles: albums[];
  subscribers?: string;

  suggestedArtists: suggestedArtists[];
  thumbnails: thumbnails[];
  songsPlaylistId: string;
}

interface lastPlayed {
  seek: number;
  user: string;
  playlisturl: string;
  navigator: string;
  curentsongid: string;
  index: number;
}
interface likedSongs {
  type?: "album" | "playlist" | "music" | "artist" | "profile";
  for: string;
  name?: string;
  user?: string;
  image?: string;
  $id: string;
  youtubeId: string;
  artists: artists[];
  title: string;
  thumbnailUrl: string;
}

interface savedPlaylist {
  image?: string;
  artistId?: string;
  $id?: string;
  name: string;
  creator: string;
  link: string;
  for: string;
}

interface favArtist {
  for: string;
  $id: string;
  artistId: string;
}
export type {
  favArtist,
  lyrics,
  playlistSongs,
  SearchPlaylist,
  artists,
  homePagePlaylist,
  trending,
  savedPlaylist,
  AlbumSongs,
  recentSearch,
  Sponsors,
  lastPlayed,
  spotifyTransfer,
  albums,
  profiles,
  likedSongs,
  ArtistDetails,
  suggestedArtists,
  savedProfile,
  searchAlbumsInterface,
};
