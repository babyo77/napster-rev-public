import { useEffect, useState } from "react";
import { setIsIphone } from "@/Store/Player";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { DATABASE_ID, db } from "@/appwrite/appwriteConfig";
import { useQuery } from "react-query";
import { Models } from "appwrite";
export interface news extends Models.Document {
  news: string;
}
import { AnimatePresence, motion } from "framer-motion";
function News() {
  const dispatch = useDispatch();
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
  const getNews = async () => {
    const res = await db.getDocument(
      DATABASE_ID,
      "6644d98a000fff797f0f",
      "6644dca500155332341d"
    );
    return res as news;
  };
  const { data } = useQuery<news>(["news"], getNews, {
    staleTime: Infinity,
  });
  return (
    <>
      {!window.matchMedia("(display-mode: standalone)").matches && data && (
        <>
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShow(false)}
                className=" fixed  flex flex-col space-y-3 leading-tight tracking-tight font-medium text-xl  items-center justify-center px-7 h-dvh w-full bg-black/75 z-50"
              >
                <div className="relative pt-7 max-w-[30rem] pb-5 bg-neutral-950 p-4 tracking-tight leading-tight  rounded-md">
                  <div className=" px-1">
                    <h1 className=" text-3xl font-semibold">Hi,There </h1>
                    <p className=" mt-1.5 text-base">
                      {data.news}{" "}
                      <span onClick={handlePwa} className=" text-red-300">
                        Install App now{" "}
                      </span>
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
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default News;
