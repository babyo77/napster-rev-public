import { savedPlaylist, playlistSongs } from "@/Interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Player {
  playlistUrl: string;
  playingPlaylistUrl: string;
  playlist: playlistSongs[];
  isPlaying: boolean;
  currentIndex: number;
  music: Howl | null;
  search: string;
  PlaylistOrAlbum: string;
  progress: number | "--:--";
  duration: number | "--:--";
  isLoading: boolean;
  isLoop: boolean;
  isLikedSong: boolean;
  currentArtistId: string;
  savedPlaylist: savedPlaylist[];
}

const initialState: Player = {
  isLikedSong: false,
  currentArtistId: "",
  PlaylistOrAlbum: "",
  playingPlaylistUrl: "",
  progress: "--:--",
  duration: "--:--",
  isLoop: false,
  playlistUrl: "",
  isLoading: false,
  playlist: [],
  isPlaying: false,
  currentIndex: 0,
  music: null,
  search: "",
  savedPlaylist: [],
};

const MusicPlayer = createSlice({
  name: "Music",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    SetPlaylistOrAlbum: (state, action: PayloadAction<string>) => {
      state.PlaylistOrAlbum = action.payload;
    },
    isLoop: (state, action: PayloadAction<boolean>) => {
      state.isLoop = action.payload;
    },
    setIsLikedSong: (state, action: PayloadAction<boolean>) => {
      state.isLikedSong = action.payload;
    },
    removePlaylist: (state, action: PayloadAction<string>) => {
      const n = state.savedPlaylist.filter((p) => p.$id !== action.payload);
      state.savedPlaylist = n;
    },
    setPlayingPlaylistUrl: (state, action: PayloadAction<string>) => {
      state.playingPlaylistUrl = action.payload;
    },
    setCurrentArtistId: (state, action: PayloadAction<string>) => {
      state.currentArtistId = action.payload;
    },
    setProgress: (state, action: PayloadAction<number | "--:--">) => {
      state.progress = action.payload;
    },
    setDuration: (state, action: PayloadAction<number | "--:--">) => {
      state.duration = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setPlayer: (state, action: PayloadAction<Howl>) => {
      state.music = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPlaylistUrl: (state, action: PayloadAction<string>) => {
      state.playlistUrl = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<playlistSongs[]>) => {
      state.playlist = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    setSavedPlaylist: (state, action: PayloadAction<savedPlaylist[]>) => {
      state.savedPlaylist = action.payload;
    },
  },
});

export const {
  play,
  SetPlaylistOrAlbum,
  setPlaylist,
  setCurrentIndex,
  setPlayer,
  setSearch,
  removePlaylist,
  setPlaylistUrl,
  setSavedPlaylist,
  setIsLikedSong,
  setIsLoading,
  isLoop,
  setProgress,
  setCurrentArtistId,
  setDuration,
  setPlayingPlaylistUrl,
} = MusicPlayer.actions;
export default MusicPlayer.reducer;
