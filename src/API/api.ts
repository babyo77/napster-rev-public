const mainApi = import.meta.env.VITE_API_URL;
const isIPhone = /iPhone/i.test(navigator.userAgent);

const STREAM = ["STREAMING ENDPOINT"];

const DOWNLOAD = ["DOWNLOAD ENDPOINT"];

const streamApi = isIPhone
  ? STREAM[Math.floor(Math.random() * STREAM.length)]
  : "ANDROID STREAMING ENDPOINT";

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

const GetImage = `${mainApi}/image/?img=`;

const TransferFromSpotifyApi = `${mainApi}/get/?id=`;

const SearchOneTrackApi = `${mainApi}/one/?t=`;

const SharePlayApi = `YOUR SOCKET URL`;

const getUserApi = `${mainApi}/user/`;

const ReelsApi = `${mainApi}/reels/`;

const sendNotificationApi = `${mainApi}/notify/`;

export {
  sendNotificationApi,
  ReelsApi,
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
