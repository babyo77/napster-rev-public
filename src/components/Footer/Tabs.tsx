import { IoSearch } from "react-icons/io5";
import { Player } from "./Player";
import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { BiLibrary } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { setReelsIndex } from "@/Store/Player";
import { MdOutlineAmpStories, MdOutlineExplore } from "react-icons/md";
function TabsComp() {
  const [online, setOnline] = useState<boolean>();
  const q = useQueryClient();
  useEffect(() => {
    const online = navigator.onLine;
    setOnline(online);
  }, []);
  const handleClick = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLoadMore = useCallback(async () => {
    if (q.getQueryData(["reels"]) && location.pathname == "/share-play") {
      await q.fetchQuery(["reels"]);
      dispatch(setReelsIndex(0));
    }
  }, [q, dispatch, location]);
  return (
    <div className="fixed  fade-in w-screen right-0 left-0 bottom-0 flex flex-col justify-center items-center">
      <Player />
      <nav
        className={`py-3 pb-7  animate-fade-up backdrop-blur-md ${
          location.pathname !== "/share-play" ? "bg-zinc-950/90 pt-5" : "pt-0"
        }  w-full transition-all duration-500`}
      >
        <ul className="flex items-center text-zinc-500 space-x-8   justify-center">
          <li>
            <NavLink
              onClick={handleClick}
              to={online ? "" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col  items-center`
              }
            >
              <GoHomeFill className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to={`/library/`}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <MdOutlineGridView className="h-6 w-6" />
              <span className="text-xs ">Browse</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink
              onClick={handleLoadMore}
              to={online ? "/share-play" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <MdOutlineAmpStories className="h-7 w-7" />
              <span className="text-xs px-[3dvw] ">Tunes</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={online ? "/social" : "/offline/"}
              className={({ isActive }) =>
                `${
                  isActive && "text-zinc-300"
                } -ml-2.5 flex flex-col mb-1 items-center`
              }
            >
              <MdOutlineExplore className="h-7 w-7" />
              <span className="text-xs px-[3dvw] ">Social</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={online ? `/library/` : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <BiLibrary className="h-6 w-6" />
              <span className="text-xs ">Library</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to={online ? "/search" : "/offline/"}
              className={({ isActive }) =>
                `${isActive && "text-zinc-300"} flex flex-col mb-1 items-center`
              }
            >
              <IoSearch className="h-6 w-6 " />
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
