import { FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { Button } from "./ui/button";
import { SiDocsdotrs, SiGithubsponsors } from "react-icons/si";
import Download from "@/Landing Page/Download";
import { useNavigate } from "react-router-dom";
function Desktop() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/docs/");
  };
  return (
    <>
      <div className=" fade-in">
        <header className=" px-11 max-md:px-5 py-4 bg-transparent fixed w-full backdrop-blur-xl justify-between flex">
          <h1 className=" font-semibold text-2xl max-md:text-xl animate-fade-right">
            Napster
          </h1>
          <ul className=" flex text-lg animate-fade-left text-zinc-200  items-center space-x-3">
            <a
              href="https://github.com/babyo77/napsterDrx-Public"
              target="_blank"
            >
              <FiGithub className=" hover:text-white duration-300 transition-all cursor-pointer" />
            </a>
            <a href="https://twitter.com/tanmay11117" target="_blank">
              <FaXTwitter className="hover:text-white duration-300 transition-all cursor-pointer" />
            </a>
          </ul>
        </header>

        <div className=" bg-[#09090B] font-semibold w-full min-h-screen flex  justify-center items-center px-9 max-lg:text-4xl max-md:text-4xl text-7xl space-y-7  text-center max-md:px-4 animate-fade-up overflow-hidden fixed -z-10 space-x-3 max-md:space-x-0">
          <div className=" bg-white backdrop-blur-xl -z-10 blur-[50px] h-[27vw] w-[27vw] rounded-full opacity-5 border-none shadow-none absolute"></div>
          <div className="flex flex-col max-md:text-center max-md:items-center text-start justify-start items-start space-y-7 max-md:space-y-2.5 max-md:pt-[9dvh] pb-[11dvh]">
            <div>
              <p className="">Enjoy Music Without Interruptions</p>
            </div>
            <div className="flex space-x-2 ml-1 max-md:ml-0">
              <Download />

              <Button
                onClick={handleNavigate}
                className=" text-2xl py-6  max-md:text-base rounded-lg space-x-1"
              >
                <SiDocsdotrs />
                <p>Docs</p>
              </Button>
            </div>
          </div>
          <div className=" relative max-md:hidden  w-[50dvw]  h-dvh  flex overflow-scroll space-x-4 px-[11dvw] justify-center items-center ">
            <img
              src="/ui/home.webp"
              className="h-[80vh] rounded-xl absolute  top-16  animate-fade-up left-10 border "
            />
            <img
              src="/ui/lyrics.webp"
              className="h-[80vh] rounded-xl absolute  top-16  animate-fade-up right-10  border"
            />
            <img
              src="/ui/share.webp"
              className="h-[80vh] rounded-xl absolute animate-fade-up  border top-16 "
            />
          </div>
        </div>
        <footer className=" hidden animate-fade-up fixed text-zinc-400 hover:text-white transition-all duration-300  bottom-0 max-md:flex justify-center items-center w-full py-2.5 text-xs space-x-1">
          <SiGithubsponsors />
          <a
            className=" font-semibold"
            href="https://www.instagram.com/babyo7_/"
            target="_blank"
          >
            From Babyo7_
          </a>
        </footer>
      </div>
    </>
  );
}

export { Desktop };
