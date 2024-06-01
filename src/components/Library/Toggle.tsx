import { setCurrentToggle } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useSaved from "@/hooks/saved";
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

  const { SavedAlbums, SavedArtists, SavedProfiles } = useSaved();

  useEffect(() => {
    if (SavedArtists?.length == 0 || SavedProfiles?.length == 0) {
      ProfileRef.current?.click();
    }
  }, [SavedProfiles, SavedArtists]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentToggle === "Artists") {
        ArtistsRef.current?.click();
      }
      if (currentToggle === "Albums") {
        AlbumsRef.current?.click();
      }
      if (currentToggle === "Playlists") {
        PlaylistRef.current?.click();
      }
      if (currentToggle === "Profiles") {
        ProfileRef.current?.click();
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [currentToggle]);

  return (
    <ToggleGroup
      type="single"
      className=" justify-start animate-fade-right p-0 m-0 pb-3 px-4  space-x-0.5"
    >
      <ToggleGroupItem
        ref={PlaylistRef}
        className=" rounded-2xl animate-fade-right  text-xs font-normal p-0 m-0 px-4 h-fit py-1.5"
        variant={"outline"}
        value="Playlists"
        aria-label="Playlists"
        onClick={() => handleToggle(PlaylistRef)}
      >
        Playlists
      </ToggleGroupItem>

      {SavedAlbums && SavedAlbums?.length > 0 && (
        <ToggleGroupItem
          ref={AlbumsRef}
          className=" rounded-2xl animate-fade-right  text-xs font-normal p-0 m-0 px-4 h-fit py-1.5"
          variant={"outline"}
          value="Albums"
          aria-label="Albums"
          onClick={() => handleToggle(AlbumsRef)}
        >
          Albums
        </ToggleGroupItem>
      )}
      {SavedArtists && SavedArtists?.length > 0 && (
        <ToggleGroupItem
          ref={ArtistsRef}
          className=" rounded-2xl animate-fade-right  text-xs font-normal p-0 m-0 px-4 h-fit py-1.5"
          variant={"outline"}
          value="Artists"
          aria-label="Artists"
          onClick={() => handleToggle(ArtistsRef)}
        >
          Artists
        </ToggleGroupItem>
      )}
      {SavedProfiles && SavedProfiles?.length > 0 && (
        <ToggleGroupItem
          ref={ProfileRef}
          className=" rounded-2xl animate-fade-right  text-xs font-normal p-0 m-0 px-4 h-fit py-1.5"
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
