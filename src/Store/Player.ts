import { playlistSongs, spotifyTransfer } from "@/Interface";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";

interface Player {
  user: boolean;
  playlistUrl: string;
  playingPlaylistUrl: string;
  playlist: playlistSongs[];
  sleepTimer: NodeJS.Timeout | null | "end";
  isPlaying: boolean;
  currentIndex: number;
  isIphone: boolean;
  nextQueue: number;
  queue: playlistSongs[];
  search: string;
  currentPlaying: playlistSongs | null;
  currentToggle: string;
  searchToggle: string;
  PlaylistOrAlbum: string;
  progress: number | "--:--";
  duration: number | "--:--";
  isLoading: boolean;
  isLoop: boolean;
  uid: string | null;
  stopPlaying: boolean;
  SpotifyProgress: number;
  Feed: playlistSongs[];
  isLikedSong: boolean;
  spotifyTrack: spotifyTransfer | null;
  currentArtistId: string;
  sharePlayConnected: boolean;
  reels: playlistSongs[];
  loggedIn: boolean;
  reelsIndex: number;
  limit: number;
  sentQue: string[];
}

const initialState: Player = {
  isLikedSong: false,
  loggedIn: false,
  stopPlaying: false,
  sleepTimer: null,
  user: false,
  uid: localStorage.getItem("uid"),
  currentArtistId: "",
  isIphone: false,
  spotifyTrack: null,
  PlaylistOrAlbum: "",
  playingPlaylistUrl: "",
  progress: 0,
  duration: 0,
  SpotifyProgress: 0,
  isLoop: false,
  sentQue: [],
  Feed: [],
  sharePlayConnected: false,
  currentToggle: "Playlists",
  searchToggle: "Music",
  playlistUrl: "",
  isLoading: false,
  queue: [],
  playlist: [],
  nextQueue: 1,
  isPlaying: false,
  currentPlaying: null,
  currentIndex: 0,
  reelsIndex: 0,
  search: "",
  limit: 0,
  reels: [],
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
    SetSleepTimer: (
      state,
      action: PayloadAction<NodeJS.Timeout | null | "end">
    ) => {
      state.sleepTimer = action.payload;
    },
    Setuid: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
    SetSentQue: (state, action: PayloadAction<string[]>) => {
      state.sentQue = action.payload;
    },
    SetCurrentPlaying: (state, action: PayloadAction<playlistSongs>) => {
      state.currentPlaying = action.payload;
    },
    SetFeed: (state, action: PayloadAction<playlistSongs[]>) => {
      state.Feed = action.payload;
    },
    SetStopPlaying: (state, action: PayloadAction<boolean>) => {
      state.stopPlaying = action.payload;
    },
    SetQueue: (state, action: PayloadAction<playlistSongs[]>) => {
      state.queue = action.payload;
    },
    SetReels: (state, action: PayloadAction<playlistSongs[]>) => {
      state.reels = action.payload;
    },
    SetLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    SetSpotifyProgress: (state, action: PayloadAction<number>) => {
      state.SpotifyProgress = action.payload;
    },

    SetSharePlayConnected: (state, action: PayloadAction<boolean>) => {
      state.sharePlayConnected = action.payload;
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
    setReelsIndex: (state, action: PayloadAction<number>) => {
      state.reelsIndex = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
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

    setSpotifyTrack: (state, action: PayloadAction<spotifyTransfer | null>) => {
      state.spotifyTrack = action.payload;
    },
    setUser: (state, action: PayloadAction<boolean>) => {
      state.user = action.payload;
    },
  },
});

export const selectLyricsProgress = (state: RootState) =>
  state.musicReducer.progress;

export const selectMemoizedLyricsProgress = createSelector(
  [selectLyricsProgress],
  (progress) => progress
);

export const {
  shuffle,
  Setuid,
  setUser,
  play,
  SetSleepTimer,
  SetSharePlayConnected,
  SetLoggedIn,
  SetStopPlaying,
  setCurrentToggle,
  SetSentQue,
  SetPlaylistOrAlbum,
  setPlaylist,
  setCurrentIndex,
  SetQueue,
  SetCurrentPlaying,
  setLimit,
  setSearchToggle,
  setNextQueue,
  SetFeed,
  setSearch,
  setReelsIndex,
  SetReels,
  SetSpotifyProgress,
  setSpotifyTrack,
  setPlaylistUrl,
  setIsLikedSong,
  setIsLoading,
  isLoop,
  setProgressLyrics,
  setNextPrev,
  setIsIphone,
  setCurrentArtistId,
  setDurationLyrics,
  setPlayingPlaylistUrl,
} = MusicPlayer.actions;
export default MusicPlayer.reducer;
