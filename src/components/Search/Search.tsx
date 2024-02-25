import { Input } from "@/components/ui/input";
import Header from "../Header/Header";
import { useQuery } from "react-query";
import axios from "axios";
import { SearchApi, SearchArtist, SearchPlaylistApi } from "@/API/api";
import {
  SearchPlaylist,
  playlistSongs,
  recentSearch,
  suggestedArtists,
  trending,
} from "@/Interface";
import Loader from "../Loaders/Loader";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { setSearch } from "@/Store/Player";
import { IoIosTrendingUp } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import {
  DATABASE_ID,
  INSIGHTS,
  TRENDING_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { Skeleton } from "../ui/skeleton";
import SearchSong from "./SearchSong";
import { Query } from "appwrite";
import { ArtistSearch } from "./artistSearch";
import { MdCancel } from "react-icons/md";
import { PlaylistSearchComp } from "./playlistSearch";

function SearchComp() {
  const searchQuery = useSelector(
    (state: RootState) => state.musicReducer.search
  );
  const dispatch = useDispatch();
  const s = useRef<HTMLInputElement>(null);

  const trending = async () => {
    const q = await db.listDocuments(DATABASE_ID, TRENDING_COLLECTION_ID);
    return q.documents as unknown as trending[];
  };

  const loadRecentSearch = async () => {
    const r = await db.listDocuments(DATABASE_ID, INSIGHTS, [
      Query.orderDesc("$createdAt"),
      Query.equal("user", [localStorage.getItem("uid") || ""]),
    ]);
    const p = r.documents as unknown as recentSearch[];
    return p;
  };
  const { data: RecentSearch } = useQuery<recentSearch[]>(
    "recentSearch",
    loadRecentSearch,
    {
      staleTime: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  const clearSearchQuery = useCallback(() => {
    dispatch(setSearch(""));
  }, [dispatch]);
  const query = async () => {
    if (searchQuery.length > 0) {
      const q = await axios.get(`${SearchApi}${searchQuery}`);
      return q.data as playlistSongs[];
    } else {
      return [];
    }
  };
  const {
    data: music,
    isLoading,
    refetch,
  } = useQuery<playlistSongs[]>(["search", searchQuery], query, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60000,
    refetchOnMount: false,
  });

  const artists = async () => {
    if (searchQuery.length > 0) {
      const q = await axios.get(`${SearchArtist}${searchQuery}`);
      return q.data as suggestedArtists[];
    } else {
      return [];
    }
  };
  const { data: artistsData, refetch: artistsRefetch } = useQuery<
    suggestedArtists[]
  >(["artistsSearch", searchQuery], artists, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60000,
    refetchOnMount: false,
  });

  const playlists = async () => {
    if (searchQuery.length > 0) {
      const q = await axios.get(`${SearchPlaylistApi}${searchQuery}`);

      return q.data as SearchPlaylist[];
    } else {
      return [];
    }
  };
  const { data: playlistsData, refetch: playlistsRefetch } = useQuery<
    SearchPlaylist[]
  >(["PlaylistSearch", searchQuery], playlists, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60000,
    refetchOnMount: false,
  });

  const { data: trend, isLoading: isTrend } = useQuery<trending[]>(
    "trending",
    trending,
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60000,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    if (s.current) {
      s.current.value = searchQuery;
    }
  }, [searchQuery]);

  const search = useCallback(
    (time: number) => {
      s.current?.value.trim() == "" && dispatch(setSearch(""));
      const q = setTimeout(() => {
        if (s.current?.value) {
          s.current.value.length > 1 &&
            (refetch(),
            artistsRefetch(),
            playlistsRefetch(),
            dispatch(setSearch(s.current?.value || "")));
        }
      }, time);
      return () => clearTimeout(q);
    },
    [refetch, dispatch, artistsRefetch, playlistsRefetch]
  );

  return (
    <>
      <Header title="Search" />
      <div className="flex flex-col   fade-in items-center space-x-1 px-4">
        <Input
          ref={s}
          type="text"
          onChange={() => search(1100)}
          placeholder="Artists, Songs, Playlists"
          className=" relative shadow-none rounded-lg"
        />
        {searchQuery.length > 0 && (
          <MdCancel
            onClick={clearSearchQuery}
            className=" absolute fade-in right-6 mt-2 h-5 w-5"
          />
        )}
        <div className="flex flex-col  text-start w-full py-2">
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loader />
            </div>
          )}

          {RecentSearch &&
            RecentSearch.length > 0 &&
            searchQuery.length <= 0 && (
              <>
                <h3 className="text-xs text-zinc-500 pt-2 pb-1 ">
                  Recent Search Played
                </h3>
                <div className="flex flex-col space-y-2.5  py-2.5">
                  {RecentSearch.slice(0, 4).map((recentSearch) => (
                    <div
                      key={recentSearch.$id}
                      onClick={() => {
                        s.current && (s.current.value = recentSearch.song);
                        search(0);
                      }}
                    >
                      <p className=" flex items-center  w-[90dvw]  text-sm  gap-2">
                        <GoArrowUpRight />
                        {recentSearch.song}
                      </p>
                      <div className=" h-[.05rem] w-full bg-white/30 mt-3"></div>
                    </div>
                  ))}
                </div>
              </>
            )}

          {searchQuery.length == 0 && (
            <>
              <h3 className="text-xs text-zinc-500 pt-2 pb-1 ">Trending now</h3>
              {isTrend && (
                <div className="flex flex-col space-y-2.5  py-2.5">
                  <Skeleton className="w-[90vw] h-[.7rem]  rounded-md bg-zinc-500 py-1" />
                  <Skeleton className="w-[90vw] h-[.7rem]  rounded-md bg-zinc-500 py-1" />
                  <Skeleton className="w-[70vw] h-[.7rem]  rounded-md bg-zinc-500 py-1" />
                </div>
              )}
              {trend &&
                trend.map((trend, i) => (
                  <div
                    key={trend.song + i}
                    className="flex fade-in flex-col text-sm py-1 capitalize text-zinc-300"
                    onClick={() => {
                      s.current && (s.current.value = trend.song);
                      search(0);
                    }}
                  >
                    <p className=" flex w-[90dvw] items-center gap-2">
                      <IoIosTrendingUp />
                      {trend.song}
                    </p>
                    <div className=" h-[.05rem] w-full bg-white/30 mt-3"></div>
                  </div>
                ))}
            </>
          )}

          {music && !isLoading && searchQuery.length > 0 && (
            <div className="h-[63vh] overflow-auto">
              {artistsData && artistsData.length > 0 && (
                <div>
                  {artistsData.slice(0, 4).map((a, i) => (
                    <ArtistSearch
                      key={a.name + a.artistId + i}
                      name={a.name}
                      artistId={a.artistId}
                      thumbnailUrl={a.thumbnailUrl}
                    />
                  ))}
                </div>
              )}
              {music.slice(0, 5).map((r) => (
                <SearchSong
                  artistId={r.artists[0].id}
                  audio={r.youtubeId}
                  id={r.youtubeId}
                  key={r.youtubeId}
                  title={r.title}
                  artist={r.artists}
                  cover={r.thumbnailUrl}
                />
              ))}
              {playlistsData &&
                playlistsData.length > 0 &&
                playlistsData
                  .slice(0, 3)
                  .map((p) => (
                    <PlaylistSearchComp
                      key={p.thumbnailUrl + p.playlistId}
                      playlistId={p.playlistId.replace("VL", "")}
                      thumbnailUrl={p.thumbnailUrl}
                      title={p.title}
                    />
                  ))}
              {playlistsData &&
                playlistsData.length > 0 &&
                playlistsData
                  .slice(3, 7)
                  .map((p) => (
                    <PlaylistSearchComp
                      key={p.thumbnailUrl + p.playlistId}
                      playlistId={p.playlistId.replace("VL", "")}
                      thumbnailUrl={p.thumbnailUrl}
                      title={p.title}
                    />
                  ))}
              {music.slice(7, 10).map((r) => (
                <SearchSong
                  artistId={r.artists[0].id}
                  audio={r.youtubeId}
                  id={r.youtubeId}
                  key={r.youtubeId}
                  title={r.title}
                  artist={r.artists}
                  cover={r.thumbnailUrl}
                />
              ))}

              {artistsData && artistsData.length > 0 && (
                <div>
                  {artistsData.slice(5, artists.length - 1).map((a, i) => (
                    <ArtistSearch
                      key={a.name + a.artistId + i}
                      name={a.name}
                      artistId={a.artistId}
                      thumbnailUrl={a.thumbnailUrl}
                    />
                  ))}
                </div>
              )}
              {playlistsData &&
                playlistsData.length > 0 &&
                playlistsData
                  .slice(8, playlistsData.length - 1)
                  .map((p) => (
                    <PlaylistSearchComp
                      key={p.thumbnailUrl + p.playlistId}
                      playlistId={p.playlistId.replace("VL", "")}
                      thumbnailUrl={p.thumbnailUrl}
                      title={p.title}
                    />
                  ))}
              {music.slice(11, music.length - 1).map((r) => (
                <SearchSong
                  artistId={r.artists[0].id}
                  audio={r.youtubeId}
                  id={r.youtubeId}
                  key={r.youtubeId}
                  title={r.title}
                  artist={r.artists}
                  cover={r.thumbnailUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
const Search = React.memo(SearchComp);
export default Search;
