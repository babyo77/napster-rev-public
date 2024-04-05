import { Input } from "@/components/ui/input";
import Header from "../Header/Header";
import { useQuery } from "react-query";
import axios from "axios";
import {
  SearchAlbum,
  SearchApi,
  SearchArtist,
  SearchPlaylistApi,
} from "@/API/api";
import {
  SearchPlaylist,
  likedSongs,
  playlistSongs,
  searchAlbumsInterface,
  suggestedArtists,
} from "@/Interface";
import Loader from "../Loaders/Loader";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { setSearch } from "@/Store/Player";
import { DATABASE_ID, INSIGHTS, db } from "@/appwrite/appwriteConfig";
import SearchSong from "./SearchSong";
import { Query } from "appwrite";
import { ArtistSearch } from "./artistSearch";
import { MdCancel } from "react-icons/md";
import { PlaylistSearchComp } from "./playlistSearch";
import { AlbumSearchComp } from "./albumSearch";
import SkeletonP from "../Library/SkeletonP";
import RecentSearchesComp from "./RecentSearches";
import { SearchToggle } from "./searchToggle";
import { IoSearchOutline } from "react-icons/io5";

function SearchComp() {
  const searchQuery = useSelector(
    (state: RootState) => state.musicReducer.search
  );
  const dispatch = useDispatch();
  const s = useRef<HTMLInputElement>(null);

  const loadRecentSearch = async () => {
    const r = await db.listDocuments(DATABASE_ID, INSIGHTS, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [localStorage.getItem("uid") || ""]),
      Query.limit(11),
    ]);
    const p = r.documents as unknown as likedSongs[];
    return p;
  };
  const { data: RecentSearch, isLoading: RecentLoading } = useQuery<
    likedSongs[]
  >("recentSearch", loadRecentSearch, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

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

  const albums = async () => {
    if (searchQuery.length > 0) {
      const q = await axios.get(`${SearchAlbum}${searchQuery}`);
      return q.data as searchAlbumsInterface[];
    } else {
      return [];
    }
  };
  const { data: albumData, refetch: albumRefetch } = useQuery<
    searchAlbumsInterface[]
  >(["albumsSearch", searchQuery], albums, {
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

  useEffect(() => {
    if (s.current) {
      s.current.value = searchQuery;
    }
  }, [searchQuery]);

  const searchToggle = useSelector(
    (state: RootState) => state.musicReducer.searchToggle
  );

  const search = useCallback(
    (time: number) => {
      s.current?.value.trim() == "" && dispatch(setSearch(""));
      const q = setTimeout(() => {
        if (s.current?.value) {
          s.current.value.length > 1 &&
            (refetch(),
            artistsRefetch(),
            playlistsRefetch(),
            albumRefetch(),
            dispatch(setSearch(s.current?.value || "")));
        }
      }, time);
      return () => clearTimeout(q);
    },
    [refetch, dispatch, artistsRefetch, playlistsRefetch, albumRefetch]
  );

  return (
    <>
      <Header title="Search" />
      <div className="flex flex-col fade-in items-center space-x-1 px-4">
        <div className="flex w-full -space-x-2">
          <div className="border rounded-lg rounded-r-none border-r-0 px-2 border-zinc-800">
            <IoSearchOutline
              onClick={clearSearchQuery}
              className=" text-white fade-in left-6 mt-2 h-5 w-5"
            />
          </div>
          <Input
            ref={s}
            type="text"
            onChange={() => search(1100)}
            placeholder="Artists, Songs, Playlists and More"
            className="  px-2 relative  shadow-none rounded-lg rounded-l-none border-l-0 "
          />
        </div>
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
                <h3 className="text-xs fade-in text-zinc-500 pt-2 pb-1 ">
                  Recently Searched
                </h3>
                <div className="h-[63dvh] pb-7 overflow-scroll">
                  <div className="flex  fade-in  justify-center flex-col -space-y-1  ">
                    {RecentSearch.filter(
                      (r, i, s) =>
                        i === s.findIndex((t) => t.youtubeId == r.youtubeId)
                    ).map((r, i) => (
                      <RecentSearchesComp r={r} key={r.youtubeId + i} />
                    ))}
                  </div>
                </div>
              </>
            )}

          {searchQuery.length == 0 && (
            <>
              {RecentLoading && (
                <div className="flex fade-in mt-1 flex-col space-y-3 ">
                  <SkeletonP />
                  <SkeletonP />
                  <SkeletonP />
                  <SkeletonP />
                </div>
              )}
            </>
          )}

          {music && !isLoading && searchQuery.length > 0 && (
            <>
              <SearchToggle />
              <div className="h-[63vh] pb-7 overflow-y-scroll overflow-hidden flex flex-col items-center">
                {searchToggle === "Music" &&
                  music
                    .slice(0, 3)
                    .map((r) => (
                      <SearchSong
                        artistId={r.artists[0].id}
                        audio={r.youtubeId}
                        artistName={r.artists[0].name}
                        id={r.youtubeId}
                        key={r.youtubeId}
                        title={r.title}
                        artist={r.artists}
                        cover={r.thumbnailUrl}
                      />
                    ))}

                {searchToggle === "Music" &&
                  music
                    .slice(4, 6)
                    .map((r) => (
                      <SearchSong
                        artistId={r.artists[0].id}
                        audio={r.youtubeId}
                        artistName={r.artists[0].name}
                        id={r.youtubeId}
                        key={r.youtubeId}
                        title={r.title}
                        artist={r.artists}
                        cover={r.thumbnailUrl}
                      />
                    ))}
                {searchToggle === "Artists" &&
                  artistsData &&
                  artistsData.length > 0 && (
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
                {searchToggle === "Albums" &&
                  albumData &&
                  albumData.length > 0 && (
                    <div>
                      {albumData.slice(0, 4).map((a, i) => (
                        <AlbumSearchComp
                          key={a.albumId + a.title + i}
                          title={a.title}
                          albumId={a.albumId}
                          thumbnailUrl={a.thumbnailUrl}
                        />
                      ))}
                    </div>
                  )}
                {searchToggle === "Music" &&
                  music
                    .slice(7, 10)
                    .map((r) => (
                      <SearchSong
                        artistName={r.artists[0].name}
                        artistId={r.artists[0].id}
                        audio={r.youtubeId}
                        id={r.youtubeId}
                        key={r.youtubeId}
                        title={r.title}
                        artist={r.artists}
                        cover={r.thumbnailUrl}
                      />
                    ))}

                {searchToggle === "Playlists" &&
                  playlistsData &&
                  playlistsData.length > 0 &&
                  playlistsData
                    .slice(0, 3)
                    .map((p) => (
                      <PlaylistSearchComp
                        key={p.thumbnailUrl + p.playlistId}
                        playlistId={p.playlistId
                          .replace("VL", "")
                          .replace("MPSP", "")}
                        thumbnailUrl={p.thumbnailUrl}
                        title={p.title}
                      />
                    ))}

                {searchToggle === "Albums" &&
                  albumData &&
                  albumData.length > 0 && (
                    <div>
                      {albumData.slice(4, 7).map((a, i) => (
                        <AlbumSearchComp
                          key={a.albumId + a.title + i}
                          title={a.title}
                          albumId={a.albumId}
                          thumbnailUrl={a.thumbnailUrl}
                        />
                      ))}
                    </div>
                  )}

                {searchToggle === "Music" &&
                  music
                    .slice(11, music.length - 1)
                    .map((r) => (
                      <SearchSong
                        artistId={r.artists[0].id}
                        artistName={r.artists[0].name}
                        audio={r.youtubeId}
                        id={r.youtubeId}
                        key={r.youtubeId}
                        title={r.title}
                        artist={r.artists}
                        cover={r.thumbnailUrl}
                      />
                    ))}

                {searchToggle === "Playlists" &&
                  playlistsData &&
                  playlistsData.length > 0 &&
                  playlistsData
                    .slice(3, 7)
                    .map((p) => (
                      <PlaylistSearchComp
                        key={p.thumbnailUrl + p.playlistId}
                        playlistId={p.playlistId
                          .replace("VL", "")
                          .replace("MPSP", "")}
                        thumbnailUrl={p.thumbnailUrl}
                        title={p.title}
                      />
                    ))}

                {searchToggle === "Albums" &&
                  albumData &&
                  albumData.length > 0 && (
                    <div>
                      {albumData.slice(7, albumData.length - 1).map((a, i) => (
                        <AlbumSearchComp
                          key={a.albumId + a.title + i}
                          title={a.title}
                          albumId={a.albumId}
                          thumbnailUrl={a.thumbnailUrl}
                        />
                      ))}
                    </div>
                  )}
                {searchToggle === "Artists" &&
                  artistsData &&
                  artistsData.length > 0 && (
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
                {searchToggle === "Playlists" &&
                  playlistsData &&
                  playlistsData.length > 0 &&
                  playlistsData
                    .slice(8, playlistsData.length - 1)
                    .map((p) => (
                      <PlaylistSearchComp
                        key={p.thumbnailUrl + p.playlistId}
                        playlistId={p.playlistId
                          .replace("VL", "")
                          .replace("MPSP", "")}
                        thumbnailUrl={p.thumbnailUrl}
                        title={p.title}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
const Search = React.memo(SearchComp);
export default Search;
