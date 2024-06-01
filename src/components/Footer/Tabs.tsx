import { IoSearch } from "react-icons/io5";
import { Player } from "./Player";
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BiLibrary } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
function TabsComp() {
  const [online, setOnline] = useState<boolean>();
  useEffect(() => {
    const online = navigator.onLine;
    setOnline(online);
  }, []);
  const handleClick = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);
  const location = useLocation();

  return (
    <div className="fixed z-20  w-full right-0 left-0 bottom-0 flex flex-col justify-center items-center">
      <div className="px-1.5 z-10 w-full">
        <Player />
      </div>
      <nav
        className={`py-3 pb-7  animate-fade-up backdrop-blur-md ${
          location.pathname !== "/share-play" ? "bg-zinc-950/90 pt-5" : "pt-0"
        }  w-full transition-all duration-500`}
      >
        <ul className="flex items-center text-zinc-500 space-x-11 justify-evenly px-2">
          <li>
            <NavLink
              onClick={handleClick}
              to={online ? "" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-red-500"} flex flex-col  items-center`
              }
            >
              <GoHomeFill className="h-7 w-7" />
              <span className="text-xs">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={online ? "/search" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-red-500"} flex flex-col mb-1  items-center`
              }
            >
              <IoSearch className="h-7 w-7 " />
              <span className="text-xs ">Search</span>
            </NavLink>
          </li>

          {/* <li>
            <NavLink
              to={online ? "/social" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-red-500"} flex flex-col mb-1 items-center`
              }
            >
              <MdOutlineExplore className="h-7 w-7" />
              <span className="text-xs ">Social</span>
            </NavLink>
          </li> */}

          {/* <li>
            <NavLink
              onClick={handleLoadMore}
              to={online ? "/share-play" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-red-500"} flex flex-col mb-1 items-center`
              }
            >
              <MdOutlineAmpStories className="h-8 w-8" />
              <span className="text-xs ">Tunes</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to={online ? `/library/` : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-red-500"} flex flex-col mb-1 items-center`
              }
            >
              <BiLibrary className="h-7 w-7" />
              <span className="text-xs ">Library</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const Tabs = React.memo(TabsComp);
export default Tabs;
