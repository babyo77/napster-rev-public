import React from "react";
import Tabs from "./components/Footer/Tabs";
import { Outlet, ScrollRestoration } from "react-router-dom";
import TransferHeader from "./TransferHrader";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { Toaster } from "./components/ui/toaster";

function AppComp() {
  const data = useSelector(
    (state: RootState) => state.musicReducer.spotifyTrack
  );

  return (
    <>
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
