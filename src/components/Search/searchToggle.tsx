import { setSearchToggle } from "@/Store/Player";
import { RootState } from "@/Store/Store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function SearchToggle() {
  const dispatch = useDispatch();
  const PlaylistRef = useRef<HTMLButtonElement>(null);
  const ArtistRef = useRef<HTMLButtonElement>(null);
  const AlbumsRef = useRef<HTMLButtonElement>(null);
  const MusicRef = useRef<HTMLButtonElement>(null);
  const searchToggle = useSelector(
    (state: RootState) => state.musicReducer.searchToggle
  );
  const handleToggle = (ToggleRef: React.RefObject<HTMLButtonElement>) => {
    const value = ToggleRef.current?.getAttribute("aria-label");
    dispatch(setSearchToggle(value || ""));
  };

  useEffect(() => {
    if (searchToggle === "Music") {
      MusicRef.current?.click();
    } else if (searchToggle === "Albums") {
      AlbumsRef.current?.click();
    } else if (searchToggle === "Playlists") {
      PlaylistRef.current?.click();
    } else if (searchToggle === "Artist") {
      ArtistRef.current?.click();
    }
  }, [searchToggle]);

  return (
    <ToggleGroup
      type="single"
      className=" justify-start p-0 m-0 py-1 pb-2 space-x-0.5"
    >
      <ToggleGroupItem
        ref={MusicRef}
        className=" rounded-2xl fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
        variant={"outline"}
        value="Music"
        aria-label="Music"
        onClick={() => handleToggle(MusicRef)}
      >
        Music
      </ToggleGroupItem>
      <ToggleGroupItem
        ref={ArtistRef}
        className=" rounded-2xl fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
        variant={"outline"}
        value="Artists"
        aria-label="Artists"
        onClick={() => handleToggle(ArtistRef)}
      >
        Artists
      </ToggleGroupItem>

      <ToggleGroupItem
        ref={PlaylistRef}
        className=" rounded-2xl fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
        variant={"outline"}
        value="Playlists"
        aria-label="Playlists"
        onClick={() => handleToggle(PlaylistRef)}
      >
        Playlists
      </ToggleGroupItem>

      <ToggleGroupItem
        ref={AlbumsRef}
        className=" rounded-2xl fade-in text-xs font-normal p-0 m-0 px-3.5 h-fit py-1.5"
        variant={"outline"}
        value="Albums"
        aria-label="Albums"
        onClick={() => handleToggle(AlbumsRef)}
      >
        Albums
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
