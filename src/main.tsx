import React, { Suspense, lazy } from "react";
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
import Check from "./components/Check.tsx";
import AlbumPage from "./Artists/AlbumPage.tsx";
import ArtistPage from "./Artists/ArtistPage.tsx";
import ListenNow from "./components/ListenNow/ListenNow.tsx";
import LikedSong from "./LikedSongs/likedSongs.tsx";
import Suggested from "./Suggested/Suggested.tsx";
const Docs = lazy(() => import("./Landing Page/Docs.tsx"));
import { ReactLenis } from "@studio-freight/react-lenis";
import Box from "./components/Tune Box/box.tsx";
import TuneBox from "./components/Tune Box/tunebox.tsx";
import Offline from "./Offline/offline.tsx";
// import Test from "./text.tsx";
import SavedEdits from "./Saved Edits/SavedEdits.tsx";
import ErrorElement from "./error.tsx";
import Loader from "./components/Loaders/Loader.tsx";

const client = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Check />,
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/docs/",
    element: <Docs />,
  },
  // {
  //   path: "/test/",
  //   element: <Test />,
  // },
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
          <ReactLenis root>
            <Suspense
              fallback={
                <div className=" h-dvh flex items-center justify-center">
                  <Loader color="white" />
                </div>
              }
            >
              <RouterProvider router={router} />
            </Suspense>
          </ReactLenis>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
