import { useSelector } from "react-redux";
import { ArtistDetails, suggestedArtists } from "@/Interface";
import { useCallback } from "react";
import {
  ARTIST_INSIGHTS,
  DATABASE_ID,
  ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Permission, Role } from "appwrite";
import { useQuery } from "react-query";
import { GetArtistDetails } from "@/API/api";
import axios from "axios";
import { RootState } from "@/Store/Store";
import useImage from "@/hooks/useImage";

function useSavedArtist({ name, artistId, thumbnailUrl }: suggestedArtists) {
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const handleClick = useCallback(async () => {
    try {
      if (uid) {
        db.createDocument(
          DATABASE_ID,
          ARTIST_INSIGHTS,
          ID.unique(),
          {
            id: artistId,
            name: name,
            user: uid || "error",
          },
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [artistId, name, uid]);

  const getArtistDetails = useCallback(async () => {
    const list = await axios.get(`${GetArtistDetails}${artistId}`);
    return list.data as ArtistDetails;
  }, [artistId]);

  const { data, refetch } = useQuery<ArtistDetails>(
    ["artist", artistId],
    getArtistDetails,
    {
      retry: 5,

      staleTime: 60 * 60000,
      onSuccess(d) {
        d == null && refetch();
      },
    }
  );

  const c = useImage(
    data
      ? data?.thumbnails[0]?.url.replace("w540-h225", "w1080-h1080")
      : thumbnailUrl
  );

  return { handleClick, c };
}

export default useSavedArtist;
