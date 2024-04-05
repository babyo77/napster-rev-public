import { savedPlaylist, playlistSongs, suggestedArtists } from "@/Interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Player {
  playlistUrl: string;
  playingPlaylistUrl: string;
  playlist: playlistSongs[];
  isPlaying: boolean;
  currentIndex: number;
  isIphone: boolean;
  nextQueue: number;
  queue: playlistSongs[];
  music: HTMLAudioElement | null;
  search: string;
  feedMode: boolean;
  currentPlaying: playlistSongs | null;
  currentSongId: string;
  currentToggle: string;
  searchToggle: string;
  PlaylistOrAlbum: string;
  progress: number | "--:--";
  duration: number | "--:--";
  isLoading: boolean;
  isLoop: boolean;
  seek: number;
  uid: string | null;
  lastPlayed: boolean;
  sharePlayCode: string;
  Feed: playlistSongs[];
  isLikedSong: boolean;
  currentArtistId: string;
  savedPlaylist: savedPlaylist[];
  savedAlbums: savedPlaylist[];
  savedArtists: suggestedArtists[];
  sharePlayConnected: boolean;
  shareLyrics:
    | [
        {
          time: number | string;
          lyrics: string;
        }
      ]
    | null;
}

const initialState: Player = {
  isLikedSong: false,
  sharePlayCode: "",
  lastPlayed: false,
  uid: localStorage.getItem("uid"),
  currentArtistId: "",
  isIphone: false,
  PlaylistOrAlbum: "",
  playingPlaylistUrl: "",
  progress: "--:--",
  duration: "--:--",
  isLoop: false,
  seek: 0,
  feedMode: true,
  Feed: [],
  sharePlayConnected: false,
  currentToggle: "Playlists",
  searchToggle: "Music",
  shareLyrics: null,
  playlistUrl: "",
  isLoading: false,
  queue: [],
  playlist: [],
  nextQueue: 1,
  isPlaying: false,
  currentPlaying: null,
  currentIndex: 0,
  music: null,
  currentSongId: "",
  search: "",
  savedPlaylist: [],
  savedAlbums: [],
  savedArtists: [],
};

const MusicPlayer = createSlice({
  name: "Music",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    shuffle: (state, action: PayloadAction<playlistSongs[]>) => {
      const s = [...action.payload];
      for (let i = s.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s[i], s[j]] = [s[j], s[i]];
      }

      state.playlist = s;
    },
    SetPlaylistOrAlbum: (state, action: PayloadAction<string>) => {
      state.PlaylistOrAlbum = action.payload;
    },
    SetCurrentPlaying: (state, action: PayloadAction<playlistSongs>) => {
      state.currentPlaying = action.payload;
    },
    SetFeed: (state, action: PayloadAction<playlistSongs[]>) => {
      state.Feed = action.payload;
    },
    SetQueue: (state, action: PayloadAction<playlistSongs[]>) => {
      state.queue = action.payload;
    },
    SetLastPlayed: (state, action: PayloadAction<boolean>) => {
      state.lastPlayed = action.payload;
    },
    SetSeek: (state, action: PayloadAction<number>) => {
      state.seek = action.payload;
    },
    SetCurrentSongId: (state, action: PayloadAction<string>) => {
      state.currentSongId = action.payload;
    },
    SetFeedMode: (state, action: PayloadAction<boolean>) => {
      state.feedMode = action.payload;
    },
    SetSharePlayCode: (state, action: PayloadAction<string>) => {
      state.sharePlayCode = action.payload;
    },
    SetSharePlayConnected: (state, action: PayloadAction<boolean>) => {
      state.sharePlayConnected = action.payload;
    },
    SetShareLyrics: (
      state,
      action: PayloadAction<
        | [
            {
              time: number | string;
              lyrics: string;
            }
          ]
        | null
      >
    ) => {
      state.shareLyrics = action.payload;
    },
    isLoop: (state, action: PayloadAction<boolean>) => {
      state.isLoop = action.payload;
    },
    setIsLikedSong: (state, action: PayloadAction<boolean>) => {
      state.isLikedSong = action.payload;
    },
    setCurrentToggle: (state, action: PayloadAction<string>) => {
      state.currentToggle = action.payload;
    },
    setSearchToggle: (state, action: PayloadAction<string>) => {
      state.searchToggle = action.payload;
    },
    setNextQueue: (state, action: PayloadAction<number>) => {
      state.nextQueue = action.payload;
    },
    setPlayingPlaylistUrl: (state, action: PayloadAction<string>) => {
      state.playingPlaylistUrl = action.payload;
    },
    setIsIphone: (state, action: PayloadAction<boolean>) => {
      state.isIphone = action.payload;
    },
    setCurrentArtistId: (state, action: PayloadAction<string>) => {
      state.currentArtistId = action.payload;
    },
    setProgressLyrics: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setDurationLyrics: (state, action: PayloadAction<number | "--:--">) => {
      state.duration = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setPlayer: (state, action: PayloadAction<HTMLAudioElement | null>) => {
      if (state.music == null)
        //@ts-expect-error:fix
        state.music = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPlaylistUrl: (state, action: PayloadAction<string>) => {
      state.playlistUrl = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<playlistSongs[]>) => {
      if (state.queue?.length == 0) {
        state.queue = JSON.parse(JSON.stringify(action.payload));
      }
      state.playlist = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.queue = state.playlist;
      state.currentIndex = action.payload;
    },
    setNextPrev: (state, action: PayloadAction<string>) => {
      state.queue = state.playlist;
      if (action.payload == "prev") {
        state.currentIndex =
          (state.currentIndex - 1 + state.playlist.length) %
          state.playlist.length;
      } else {
        state.currentIndex = (state.currentIndex + 1) % state.playlist.length;
      }
    },
    setSavedPlaylist: (state, action: PayloadAction<savedPlaylist[]>) => {
      state.savedPlaylist = action.payload;
    },
    setSavedAlbums: (state, action: PayloadAction<savedPlaylist[]>) => {
      state.savedAlbums = action.payload;
    },
    setSavedArtists: (state, action: PayloadAction<suggestedArtists[]>) => {
      state.savedArtists = action.payload;
    },
  },
});

export const {
  shuffle,
  play,
  SetFeedMode,
  SetLastPlayed,
  SetSharePlayConnected,
  SetSeek,
  SetShareLyrics,
  setSavedArtists,
  setSavedAlbums,
  SetSharePlayCode,
  setCurrentToggle,
  SetPlaylistOrAlbum,
  setPlaylist,
  setCurrentIndex,
  SetQueue,
  SetCurrentPlaying,
  setPlayer,
  setSearchToggle,
  setNextQueue,
  SetFeed,
  setSearch,
  setPlaylistUrl,
  setSavedPlaylist,
  setIsLikedSong,
  setIsLoading,
  isLoop,
  setNextPrev,
  SetCurrentSongId,
  setProgressLyrics,
  setIsIphone,
  setCurrentArtistId,
  setDurationLyrics,
  setPlayingPlaylistUrl,
} = MusicPlayer.actions;
export default MusicPlayer.reducer;
