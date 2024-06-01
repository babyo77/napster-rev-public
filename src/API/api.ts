const mainApi = import.meta.env.VITE_API_URL;
const aiApi = import.meta.env.VITE_AI_URL;
const ReelsStreamApi = import.meta.env.VITE_REELAPI_URL;
const SharePlayApi = import.meta.env.VITE_SOCKET_URL;
const STREAM = JSON.parse(import.meta.env.VITE_STREAM_URL);
const DOWNLOAD = JSON.parse(import.meta.env.VITE_DOWNLOAD_URL);

const streamApi = STREAM[Math.floor(Math.random() * STREAM.length)];
const downloadApi = DOWNLOAD[Math.floor(Math.random() * STREAM.length)];
const isPlaylist = `${mainApi}/is/p?l=`;
const SuggestionSearchApi = `${mainApi}/ss/`;
const SearchApi = `${mainApi}/s/`;
const GetPlaylistSongsApi = `${mainApi}/ps/`;
const GetPlaylistHundredSongsApi = `${mainApi}/psh/`;
const GetTrack = `${mainApi}/track?t=`;
const getArtistsDetailsByName = `${mainApi}/gabyname/`;
const SearchPlaylistApi = `${mainApi}/p/`;
const getPlaylistDetails = `${mainApi}/gpd/`;
const SearchArtist = `${mainApi}/a/`;
const GetArtistDetails = `${mainApi}/ga/`;
const SearchAlbum = `${mainApi}/al/`;
const GetAlbumSongs = `${mainApi}/gas/`;
const GetLyrics = `${mainApi}/lrc/`;
const GetImage = ``;
const TransferFromSpotifyApi = `${mainApi}/get/?id=`;
const SearchOneTrackApi = `${mainApi}/one/?t=`;
const getSpotifyProfile = `${mainApi}/spotifyProfile/`;
const getUserApi = `${mainApi}/user/`;
const sendNotificationApi = `${mainApi}/notify/`;

export {
  ReelsStreamApi,
  aiApi,
  getSpotifyProfile,
  sendNotificationApi,
  getUserApi,
  SharePlayApi,
  SearchOneTrackApi,
  TransferFromSpotifyApi,
  GetImage,
  GetLyrics,
  streamApi,
  getArtistsDetailsByName,
  isPlaylist,
  SuggestionSearchApi,
  SearchApi,
  GetPlaylistSongsApi,
  GetPlaylistHundredSongsApi,
  SearchPlaylistApi,
  SearchArtist,
  GetTrack,
  GetArtistDetails,
  SearchAlbum,
  downloadApi,
  getPlaylistDetails,
  GetAlbumSongs,
};
