import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPlaylistOrAlbum,
  isLoop,
  play,
  setCurrentIndex,
  setPlayingPlaylistUrl,
  setPlaylist,
  shuffle,
} from "@/Store/Player";
import { useCallback } from "react";
import { RootState } from "@/Store/Store";
import { Query } from "appwrite";
import { DATABASE_ID, EDITS, LIKE_SONG, db } from "@/appwrite/appwriteConfig";
import { likedSongs } from "@/Interface";
function useLikedSongs({
  id,
  edits,
}: {
  id: string | undefined | null;
  edits?: boolean;
}) {
  const dispatch = useDispatch();

  const playingPlaylistUrl = useSelector(
    (state: RootState) => state.musicReducer.playingPlaylistUrl
  );

  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const getPlaylistDetails = useCallback(async () => {
    const r = await db.listDocuments(DATABASE_ID, edits ? EDITS : LIKE_SONG, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [id || uid || ""]),
      Query.limit(50),
    ]);

    const modified = r.documents.map((doc) => ({
      $id: doc.$id,
      for: doc.for,
      youtubeId: doc.youtubeId,
      artists: [
        {
          id: doc.artists[0],
          name: doc.artists[1],
        },
      ],
      title: doc.title,
      thumbnailUrl: doc.thumbnailUrl,
    }));
    return modified;
  }, [edits, id, uid]);

  const isPlaying = useSelector(
    (state: RootState) => state.musicReducer.isPlaying
  );

  const {
    isLoading: pLoading,
    isError: pError,
    refetch: pRefetch,
    data: pDetails,
  } = useQuery<likedSongs[]>(
    [edits ? "editSongDetails" : "likedSongsDetails", id],
    getPlaylistDetails,
    {
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );
  const handleShufflePlay = useCallback(async () => {
    if (pDetails) {
      dispatch(shuffle(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum(edits ? "edits" : "liked"));
      if (pDetails.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, pDetails, isPlaying, id, edits]);
  const handlePlay = useCallback(() => {
    if (pDetails) {
      dispatch(setPlaylist(pDetails));
      dispatch(setCurrentIndex(0));
      dispatch(setPlayingPlaylistUrl(id || ""));
      dispatch(SetPlaylistOrAlbum(edits ? "edits" : "liked"));
      if (pDetails.length == 1) {
        dispatch(isLoop(true));
      } else {
        dispatch(isLoop(false));
      }
      if (!isPlaying) {
        dispatch(play(true));
      }
    }
  }, [dispatch, isPlaying, id, pDetails, edits]);

  return {
    handlePlay,
    handleShufflePlay,
    pLoading,
    pDetails,
    pRefetch,
    pError,
    uid,
    playingPlaylistUrl,
  };
}

export default useLikedSongs;
