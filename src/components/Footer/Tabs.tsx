import { FaRegCirclePlay } from "react-icons/fa6";
import { IoIosRadio } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdLibraryMusic } from "react-icons/md";
import { Player } from "./Player";
import { NavLink } from "react-router-dom";
import React from "react";
function TabsComp() {
  return (
    <div className="fixed  w-full left-0 bottom-0 flex flex-col justify-center items-center">
      <Player />
      <nav className="py-3 pb-6  backdrop-blur-md bg-zinc-950/70 w-full">
        <ul className="flex items-center text-zinc-500 space-x-12 justify-center">
          <li>
            <NavLink
              to={""}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col  items-center`
              }
            >
              <FaRegCirclePlay className="h-6 w-6" />
              <span className="text-xs mt-1">Listen now</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/share-play"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <IoIosRadio className="h-7 w-7" />
              <span className="text-xs ">Share Play</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/library/`}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <MdLibraryMusic className="h-7 w-7" />
              <span className="text-xs ">Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/search"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <IoSearch className="h-7 w-7 " />
              <span className="text-xs ">Search</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const Tabs = React.memo(TabsComp);
export default Tabs;
