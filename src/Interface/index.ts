interface playlistSongs {
  youtubeId: string;
  title: string;
  artists: artists[];
  thumbnailUrl: string;
}

interface homePagePlaylist {
  image: string;
  url: string;
  type: string;
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

interface SearchPlaylist {
  playlistId: string;
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
interface suggestedArtists {
  artistId: string;
  name: string;
  thumbnailUrl: string;
}

interface thumbnails {
  url: string;
}
interface ArtistDetails {
  artistId: string;
  name: string;
  albums: albums[];
  singles: albums[];
  suggestedArtists: suggestedArtists[];
  thumbnails: thumbnails[];
}

interface likedSongs {
  for: string;
  youtubeId: string;
  artists: artists[];
  title: string;
  thumbnailUrl: string;
}

interface savedPlaylist {
  $id?: string;
  name: string;
  creator: string;
  link: string;
  for: string;
}

export type {
  playlistSongs,
  SearchPlaylist,
  artists,
  homePagePlaylist,
  trending,
  savedPlaylist,
  AlbumSongs,
  recentSearch,
  albums,
  likedSongs,
  ArtistDetails,
  suggestedArtists,
};
