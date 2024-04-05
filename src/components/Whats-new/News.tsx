import { Alert, AlertDescription } from "../ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { DATABASE_ID, UPDATES, db } from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import { useState } from "react";

function News() {
  const [close, setClose] = useState<boolean>(true);
  const update = async () => {
    const c = await db.getDocument(
      DATABASE_ID,
      UPDATES,
      localStorage.getItem("uid") || "default"
    );
    return c;
  };
  const { isError, refetch } = useQuery("update", update, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 0,
    refetchOnMount: false,
  });

  const handleClose = async () => {
    setClose(false);
    await db.createDocument(
      DATABASE_ID,
      UPDATES,
      localStorage.getItem("uid") || "default",
      {
        user: localStorage.getItem("uid"),
      }
    );
    refetch();
  };
  return (
    <>
      {close && (
        <>
          {isError && (
            <div className=" fixed w-full px-4">
              <Alert className=" fade-in bg-zinc-800 rounded-xl  top-4 ">
                <AlertDescription>
                  <div className="flex items-center justify-between space-x-2">
                    <Avatar className="h-9 w-9">
                      <LazyLoadImage
                        effect="blur"
                        src="https://static-00.iconduck.com/assets.00/spotify-icon-2048x2048-5gqpkwih.png"
                      />
                    </Avatar>
                    <span className="text-xs">
                      Soon you will be able to transfer your spotify playlists.
                    </span>
                    <Button
                      onClick={handleClose}
                      className={`text-xs py-1.5 
                    bg-zinc-600 
                   font-normal hover:bg-zinc-700 text-white px-3 rounded-md h-fit`}
                    >
                      Close
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default News;
