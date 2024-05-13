import { savedPlaylist, savedProfile, suggestedArtists } from "@/Interface";
import {
  setPlaylistUrl,
  setSavedAlbums,
  setSavedArtists,
  setSavedPlaylist,
  setSavedProfile,
} from "@/Store/Player";
import { RootState } from "@/Store/Store";
import {
  ALBUM_COLLECTION_ID,
  DATABASE_ID,
  FAV_ARTIST,
  FAV_PROFILES,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

function useSaved() {
  const dispatch = useDispatch();

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const loadSavedPlaylist = async () => {
    const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(70),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data, isLoading } = useQuery("savedPlaylist", loadSavedPlaylist, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 10000,
  });

  const loadSavedAlbums = async () => {
    const r = await db.listDocuments(DATABASE_ID, ALBUM_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(70),
    ]);
    const p = r.documents as unknown as savedPlaylist[];
    return p;
  };
  const { data: SavedAlbums } = useQuery("savedAlbums", loadSavedAlbums, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 10000,
  });
  const loadSavedArtists = async () => {
    const r = await db.listDocuments(DATABASE_ID, FAV_ARTIST, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(70),
    ]);
    const p = r.documents as unknown as suggestedArtists[];
    return p;
  };
  const { data: SavedArtists } = useQuery("savedArtists", loadSavedArtists, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 10000,
  });
  const loadSavedProfiles = async () => {
    const r = await db.listDocuments(DATABASE_ID, FAV_PROFILES, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [uid || ""]),
      Query.limit(70),
    ]);
    const p = r.documents as unknown as savedProfile[];
    return p;
  };
  const { data: SavedProfiles } = useQuery("savedProfiles", loadSavedProfiles, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 10000,
  });

  useEffect(() => {
    dispatch(setSavedPlaylist([]));
    dispatch(setPlaylistUrl(""));
    if (data) {
      if (SavedAlbums) {
        dispatch(setSavedAlbums(SavedAlbums));
      }
      if (SavedArtists) {
        dispatch(setSavedArtists(SavedArtists));
      }
      if (SavedProfiles) {
        dispatch(setSavedProfile(SavedProfiles));
      }
      dispatch(setSavedPlaylist([...data]));
    }
  }, [dispatch, data, SavedAlbums, SavedArtists, SavedProfiles]);
  return { isLoading };
}

export default useSaved;
