import { BiDislike, BiDotsHorizontalRounded, BiLike } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

function Rating() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <div className="hidden">
            <BiDotsHorizontalRounded className="h-8 w-8 animate-fade-left  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/50  border-none rounded-lg backdrop-blur-2xl mx-4 ">
        <DropdownMenuItem className="flex text-zinc-400 items-center justify-between space-x-2 py-1">
          <p className="text-sm pl-0.5">0 Likes</p>
          <BiLike className=" h-5 w-5" />
        </DropdownMenuItem>
        <div className="h-[.05rem] w-full bg-zinc-300/10 "></div>
        <DropdownMenuItem className="flex text-zinc-400 items-center justify-between space-x-2 py-1">
          <p className="text-sm pl-0.5">0 Dislikes</p>
          <BiDislike className="h-5 w-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Rating;
