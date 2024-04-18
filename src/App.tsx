import React, { useEffect } from "react";
import Tabs from "./components/Footer/Tabs";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DATABASE_ID, ID, NEW_USER, db } from "./appwrite/appwriteConfig";
import TransferHeader from "./TransferHrader";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { io } from "socket.io-client";
import { SharePlayApi } from "./API/api";

function AppComp() {
  function ScreenSizeCheck() {
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    return isIPhone;
  }

  useEffect(() => {
    io(SharePlayApi);
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("uid")) {
      localStorage.setItem("uid", uuidv4());
      try {
        db.createDocument(DATABASE_ID, NEW_USER, ID.unique(), {
          user: localStorage.getItem("uid") || "error",
          ios: ScreenSizeCheck(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  const data = useSelector(
    (state: RootState) => state.musicReducer.spotifyTrack
  );
  return (
    <>
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
