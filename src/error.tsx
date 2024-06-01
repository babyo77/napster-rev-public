import axios from "axios";
import { useEffect } from "react";
import { Navigate, useLocation, useRouteError } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";

function ErrorElement() {
  const location = useLocation();
  const error = useRouteError();
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  useEffect(() => {
    if (error) {
      alert("Something Went Wrong");
      window.location.reload();
      try {
        axios.get(
          `https://api.telegram.org/bot6178294062:AAEi72UVOgyEm_RhZqilO_ANsKcRcW06C-0/sendMessage?chat_id=5356614395&text=${encodeURIComponent(
            "user" + " " + uid + " " + location.pathname + " " + error ||
              //@ts-expect-error:route error
              error.message ||
              //@ts-expect-error:route error
              error.data
          )}"
              )}`
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [error, location, uid]);
  if (error) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="flex text-center leading-tight tracking-tight text-xl px-5 h-screen justify-center items-center">
      <p>
        Something went wrong restart app to fix <br /> {""}
        <a
          target="_blank"
          href="https://www.instagram.com/babyo7_/"
          className="underline underline-offset-4 text-red-500"
        >
          @report here.
        </a>
      </p>
    </div>
  );
}

export default ErrorElement;
