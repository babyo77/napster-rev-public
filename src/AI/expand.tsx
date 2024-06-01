import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LuLoader } from "react-icons/lu";
import { MdOutlineArrowUpward } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";

interface ExpandProps {
  text: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handlePlaylist: React.MouseEventHandler<HTMLButtonElement>;
}

const Expand = forwardRef<HTMLButtonElement, ExpandProps>(
  ({ text, setPrompt, handlePlaylist, loading }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
      },
      [setPrompt]
    );
    const [isOpen, setIsOpen] = useState(false);
    const focusRef = useRef<HTMLTextAreaElement>(null);
    const handleFocus = useCallback(() => {
      const t = setTimeout(() => {
        if (focusRef.current) {
          focusRef.current.focus();
        }
      }, 2222);
      return () => clearTimeout(t);
    }, []);

    useEffect(() => {
      if (isOpen) {
        handleFocus();
      }
    }, [isOpen, handleFocus]);

    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger
          ref={ref}
          disabled={loading}
          className="top-3 right-3 absolute"
        >
          <RiExpandDiagonalLine className="rotate-90 text-zinc-500 h-5 w-5" />
        </DrawerTrigger>
        <DrawerContent
          hidden
          className="h-[75dvh] bg-neutral-950 border-none rounded-2xl"
        >
          <Textarea
            ref={focusRef}
            value={text}
            onChange={handleChange}
            className="p-4 border-none resize-none px-5 h-[84dvh] tracking-tight leading-tight text-xl font-normal"
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <button
                onClick={handlePlaylist}
                disabled={loading}
                className="bg-neutral-900 p-2 w-[2.7rem] self-end rounded-full"
              >
                {loading ? (
                  <LuLoader className="h-7 w-7 animate-spin text-red-500" />
                ) : (
                  <MdOutlineArrowUpward className="h-7 w-7 text-red-500 hover:text-zinc-400" />
                )}
              </button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default Expand;
