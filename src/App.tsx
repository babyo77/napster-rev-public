import React, { useCallback } from "react";
import Tabs from "./components/Footer/Tabs";
import { Outlet, useLocation } from "react-router-dom";
import TransferHeader from "./TransferHrader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { Toaster } from "./components/ui/toaster";
import { RxLapTimer } from "react-icons/rx";
import { SetSleepTimer } from "./Store/Player";
import News from "./news/news";
import Header from "./components/Header/Header";

function AppComp() {
  const data = useSelector(
    (state: RootState) => state.musicReducer.spotifyTrack
  );
  const dispatch = useDispatch();
  const timer = useSelector(
    (state: RootState) => state.musicReducer.sleepTimer
  );

  const clearTime = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
      dispatch(SetSleepTimer(null));
    }
  }, [timer, dispatch]);
  const location = useLocation();

  const substrings = ["/library/", "/search", "/"];
  const matches = substrings.some(
    (substring) => location.pathname === substring
  );

  return (
    <>
      <News />
      {timer && timer === "end" && (
        <div
          onClick={clearTime}
          className=" absolute flex flex-col space-y-3 leading-tight tracking-tight font-medium text-xl items-center justify-center h-dvh w-full bg-black/95 z-50"
        >
          <RxLapTimer className=" h-16 w-16" />
          <p>Sleep Time</p>
        </div>
      )}
      <Toaster />
      {data && <TransferHeader data={data} />}
      {matches && (
        <Header
          title={
            location.pathname == "/"
              ? "home"
              : location.pathname.replace("/", "").replace("/", "")
          }
          l={location.pathname.includes("/library")}
        />
      )}
      <Outlet />
      <Tabs />
    </>
  );
}

const App = React.memo(AppComp);

export default App;
