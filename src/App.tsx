import React, { useEffect, useState } from "react";
import Tabs from "./components/Footer/Tabs";
import { Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DATABASE_ID, ID, NEW_USER, db } from "./appwrite/appwriteConfig";

function AppComp() {
  const [token, setToken] = useState<string>("none");
  const [tester, setTester] = useState<boolean>();
  function ScreenSizeCheck() {
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    return isIPhone;
  }

  useEffect(() => {
    if (token == "babyo7_gtasisgta779") {
      setTester(true);
    }
    if (!localStorage.getItem("uid")) {
      localStorage.setItem("uid", uuidv4());
      try {
        db.createDocument(DATABASE_ID, NEW_USER, ID.unique(), {
          user: localStorage.getItem("uid") || "error",
          ios: ScreenSizeCheck(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [token]);

  const handleTester = async () => {
    const token = prompt("Enter your testing Token");
    setToken(token || "none");
  };

  const Compatible = ScreenSizeCheck();

  if (tester) {
    return (
      <>
        <Outlet />
        <Tabs />
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Tabs />
    </>
  );

  if (Compatible) {
    return (
      <div className=" w-full   fade-in flex-col h-screen flex justify-center items-center">
        <span className="text-base font-semibold text-zinc-400 py-3 px-4">
          Not optimized for Android now{" "}
          <span onClick={handleTester} className="text-red-500">
            Are you a tester?
          </span>
        </span>
      </div>
    );
  }
}

const App = React.memo(AppComp);

export default App;
