import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SharePlay from "./components/SharePlay/SharePlay.tsx";
import Search from "./components/Search/Search.tsx";
import Library from "./components/Library/Library.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "./Store/Store.ts";
import { RememberLib } from "./components/Library/RememberLib.tsx";
import NotFound from "./components/404.tsx";
import AlbumPage from "./Artists/AlbumPage.tsx";
import ArtistPage from "./Artists/ArtistPage.tsx";
import ListenNow from "./components/ListenNow/ListenNow.tsx";
import LikedSong from "./LikedSongs/likedSongs.tsx";
import Suggested from "./Suggested/Suggested.tsx";
import Docs from "./Landing Page/Docs.tsx";
import Box from "./components/Tune Box/box.tsx";
import TuneBox from "./components/Tune Box/tunebox.tsx";
import Offline from "./Offline/offline.tsx";
import SavedEdits from "./Saved Edits/SavedEdits.tsx";
import ErrorElement from "./error.tsx";
import User from "./user/User.tsx";
import Track from "./Track/Track.tsx";
import Playlists from "./user/Playlists.tsx";
import Mode from "./Mode.tsx";
import Loader from "./components/Loaders/Loader.tsx";

const client = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Mode />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "",

        element: <ListenNow />,
      },
      {
        path: "/share-play",
        element: <SharePlay />,
      },
      {
        path: "/library",
        element: <RememberLib />,
      },
      {
        path: "/social",
        element: (
          <div className=" flex flex-col space-y-1 justify-center items-center h-dvh">
            <Loader />
            <p>Coming soon</p>
          </div>
        ),
      },
      {
        path: "/library/:id",
        element: <Library />,
      },
      {
        path: "/artist/:id",
        element: <ArtistPage />,
      },
      {
        path: "/album/:id",
        element: <AlbumPage />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/liked/:id",
        element: <LikedSong />,
      },
      {
        path: "/edits/:id",
        element: <SavedEdits />,
      },
      {
        path: "/suggested",
        element: <Suggested />,
      },
      {
        path: "/tunebox/:id",
        element: <TuneBox />,
      },
      {
        path: "/suggested/:id",
        element: <Suggested />,
      },
      {
        path: "/offline/",
        element: <Offline />,
      },

      {
        path: "/track/:id",
        element: <Track />,
      },
      {
        path: "/playlist/:id",
        element: <Playlists />,
      },
      {
        path: "/profile/:id",
        element: <User app />,
      },
      {
        path: "*",
        element: <NotFound />,
        errorElement: <ErrorElement />,
      },
    ],
  },
  {
    path: "/docs/",
    element: <Docs />,
  },
  {
    path: "/reels",
    element: <SharePlay />,
  },
  {
    path: "/user/:id",
    element: <User />,
  },
  {
    path: "/playlists/:id",
    element: <Playlists />,
  },
  {
    path: "/box/:id",
    element: <Box />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
