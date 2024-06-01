import React, { useCallback, useEffect } from "react";
import { toast } from "../ui/use-toast";
import { playlistSongs } from "@/Interface";
import { downloadApi, ReelsStreamApi } from "@/API/api";
import axios from "axios";

const useDownload = ({
  music,
  setDownloaded,
}: {
  music: playlistSongs;
  setDownloaded?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isDownload = useCallback(async () => {
    if (!music) return;
    if (!music.youtubeId) return;
    const cache = await caches.open("audio");

    const keys = await cache.keys();
    const matchingKeys = keys.filter((key) =>
      key.url.includes(
        `metadata-${music.youtubeId.replace(
          `${ReelsStreamApi}?url=https://soundcloud.com`,
          ""
        )}`
      )
    );
    if (matchingKeys.length > 0) {
      if (setDownloaded) {
        setDownloaded(true);
      }
      const res = await cache.match(matchingKeys[0]);
      if (res) {
        const music = await res.json();
        const audioResponse = await cache.match(music.youtubeId);
        if (audioResponse) {
          const url = URL.createObjectURL(await audioResponse.blob());
          return url;
        }
      }

      return true;
    } else {
      if (setDownloaded) {
        setDownloaded(false);
      }
      return false;
    }
  }, [music, setDownloaded]);
  useEffect(() => {
    isDownload();
  }, [isDownload]);
  const handleDownload = useCallback(async () => {
    try {
      const isAlready = await isDownload();
      if (isAlready) {
        toast({
          title: `Already Downloaded ${music.title.split(" ")[0].slice(0, 7)}`,
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-expect-error:error message
        title: "Failed to download or save audio file:" + " " + error.message,
      });
    }
    try {
      toast({
        title: "Downloading...",
      });
      const audioUrl = music.youtubeId.startsWith("http")
        ? `${music.youtubeId}&file=${music.title}`
        : `${downloadApi}${music.youtubeId}&file=${music.title}`;
      const audioResponse = await axios.get(audioUrl, { responseType: "blob" });
      const audioBlob = audioResponse.data;

      const thumbResponse = await axios.get(music.thumbnailUrl, {
        responseType: "blob",
      });
      const thumbBlob = thumbResponse.data;

      const cache = await caches.open("audio");
      await cache.put(
        audioUrl,
        new Response(audioBlob, { headers: { "Content-Type": "audio/mpeg" } })
      );
      await cache.put(
        music.thumbnailUrl,
        new Response(thumbBlob, {
          headers: { "Content-Type": thumbResponse.headers["content-type"] },
        })
      );

      const metadata = {
        youtubeId: audioUrl,
        title: music.title,
        artists: music.artists,
        thumbnailUrl: music.thumbnailUrl || "/cache.jpg",
      };
      await cache.put(
        `metadata-${music.youtubeId.replace(
          `${ReelsStreamApi}?url=https://soundcloud.com`,
          ""
        )}`,
        new Response(JSON.stringify(metadata))
      );
      toast({
        title: `Downloaded ${music.title.split(" ")[0].slice(0, 7)}`,
      });
      if (setDownloaded) {
        setDownloaded(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-expect-error:error message
        title: "Failed to download or save audio file:" + " " + error.message,
      });
    }
    return;
  }, [music, setDownloaded, isDownload]);

  const handleRemoveDownload = useCallback(async () => {
    try {
      const cache = await caches.open("audio");

      const keys = await cache.keys();
      const matchingKeys = keys.filter((key) =>
        key.url.includes(
          `metadata-${music.youtubeId.replace(
            `${ReelsStreamApi}?url=https://soundcloud.com`,
            ""
          )}`
        )
      );

      for (const key of matchingKeys) {
        const res = await cache.match(key);
        if (res) {
          const music = await res.json();
          await cache.delete(music.youtubeId);
          await cache.delete(music.thumbnailUrl);
          await cache.delete(key);
        }
      }
      toast({
        description: `Removed ${music.title.split(" ")[0].slice(0, 7)}`,
      });
      if (setDownloaded) {
        setDownloaded(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-expect-error:error message
        description: "Error deleting music" + " " + error.message,
      });
    }
  }, [music, setDownloaded]);
  return { handleDownload, handleRemoveDownload, isDownload };
};

export default useDownload;
