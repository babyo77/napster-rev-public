import Download from "@/Landing Page/Download";
import News from "@/news/news";
import { ImNpm } from "react-icons/im";
import { RiTwitterXLine } from "react-icons/ri";
import { BackgroundBeams } from "./BackgroundBeams";
import { motion } from "framer-motion";
function Desktop() {
  return (
    <>
      <News />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <header className="flex relative z-10 max-md:justify-between max-md:px-4 justify-around items-center py-5 border-b">
          <div className=" relative overflow-hidden">
            <a href="" className="text-3xl font-semibold leading-tight">
              Napster
            </a>
          </div>
          <div className="flex items-center gap-2 font-medium leading-tight bg-white text-black rounded-full p-2 cursor-pointer hover:bg-zinc-200  hover:text-zinc-900 transition-all duration-300">
            <ImNpm className="h-5 w-5" />
            <a href="https://www.npmjs.com/package/napster-info" target="blank">
              Download Package
            </a>
          </div>
        </header>
        <div className=" h-[85dvh] relative z-10 flex justify-center items-center flex-col gap-8 text-center">
          <div className="text-zinc-400 leading-tight py-2.5 hover:bg-zinc-950 cursor-pointer transition-all duration-300 font-medium flex w-fit border px-5 border-zinc-800/50 text-sm gap-2 rounded-xl items-center justify-center">
            <RiTwitterXLine className="h-3.5 w-3.5 mt-0.5" />
            <a href="https://twitter.com/tanmay11117" target="blank">
              Introducing Napster
            </a>
          </div>
          <div className=" relative overflow-hidden">
            <h1 className="mx-auto max-md:text-3xl max-w-6xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-6xl  text-[45px]  text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white leading-[48px] sm:leading-none px-4">
              SPOTIFY ALTERNATIVE FOR IOS
            </h1>
          </div>
          <Download />
        </div>
        <motion.div className="hidden flex-wrap py-24 max-md:py-16 relative z-10 justify-center gap-7 items-center">
          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/ai.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>

          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/lyrics.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>
          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/player.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>
          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/profile.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>
          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/library.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>
          <div className=" relative overflow-hidden hover:scale-105 transition-all duration-300">
            <img
              src="/ui/share.webp"
              className=" border h-48 w-24 md:h-72 md:w-32  rounded-md"
              alt=""
            />
          </div>
        </motion.div>
        <BackgroundBeams />
      </motion.div>
    </>
  );
}

export { Desktop };
