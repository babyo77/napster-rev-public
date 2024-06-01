import { useCallback, useEffect, useState } from "react";
import Check from "./components/Check";
import authService from "./appwrite/appwriteConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { v4 } from "uuid";
import { SetLoggedIn, Setuid } from "./Store/Player";
import axios from "axios";
import Loader2 from "./components/Loaders/loader2";

function Auth() {
  const LoggedIn = useSelector(
    (state: RootState) => state.musicReducer.loggedIn
  );
  const dispatch = useDispatch();
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  useEffect(() => {
    const authorize = async () => {
      const password = localStorage.getItem("pp");
      const uid = localStorage.getItem("uid");
      const email = localStorage.getItem("em");
      const noPass = v4();
      const noUid = v4();
      if (!password) {
        setStatus("Setting password");
        localStorage.setItem("pp", noPass);
      }
      if (!uid) {
        setStatus("setting uid");
        localStorage.setItem("uid", noUid);
      }

      if (!email) {
        const uid = localStorage.getItem("uid");
        if (uid) {
          setStatus("setting email");
          localStorage.setItem("em", `${uid}@napster.com`);
        }
      }

      const CheckPassword = localStorage.getItem("pp");
      const CheckUid = localStorage.getItem("uid");
      const CheckEmail = localStorage.getItem("em");

      setStatus("Logging in..");
      const isUserLoggedIn = await authService.isUserLoggedIn();
      if (isUserLoggedIn) {
        setStatus("Logging in..");
        try {
          dispatch(Setuid((await authService.getAccount()).$id));
        } catch (error) {
          console.log("error", error);
        }
        const r = setTimeout(() => {
          dispatch(SetLoggedIn(true));
        }, 700);
        return () => {
          clearTimeout(r);
        };
      } else {
        setStatus("Account Not Found");
        if (!CheckPassword) {
          setStatus("password not found");
        }

        if (!CheckUid) {
          setStatus("UID not found");
        }
        if (!CheckEmail) {
          setStatus("Email Not Found");
        }
        if (CheckEmail && CheckUid && !CheckEmail.startsWith(CheckUid)) {
          setStatus("Email Verification failed");
          setError(true);
        }
        if (
          CheckPassword &&
          CheckUid &&
          CheckEmail &&
          CheckEmail.startsWith(CheckUid)
        ) {
          setStatus("creating account");
          const account = await authService.createAccount(
            CheckUid,
            CheckEmail,
            CheckPassword
          );
          setStatus("Account Created");
          if (account) {
            setStatus("Logging in..");
            dispatch(SetLoggedIn(true));
          }
        }
      }
    };
    authorize().catch((error) => {
      console.log(error);
      axios.get(
        `https://api.telegram.org/bot6178294062:AAEi72UVOgyEm_RhZqilO_ANsKcRcW06C-0/sendMessage?chat_id=5356614395&text=${encodeURIComponent(
          error + " " + localStorage.getItem("uid") ||
            error.message + " " + localStorage.getItem("uid")
        )}`
      );
      setError(true);
      setStatus(error.message);
    });
  }, [dispatch]);

  const handleSwitch = useCallback(async () => {
    const id = prompt("Enter your token");
    if (id) {
      const pass = prompt("Enter your password");
      if (id && pass) {
        try {
          await authService.login(`${id}@napster.com`, pass);
          localStorage.setItem("uid", id);
          localStorage.setItem("pp", pass);
          window.location.reload();
        } catch (error) {
          //@ts-expect-error:ignore
          alert(error.message);
        }
      }
    }
  }, []);

  if (error) {
    return (
      <div className=" w-full relative flex flex-col px-5 font-semibold text-2xl leading-tight tracking-tight animate-fade-up text-center items-center justify-center h-dvh">
        <div className=" absolute bottom-4 text-xl px-5 text-pretty">
          <p
            onClick={() =>
              alert(
                localStorage.getItem("em") + "\n" + localStorage.getItem("uid")
              )
            }
          >
            Error {status}
          </p>
        </div>
        <p>
          Can't Authorize ! Please Contact{" "}
          <a href="https://twitter.com/tanmay11117" target="blank">
            <span className=" text-red-500">@tanmay </span>{" "}
          </a>
          <span> or try </span>
          <span className="text-red-500 cursor-pointer " onClick={handleSwitch}>
            login manually
          </span>
        </p>
      </div>
    );
  }
  return (
    <>
      {LoggedIn ? (
        <Check />
      ) : (
        <div className="  w-dvw flex leading-tight tracking-tight justify-center items-center h-dvh transition-all duration-500 font-semibold capitalize text-center">
          <Loader2 />
          <p className="hidden">{status}</p>
        </div>
      )}
    </>
  );
}

export default Auth;
