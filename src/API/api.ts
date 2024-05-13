const mainApi = import.meta.env.VITE_API_URL;
const isIPhone = /iPhone/i.test(navigator.userAgent);

const STREAM = [
  "https://exotic-cloe-babyo77.koyeb.app/?url=",
  "https://unconscious-elianora-babyo7.koyeb.app/?url=",
  "https://architectural-consuela-krsna.koyeb.app/?url=",
];
const DOWNLOAD = [
  "https://exotic-cloe-babyo77.koyeb.app/download?url=",
  "https://unconscious-elianora-babyo7.koyeb.app/download?url=",
  "https://architectural-consuela-krsna.koyeb.app/download/?url=",
];

const streamApi = isIPhone
  ? STREAM[Math.floor(Math.random() * STREAM.length)]
  : "https://economic-glynda-groot.koyeb.app?url=";

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

const GetImage = `${"https://image-proxy-psi.vercel.app"}/image/?img=`;

const TransferFromSpotifyApi = `${mainApi}/get/?id=`;

const SearchOneTrackApi = `${mainApi}/one/?t=`;

const SharePlayApi = "https://napster-share-play.onrender.com/";

const getSpotifyProfile = `${mainApi}/spotifyProfile/`;

const getUserApi = `${mainApi}/user/`;

const ReelsApi = `${"https://reels-phi.vercel.app"}/reels/`;

const ReelsInfoApi = `${"https://reels-phi.vercel.app"}/info/?url=`;

const sendNotificationApi = `${mainApi}/notify/`;

export {
  getSpotifyProfile,
  sendNotificationApi,
  ReelsApi,
  ReelsInfoApi,
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
