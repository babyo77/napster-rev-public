import "react-lazy-load-image-component/src/effects/blur.css";
import { AndroidScreenshots } from "./Andriod";

function InstallNapsterAndroid() {
  return (
    <div className="bg-white fade-in text-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] min-h-svh space-y-3 flex flex-col px-11 justify-center items-center py-7">
      <h2 className="text-xs text-center -mb-3 font-semibold ">
        install napster-drx(a PWA app) on your device
      </h2>
      <a
        className="underline underline-offset-4 text-[.7rem] text-blue-500 font-semibold"
        href="https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid&oco=2"
      >
        how to install?
      </a>
      <AndroidScreenshots />
      <p className="text-xs text-center">
        made for ios users specially as they can't install any mod like android
        users can{" "}
      </p>
      <a
        href="https://www.instagram.com/saagaarsiinggh/"
        className=" font-semibold text-xs  text-zinc-300"
      >
        Page Designed By{" "}
        <span className="underline underline-offset-2"> Sagar Pratap Singh</span>
      </a>
    </div>
  );
}

export default InstallNapsterAndroid;
