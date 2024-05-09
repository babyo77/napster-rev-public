import { setCurrentToggle } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ToggleLibrary() {
  const dispatch = useDispatch();
  const PlaylistRef = useRef<HTMLButtonElement>(null);
  const AlbumsRef = useRef<HTMLButtonElement>(null);
  const ArtistsRef = useRef<HTMLButtonElement>(null);
  const ProfileRef = useRef<HTMLButtonElement>(null);
  const currentToggle = useSelector(
    (state: RootState) => state.musicReducer.currentToggle
  );
  const handleToggle = (ToggleRef: React.RefObject<HTMLButtonElement>) => {
    const value = ToggleRef.current?.getAttribute("aria-label");
    dispatch(setCurrentToggle(value || "Playlists"));
  };

  const savedAlbums = useSelector(
    (state: RootState) => state.musicReducer.savedAlbums
  );
  const savedArtists = useSelector(
    (state: RootState) => state.musicReducer.savedArtists
  );
  const savedProfiles = useSelector(
    (state: RootState) => state.musicReducer.savedProfile
  );

  useEffect(() => {
    if (currentToggle === "Artists") {
      ArtistsRef.current?.click();
    } else if (currentToggle === "Albums") {
      AlbumsRef.current?.click();
    } else if (currentToggle === "Playlists") {
      PlaylistRef.current?.click();
    } else if (currentToggle === "Profiles") {
      ProfileRef.current?.click();
    }
  }, [currentToggle]);

  return (
    <ToggleGroup
      type="single"
      className=" justify-start animate-fade-right p-0 m-0 pb-3 px-4  space-x-0.5"
    >
      <ToggleGroupItem
        ref={PlaylistRef}
        className=" rounded-2xl animate-fade-right fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
        variant={"outline"}
        value="Playlists"
        aria-label="Playlists"
        onClick={() => handleToggle(PlaylistRef)}
      >
        Playlists
      </ToggleGroupItem>

      {savedAlbums.length > 0 && (
        <ToggleGroupItem
          ref={AlbumsRef}
          className=" rounded-2xl animate-fade-right fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
          variant={"outline"}
          value="Albums"
          aria-label="Albums"
          onClick={() => handleToggle(AlbumsRef)}
        >
          Albums
        </ToggleGroupItem>
      )}
      {savedArtists.length > 0 && (
        <ToggleGroupItem
          ref={ArtistsRef}
          className=" rounded-2xl animate-fade-right fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
          variant={"outline"}
          value="Artists"
          aria-label="Artists"
          onClick={() => handleToggle(ArtistsRef)}
        >
          Artists
        </ToggleGroupItem>
      )}
      {savedProfiles.length > 0 && (
        <ToggleGroupItem
          ref={ProfileRef}
          className=" rounded-2xl animate-fade-right fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
          variant={"outline"}
          value="Profiles"
          aria-label="Profiles"
          onClick={() => handleToggle(ProfileRef)}
        >
          Profiles
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}
