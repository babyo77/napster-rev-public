import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";
import { auth, googleAuthProvider } from "./firebase";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
export default function Docs() {
  const [logged, setLogged] = useState<boolean>();

  const handleSignIn = () => {
    signInWithPopup(auth, googleAuthProvider).then(() => {
      window.location.href = " https://napster-docs.vercel.app/docs";
      setLogged(true);
    });
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "https://napster-docs.vercel.app/docs";
        setLogged(true);
      } else {
        setLogged(false);
      }
    });
    return () => unSub();
  }, []);

  return (
    <>
      <div className=" fade-in">
        <header className=" px-11 max-md:px-5 py-4 bg-transparent fixed w-full backdrop-blur-xl justify-between flex  z-10">
          <Link
            to={"/"}
            className="animate-fade-right font-bold text-lg max-md:text-lg"
          >
            Napster Docs 📚
          </Link>
          <ul className=" animate-fade-left flex text-lg text-zinc-200  items-center space-x-3">
            <a
              href="https://github.com/babyo77/napsterDrx-Public"
              target="_blank"
            >
              <FiGithub className=" hover:text-white duration-300 transition-all cursor-pointer" />
            </a>
            <a target="blank" href="https://twitter.com/tanmay11117">
              <FaXTwitter className="hover:text-white duration-300 transition-all cursor-pointer" />
            </a>
          </ul>
        </header>
        {logged ? (
          <></>
        ) : (
          <div className="bg-[09090B] fade-in font-semibold w-full min-h-screen flex justify-center items-center px-9 max-lg:text-4xl max-md:text-4xl text-7xl flex-col space-y-7 text-center max-md:px-4 overflow-hidden fixed -z-10">
            <Button
              onClick={handleSignIn}
              className="  py-6 animate-fade-up text-xl  max-md:text-base rounded-lg space-x-1"
            >
              <FcGoogle className="h-7 w-7" />
              <p>Continue with Google</p>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
