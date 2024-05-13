import React, { useCallback, useEffect, useState } from "react";
import Tabs from "./components/Footer/Tabs";
import { Outlet, ScrollRestoration } from "react-router-dom";
import TransferHeader from "./TransferHrader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { Toaster } from "./components/ui/toaster";
import { RxLapTimer } from "react-icons/rx";
import { SetSleepTimer, setIsIphone } from "./Store/Player";
import { Button } from "./components/ui/button";

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
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(true);
    }, 1111);
    return () => clearTimeout(t);
  }, []);

  const handlePwa = () => {
    dispatch(setIsIphone(true));
  };
  return (
    <>
      {!window.matchMedia("(display-mode: standalone)").matches && (
        <>
          {show && (
            <div className=" fixed fade-in flex flex-col space-y-3 leading-tight tracking-tight font-medium text-xl items-center justify-center px-7 h-dvh w-full bg-black/75 z-50">
              <div className="relative pt-7 pb-5 bg-neutral-950 p-4 tracking-tight leading-tight  rounded-md">
                <div className=" px-1">
                  <h1 className=" text-3xl font-semibold">Hi,There 👋 </h1>
                  <p className=" mt-1.5 text-base">
                    Welcome to Napster's PWA app! Enjoy instant access to
                    playlists for uninterrupted tunes. Connect with fellow music
                    lovers effortlessly.{" "}
                    <span onClick={handlePwa} className=" text-red-300">
                      Install App now{" "}
                    </span>
                    for a seamless experience!
                  </p>
                </div>
                <Button
                  onClick={() => setShow(false)}
                  variant={"secondary"}
                  className=" bg-neutral-900  w-full rounded-lg mt-2"
                >
                  Continue
                </Button>
              </div>

              <img
                src="/hi.png"
                height={200}
                width={200}
                className="  absolute top-48 -right-1"
                alt="intro"
              />
            </div>
          )}
        </>
      )}
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
      <Outlet />
      <Tabs />
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
}

const App = React.memo(AppComp);

export default App;
