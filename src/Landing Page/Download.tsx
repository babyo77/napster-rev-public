import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { RiDownloadLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { FaApple } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import {
  MdInstallMobile,
  MdOutlineAddBox,
  MdOutlineAndroid,
} from "react-icons/md";
import { RiSafariFill, RiChromeFill, RiHeadphoneLine } from "react-icons/ri";
import { FiShare } from "react-icons/fi";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Download() {
  const [ios, SetIos] = useState<boolean>(false);
  const [android, SetAndroid] = useState<boolean>(false);
  const isDesktop = window.innerWidth > 768;

  useEffect(() => {
    const i = /iPhone/i.test(navigator.userAgent);
    const a = /Android/i.test(navigator.userAgent);
    if (i) {
      SetIos(true);
      SetAndroid(false);
    }
    if (a) {
      SetIos(true);
      SetAndroid(false);
    }
  }, []);
  return (
    <Dialog>
      <DialogTrigger className="p-0 m-0 flex">
        <Button
          asChild
          className=" text-2xl py-6 max-md:text-base   rounded-lg space-x-1"
        >
          <div>
            <RiDownloadLine />
            <p>Download</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`border-none bg-[#09090B] rounded-xl  justify-center  flex gap-4 py-11 pb-7  w-fit max-md:w-[77dvw] ${
          !ios ? "px-16" : "px-11"
        }  max-md:flex-wrap `}
      >
        <div className=" text-center space-y-2">
          {!ios ? (
            <>
              <div
                onClick={() => (SetIos((prev) => !prev), SetAndroid(false))}
                title="ios"
                className="flex animate-fade-right text-9xl text-zinc-300 hover:text-zinc-100 hover:scale-105 transition-all duration-300 cursor-pointer bg-white/10 shadow-md  p-5 rounded-xl "
              >
                <FaApple />
              </div>
              <p className=" font-semibold">IOS</p>
            </>
          ) : (
            <>
              <div
                title="ios"
                className="flex  animate-fade-up text-7xl text-zinc-300 hover:text-zinc-100 hover:scale-105 transition-all duration-300 cursor-pointer bg-white/10 shadow-md  p-5 max-md:p-4 rounded-xl "
              >
                <QRCodeSVG
                  className="animate-rotate-x animate-once animate-duration-1000 animate-ease-in-out"
                  value={window.location.origin}
                />
              </div>
              <p
                className="hover:text-white transition-all duration-300 font-semibold text-zinc-300 text-base cursor-pointer max-md:pt-1 animate-fade-up"
                onClick={() => SetIos((prev) => !prev)}
              >
                Go Back
              </p>
            </>
          )}
        </div>

        <div className=" text-center space-y-2">
          {!ios ? (
            <>
              <div
                onClick={() => (SetIos((prev) => !prev), SetAndroid(true))}
                title="android"
                className="flex text-9xl animate-fade-left text-zinc-300 hover:text-zinc-100 hover:scale-105 transition-all duration-300 cursor-pointer bg-white/10 shadow-md  p-5 rounded-xl "
              >
                <MdOutlineAndroid />
              </div>
              <p className=" font-semibold">Android</p>{" "}
            </>
          ) : (
            <ul className="text-lg up text-start animate-fade-up space-y-2.5 max-md:py-0 break-all py-5">
              {isDesktop && (
                <li className="flex items-center space-x-1 animate-flip-up">
                  {!android ? <RiSafariFill /> : <RiChromeFill />}
                  <p>{!android ? "Open in Safari" : "Open in Chrome"}</p>
                </li>
              )}
              <li className="flex items-center space-x-1 animate-flip-up">
                {!android ? <FiShare /> : <BsThreeDotsVertical />}
                <p>{!android ? "Tap on Share" : "Click on Three Dots"}</p>
              </li>
              <li className="flex items-center space-x-1 animate-flip-up">
                {!android ? <MdOutlineAddBox /> : <MdInstallMobile />}
                <p>{!android ? "Add to Home Screen" : "Click on Install"}</p>
              </li>
              <li className="flex items-center space-x-1 animate-flip-up">
                <RiHeadphoneLine />
                <p>Enjoy Listening!</p>
              </li>
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
