import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
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
    </>
  );
}
